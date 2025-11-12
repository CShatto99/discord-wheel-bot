import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, EMBED_COLOR } from "../constants";
import getGuildItems from "../state/itemsByGuild";

const list: Command["default"] = {
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
			.setFooter({ text: `Total items: ${items.length}` });

		await interaction.reply({ embeds: [embed] });
	},
};

export default list;
