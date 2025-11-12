import { SlashCommandBuilder } from "discord.js";
import { Command, Interaction } from "../@types";
import { Commands } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const remove: Command["default"] = {
  data: new SlashCommandBuilder()
    .setName(Commands.Remove)
    .setDescription("Remove an item from the wheel by name.")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The name of the item you want to remove.")
        .setRequired(true)
    ),
  async execute(interaction: Interaction) {
    const items = getGuildItems(interaction.guildId);

    const target = interaction.options.getString("item", true);
    const index = items.findIndex((i) => i === target);
    if (index === -1) {
      return interaction.reply(`❌ Item **${target}** not found.`);
    }

    const removed = items.splice(index, 1)[0];

    itemsByGuild.set(interaction.guildId, items);

    await interaction.reply(`🗑️ Removed: **${removed}**`);
  },
};

export default remove;
