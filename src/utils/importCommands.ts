import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Collection } from "discord.js";
import type { BotClient, Command } from "../@types";
import { env } from "../config/env";

/**
 * Imports and initializes commands for the Discord bot.
 */
export default async function importCommands(client: BotClient) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(env.NODE_ENV === "production" ? ".js" : ".ts")
    );

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    let command = await import(pathToFileURL(filePath).href);
    while (command.default) {
      command = command.default;
    }

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
