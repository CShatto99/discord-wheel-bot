import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";
import shuffleArray from "../utils/shuffleArray";

const shuffle: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Shuffle.name)
		.setDescription(Commands.Shuffle.description),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);

		if (items.length === 0) {
			return interaction.reply(
				`There's nothing to shuffle! Add items first with \`/${Commands.Add.name}\`.`,
			);
		}

		shuffleArray(items);
		itemsByGuild.set(interaction.guildId, items);

		await interaction.reply("🔀 The wheel items have been shuffled!");
	},
};

export default shuffle;
