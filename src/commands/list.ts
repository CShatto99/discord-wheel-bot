import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, EMBED_COLOR, MAX_ITEMS_PER_GUILD } from "../constants";
import getGuildItems from "../state/itemsByGuild";

const list: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.List)
		.setDescription("Show all current items"),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);

		if (items.length === 0) {
			return interaction.reply(
				`The wheel is empty! Add items first with \`/${Commands.Add}\`.`,
			);
		}

		const embed = new EmbedBuilder()
			.setTitle("🎡 Current Wheel Items")
			.setDescription(items.map((i, idx) => `**${idx + 1}.** ${i}`).join("\n"))
			.setColor(EMBED_COLOR)
			.setFooter({
				text: `Total items: ${items.length}/${MAX_ITEMS_PER_GUILD}`,
			});

		await interaction.reply({ embeds: [embed] });
	},
};

export default list;
