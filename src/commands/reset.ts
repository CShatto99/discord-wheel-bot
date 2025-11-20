import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands } from "../constants";
import { itemsByGuild } from "../state/itemsByGuild";

const reset: Command = {
  data: new SlashCommandBuilder()
    .setName(Commands.Reset.name)
    .setDescription(Commands.Reset.description),
  async execute(interaction: Interaction) {
    if (itemsByGuild.has(interaction.guildId)) {
      itemsByGuild.delete(interaction.guildId);
      return interaction.reply("🔄 The wheel has been reset.");
    }

    await interaction.reply("ℹ️ There was no active wheel to reset.");
  },
};

export default reset;
