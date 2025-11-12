import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands } from "../constants";
import { itemsByGuild } from "../state/itemsByGuild";

const reset: Command["default"] = {
	data: new SlashCommandBuilder()
		.setName(Commands.Reset)
		.setDescription("Reset the wheel"),
	async execute(interaction: Interaction) {
		if (itemsByGuild.has(interaction.guildId)) {
			itemsByGuild.delete(interaction.guildId);
			await interaction.reply("🔄 The wheel has been reset.");
		} else {
			await interaction.reply("ℹ️ There was no active wheel to reset.");
		}
	},
};

export default reset;
