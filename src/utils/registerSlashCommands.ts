import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { Commands } from "../constants";

/**
 * Registers and updates Discord slash commands for the bot.
 */
export default async function registerSlashCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName(Commands.Add)
      .setDescription("Add one or more items to the wheel (space-separated)")
      .addStringOption((option) =>
        option
          .setName("items")
          .setDescription("Items to add (separate with spaces)")
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName(Commands.List)
      .setDescription("Show all current items"),

    new SlashCommandBuilder()
      .setName(Commands.Spin)
      .setDescription("Spin the wheel and remove the selected item"),

    new SlashCommandBuilder()
      .setName(Commands.Reset)
      .setDescription("Reset the wheel"),

    new SlashCommandBuilder()
      .setName(Commands.Remove)
      .setDescription("Remove an item from the wheel by name.")
      .addStringOption((option) =>
        option
          .setName("item")
          .setDescription("The name of the item you want to remove.")
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName(Commands.Shuffle)
      .setDescription("Shuffle all items in the wheel randomly."),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  (async () => {
    try {
      console.log(
        `⏳ Refreshing ${commands.length} application (/) commands...`
      );

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          process.env.GUILD_ID!
        ),
        { body: commands }
      );

      console.log(
        `✅ Successfully registered ${commands.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  })();
}
