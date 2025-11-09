import { REST, Routes, SlashCommandBuilder } from "discord.js";

/**
 * Registers or updates Discord slash commands for the bot.
 *
 * @function
 * @returns A Promise that resolves when the commands are successfully registered or updated.
 */
export default async function registerSlashCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName("add")
      .setDescription("Add one or more items to the wheel (space-separated)")
      .addStringOption((option) =>
        option
          .setName("items")
          .setDescription(
            "Items to add, separated by spaces (e.g. Alice Bob Charlie)"
          )
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName("list")
      .setDescription("Show all current items"),

    new SlashCommandBuilder()
      .setName("spin")
      .setDescription("Spin the wheel and remove the selected item"),

    new SlashCommandBuilder()
      .setName("reset")
      .setDescription("Reset the wheel"),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  (async () => {
    try {
      console.log("⏳ Refreshing application (/) commands...");

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          process.env.GUILD_ID!
        ),
        { body: commands }
      );

      console.log("✅ Successfully registered application commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}
