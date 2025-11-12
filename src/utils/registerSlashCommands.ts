import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Command } from "../@types";

/**
 * Registers or updates Discord slash commands for the bot.
 */
export default async function registerSlashCommands() {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const importPromises: Promise<Command>[] = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(process.env.NODE_ENV === "production" ? ".js" : ".ts")
    );

  commandsFiles.forEach(async (file) => {
    const filePath = path.join(commandsPath, file);
    importPromises.push(import(pathToFileURL(filePath).href));
  });

  const importedCommands = await Promise.all(importPromises);
  importedCommands.forEach((file) => {
    commands.push(file.default.data.toJSON());
  });

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const route =
      process.env.NODE_ENV === "production"
        ? Routes.applicationCommands(process.env.CLIENT_ID!)
        : Routes.applicationGuildCommands(
            process.env.CLIENT_ID!,
            process.env.GUILD_ID!
          );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(route, { body: commands })) as {
      length: number;
    };

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}
