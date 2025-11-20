import { SlashCommandBuilder } from "discord.js";
import type { Command, Interaction } from "../@types";
import { Commands, MAX_ITEMS_PER_GUILD } from "../constants";
import getGuildItems, { itemsByGuild } from "../state/itemsByGuild";

const MAX_ITEM_LENGTH = 20;

const add: Command = {
  data: new SlashCommandBuilder()
    .setName(Commands.Add)
    .setDescription("Add one or more items to the wheel (space-separated)")
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

    if (validLengthItems.length === 0) {
      return interaction.reply(
        `🚫 All items were too long! Max length is **${MAX_ITEM_LENGTH}** characters.\n❌ Invalid: **${tooLongItems.join(
          ", "
        )}**`
      );
    }

    const availableSlots = MAX_ITEMS_PER_GUILD - items.length;

    if (availableSlots <= 0) {
      return interaction.reply(
        `🚫 You already have ${MAX_ITEMS_PER_GUILD} items. Remove some first before adding more.`
      );
    }

    const itemsToAdd = validLengthItems.slice(0, availableSlots);

    const rejectedItems = [
      ...validLengthItems.slice(availableSlots),
      ...tooLongItems,
    ];

    // Update state
    items.push(...itemsToAdd);
    itemsByGuild.set(interaction.guildId, items);

    items.push(...itemsToAdd);
    itemsByGuild.set(interaction.guildId, items);

    let message = `✅ Added: **${itemsToAdd.join(", ")}**\n`;

    if (rejectedItems.length > 0) {
      const tooLong = tooLongItems.length
        ? `\n⚠️ The following were too long (max ${MAX_ITEM_LENGTH} chars): **${tooLongItems.join(
            ", "
          )}**`
        : "";

      const tooMany =
        validLengthItems.length > itemsToAdd.length
          ? `\n⚠️ These couldn't be added because the wheel reached its limit of ${MAX_ITEMS_PER_GUILD}: **${validLengthItems
              .slice(availableSlots)
              .join(", ")}**`
          : "";

      message += tooLong + tooMany;
    }

    await interaction.reply(message);
  },
};

export default add;
