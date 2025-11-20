import {
	type APIEmbedField,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, EMBED_COLOR } from "../constants";

const help: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Help.name)
		.setDescription(Commands.Help.description)
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("Get help for a specific command")
				.setRequired(false),
		),
	async execute(interaction: Interaction) {
		const commandName = interaction.options.getString("command");

		if (commandName) {
			const cmd = Object.values(Commands).find(
				(c) => c.name.toLowerCase() === commandName.toLowerCase(),
			);
			if (!cmd) {
				return interaction.reply(`❌ Command "${commandName}" not found.`);
			}

			const fields: APIEmbedField[] = [];

			if (cmd.usage) {
				fields.push({ name: "Usage", value: `\`${cmd.usage}\`` });
			}
			if (cmd.example) {
				fields.push({ name: "Example", value: `\`${cmd.example}\`` });
			}

			const embed = new EmbedBuilder()
				.setTitle(`Help: /${cmd.name}`)
				.setDescription(cmd.description)
				.addFields(fields)
				.setColor(EMBED_COLOR);

			await interaction.reply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setTitle("🎡 Wheel Bot Commands")
				.setDescription(
					"Use `/help <command>` to get more info about a specific command.",
				)
				.setColor(EMBED_COLOR);

			Object.values(Commands).forEach((c) => {
				embed.addFields({ name: `/${c.name}`, value: c.description });
			});

			await interaction.reply({ embeds: [embed] });
		}
	},
};

export default help;
