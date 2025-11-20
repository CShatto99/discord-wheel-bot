import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, MAX_ITEMS_PER_GUILD } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const add: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Add)
		.setDescription("Add one or more items to the wheel (space-separated)")
		.addStringOption((option) =>
			option
				.setName("items")
				.setDescription("Items to add (separate with spaces)")
				.setRequired(true),
		),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);

		const itemsInput = interaction.options.getString("items", true);

		const newItems = itemsInput
			.split(/\s+/)
			.map((i) => i.trim())
			.filter(Boolean)
			.filter((i) => !items.includes(i));

		if (newItems.length === 0) {
			return interaction.reply("❗ None of these items are new or valid!");
		}

		const availableSlots = MAX_ITEMS_PER_GUILD - items.length;

		if (availableSlots <= 0) {
			return interaction.reply(
				`🚫 You already have ${MAX_ITEMS_PER_GUILD} items. Remove some first before adding more.`,
			);
		}

		const itemsToAdd = newItems.slice(0, availableSlots);
		const rejectedItems = newItems.slice(availableSlots);

		items.push(...itemsToAdd);
		itemsByGuild.set(interaction.guildId, items);

		let message = `✅ Added: **${itemsToAdd.join(", ")}**`;

		if (rejectedItems.length > 0) {
			message += `\n⚠️ The following couldn't be added because the wheel reached its limit of ${MAX_ITEMS_PER_GUILD}: **${rejectedItems.join(
				", ",
			)}**`;
		}

		await interaction.reply(message);
	},
};

export default add;
