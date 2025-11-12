import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { BotClient, Command } from "../@types";

/**
 * Imports and initializes commands for the Discord bot.
 */
export default function importCommands(client: BotClient) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(process.env.NODE_ENV === "production" ? ".js" : ".ts")
    );

  commandsFiles.forEach(async (file) => {
    const filePath =
      process.env.NODE_ENV === "production"
        ? path.join(commandsPath, file)
        : pathToFileURL(path.join(commandsPath, file)).href;

    const command: Command = await import(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command.default && "execute" in command.default) {
      client.commands.set(command.default.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });
}
