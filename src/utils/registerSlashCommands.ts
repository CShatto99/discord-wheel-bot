import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import type { Command } from "../@types";
import { env } from "../config/env";

/**
 * Registers or updates Discord slash commands for the bot.
 */
export default async function registerSlashCommands(
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
) {
  const rest = new REST().setToken(env.DISCORD_TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const route =
      env.NODE_ENV === "production"
        ? Routes.applicationCommands(env.CLIENT_ID)
        : Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID);

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
