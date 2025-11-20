import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import {
	Commands,
	EMBED_COLOR,
	MAX_ITEM_LENGTH,
	MAX_ITEMS_PER_GUILD,
} from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const add: Command = {
	data: new SlashCommandBuilder()
		.setName(Commands.Add.name)
		.setDescription(Commands.Add.description)
		.addStringOption((option) =>
			option
				.setName("items")
				.setDescription("Items to add (separate with spaces)")
				.setRequired(true),
		),
	async execute(interaction: Interaction) {
		const items = getGuildItems(interaction.guildId);
		const itemsInput = interaction.options.getString("items", true);

		const parsedItems = itemsInput
			.split(/\s+/)
			.map((i) => i.trim())
			.filter(Boolean);

		if (parsedItems.length === 0) {
			return interaction.reply("❗ No valid items provided!");
		}

		const tooLongItems = parsedItems.filter((i) => i.length > MAX_ITEM_LENGTH);
		const validLengthItems = parsedItems.filter(
			(i) => i.length <= MAX_ITEM_LENGTH,
		);

		const availableSlots = MAX_ITEMS_PER_GUILD - items.length;

		if (availableSlots <= 0) {
			return interaction.reply(
				`🚫 You already have ${MAX_ITEMS_PER_GUILD} items. Remove some first before adding more.`,
			);
		}

		const itemsToAdd = validLengthItems.slice(0, availableSlots);
		const rejectedCount =
			tooLongItems.length +
			Math.max(validLengthItems.length - itemsToAdd.length, 0);

		items.push(...itemsToAdd);
		itemsByGuild.set(interaction.guildId, items);

		const embeds = [];
		let message = "";

		if (itemsToAdd.length > 0) {
			const itemWord = itemsToAdd.length === 1 ? "item" : "items";
			const embed = new EmbedBuilder()
				.setTitle(`✅ Added ${itemsToAdd.length} ${itemWord}`)
				.setDescription(
					itemsToAdd.map((i, idx) => `**${idx + 1}.** ${i}`).join("\n"),
				)
				.setColor(EMBED_COLOR)
				.setFooter({
					text: `Total items: ${items.length}/${MAX_ITEMS_PER_GUILD}`,
				});
			embeds.push(embed);
		}

		if (rejectedCount > 0) {
			if (tooLongItems.length > 0) {
				if (tooLongItems.length === 1) {
					message += `⚠️ ${tooLongItems.length} item was too long and was not added.\n`;
				} else {
					message += `⚠️ ${tooLongItems.length} items were too long and were not added.\n`;
				}
			}
			if (validLengthItems.length > itemsToAdd.length) {
				const itemWord =
					validLengthItems.length - itemsToAdd.length === 1 ? "item" : "items";
				message += `⚠️ ${
					validLengthItems.length - itemsToAdd.length
				} ${itemWord} could not be added because the wheel reached its limit of ${MAX_ITEMS_PER_GUILD}.\n`;
			}
		}

		await interaction.reply({ content: message || undefined, embeds });
	},
};

export default add;
