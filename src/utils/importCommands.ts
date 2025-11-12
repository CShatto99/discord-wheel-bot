import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { BotClient, Command } from "../@types";

/**
 * Imports and initializes commands for the Discord bot.
 */
export default async function importCommands(client: BotClient) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(process.env.NODE_ENV === "production" ? ".js" : ".ts")
    );

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const command: Command = await import(fileUrl);

    if ("data" in command.default && "execute" in command.default) {
      client.commands.set(command.default.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
