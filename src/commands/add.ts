import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, MAX_ITEMS_PER_GUILD } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const MAX_ITEM_LENGTH = 20;

const add: Command = {
  data: new SlashCommandBuilder()
    .setName(Commands.Add)
    .setDescription(
      `Add one or more items to the wheel (space-separated, max ${MAX_ITEM_LENGTH} chars per item)`
    )
    .addStringOption((option) =>
      option
        .setName("items")
        .setDescription("Items to add (separate with spaces)")
        .setRequired(true)
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
      (i) => i.length <= MAX_ITEM_LENGTH
    );

    const availableSlots = MAX_ITEMS_PER_GUILD - items.length;

    if (availableSlots <= 0) {
      return interaction.reply(
        `🚫 You already have ${MAX_ITEMS_PER_GUILD} items. Remove some first before adding more.`
      );
    }

    const itemsToAdd = validLengthItems.slice(0, availableSlots);
    const rejectedCount =
      tooLongItems.length +
      Math.max(validLengthItems.length - itemsToAdd.length, 0);

    items.push(...itemsToAdd);
    itemsByGuild.set(interaction.guildId, items);

    let message = `✅ Added: **${itemsToAdd.join(", ")}**`;
    if (rejectedCount > 0) {
      if (tooLongItems.length > 0) {
        message += `\n⚠️ ${tooLongItems.length} item(s) were too long and were not added.`;
      }
      if (validLengthItems.length > itemsToAdd.length) {
        message += `\n⚠️ ${
          validLengthItems.length - itemsToAdd.length
        } item(s) could not be added because the wheel reached its limit of ${MAX_ITEMS_PER_GUILD}.`;
      }
    }

    await interaction.reply(message);
  },
};

export default add;
