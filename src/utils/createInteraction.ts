import { Events, Interaction } from "discord.js";
import { BotClient } from "../@types";
import { Commands } from "../constants";
import shuffle from "./shuffle";

/**
 * Sets up an event handler for handling Discord interactions.
 */
export default function createInteractions(client: BotClient) {
  let items: string[] = [];

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.commandName;

    if (command === Commands.Add) {
      const itemsInput = interaction.options.getString("items", true);

      // Split on spaces, trim, remove empty strings
      const newItems = itemsInput
        .split(/\s+/)
        .map((i) => i.trim())
        .filter(Boolean)
        // Only keep items not already in the array
        .filter((i) => !items.includes(i));

      if (newItems.length === 0) {
        await interaction.reply("❗ None of these items are new or valid!");
        return;
      }
      items.push(...newItems);
      await interaction.reply(`✅ Added: **${newItems.join(", ")}**`);
    }

    if (command === Commands.List) {
      if (items.length === 0) {
        await interaction.reply(
          `The wheel is empty! Add items first with \`/${Commands.Add}\`.`
        );
      } else {
        await interaction.reply(
          `🎯 Current list:\n${items
            .map((i, idx) => `${idx + 1}. ${i}`)
            .join("\n")}`
        );
      }
    }

    if (command === Commands.Spin) {
      if (items.length === 0) {
        await interaction.reply(
          `There's nothing to spin! Add items first with \`/${Commands.Add}\`.`
        );
      } else {
        const randomIndex = Math.floor(Math.random() * items.length);
        const selected = items.splice(randomIndex, 1)[0];
        await interaction.reply(
          `🎡 **The Wheel has spoken.** The chosen one is: **${selected}**.\nRemaining: ${
            items.length > 0 ? items.join(", ") : "None left!"
          }`
        );
      }
    }

    if (command === Commands.Reset) {
      items = [];
      await interaction.reply("🔄 The wheel has been reset.");
    }

    if (command === Commands.Remove) {
      const target = interaction.options.getString("item", true);
      const index = items.findIndex((i) => i === target);
      if (index === -1)
        return interaction.reply(`❌ Item **${target}** not found.`);
      const removed = items.splice(index, 1)[0];
      await interaction.reply(`🗑️ Removed: **${removed}**`);
    }

    if (command === Commands.Shuffle) {
      if (items.length === 0) {
        await interaction.reply(
          `There's nothing to shuffle! Add items first with \`/${Commands.Add}\`.`
        );
      } else {
        shuffle(items);
        await interaction.reply("🔀 The wheel items have been shuffled!");
      }
    }
  });
}
