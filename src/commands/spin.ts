import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, EMBED_COLOR } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const spin: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Spin)
		.setDescription("Spin the wheel and remove the selected item")
		.addIntegerOption((option) =>
			option
				.setName("count")
				.setDescription("Number of times to spin the wheel")
				.setRequired(false)
				.setMinValue(1),
		),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);
		if (items.length === 0) {
			return interaction.reply(
				`There's nothing to spin! Add items first with \`/${Commands.Add}\`.`,
			);
		}

		const spinCount = Math.min(
			interaction.options.getInteger("count") ?? 1,
			items.length,
		);

		await interaction.reply(
			spinCount > 1
				? `🎡 Spinning the wheel ${spinCount} times...`
				: `🎡 Spinning the wheel...`,
		);

		for (let i = 0; i < spinCount && items.length > 0; i++) {
			const randomIndex = Math.floor(Math.random() * items.length);
			const selected = items.splice(randomIndex, 1)[0];

			itemsByGuild.set(interaction.guildId, items);

			// Wait 2 seconds for suspense
			await sleep(2000);

			// Update embed with current spin
			const embed = new EmbedBuilder()
				.setTitle("🎡 The Wheel Has Spoken!")
				.setDescription(`**🎯 Selected:** ${selected}`)
				.addFields({
					name: "Remaining Items",
					value:
						items.length > 0
							? items.map((i, idx) => `**${idx + 1}.** ${i}`).join("\n")
							: "✨ None left!",
				})
				.setColor(EMBED_COLOR)
				.setFooter({ text: `Total remaining: ${items.length}` });

			await interaction.followUp({ embeds: [embed] });
		}
	},
};

export default spin;
