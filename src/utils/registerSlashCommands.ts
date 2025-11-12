import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Registers or updates Discord slash commands for the bot.
 */
export default async function registerSlashCommands() {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(process.env.NODE_ENV === "production" ? ".js" : ".ts")
    );

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const imported = await import(fileUrl);

    if (!imported?.default?.data || !imported.default.execute) {
      console.warn(
        `[WARNING] The command at ${file} is missing "data" or "execute".`
      );
      continue;
    }

    commands.push(imported.default.data.toJSON());
  }

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
