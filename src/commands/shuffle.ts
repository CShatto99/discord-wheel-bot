import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";
import shuffleArray from "../utils/shuffleArray";

const shuffle: Command["default"] = {
	data: new SlashCommandBuilder()
		.setName(Commands.Shuffle)
		.setDescription("Shuffle all items in the wheel randomly."),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);

		if (items.length === 0) {
			return interaction.reply(
				`There's nothing to shuffle! Add items first with \`/${Commands.Add}\`.`,
			);
		}

		shuffleArray(items);
		itemsByGuild.set(interaction.guildId, items);

		await interaction.reply("🔀 The wheel items have been shuffled!");
	},
};

export default shuffle;
