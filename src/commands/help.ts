import {
	type APIEmbedField,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, EMBED_COLOR } from "../constants";

type CommandHelp = {
	name: string;
	description: string;
	usage?: string;
	example?: string;
};

const COMMAND_HELPS: CommandHelp[] = [
	{
		name: Commands.Add,
		description: "Add one or more items to the wheel (space-separated).",
		usage: "/add <items>",
		example: "/add apple banana cherry",
	},
	{
		name: Commands.List,
		description: "Show all current items.",
		usage: "/list",
	},
	{
		name: Commands.Spin,
		description: "Spin the wheel and remove the selected item.",
		usage: "/spin",
	},
	{
		name: Commands.Reset,
		description: "Reset the wheel, removing all items.",
		usage: "/reset",
	},
	{
		name: Commands.Remove,
		description: "Remove an item from the wheel by name.",
		usage: "/remove <item>",
		example: "/remove banana",
	},
	{
		name: Commands.Shuffle,
		description: "Shuffle all items in the wheel randomly.",
		usage: "/shuffle",
	},
];

const help: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Help)
		.setDescription(
			"Show a list of all commands or details for a specific command.",
		)
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("Get help for a specific command")
				.setRequired(false),
		),
	async execute(interaction: Interaction) {
		const commandName = interaction.options.getString("command");

		if (commandName) {
			const cmd = COMMAND_HELPS.find(
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

			COMMAND_HELPS.forEach((c) => {
				embed.addFields({ name: `/${c.name}`, value: c.description });
			});

			await interaction.reply({ embeds: [embed] });
		}
	},
};

export default help;
