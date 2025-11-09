import { Events, Interaction } from "discord.js";
import dotenv from "dotenv";
import { BotClient } from "../@types";
dotenv.config();

export default function createInteractions(client: BotClient) {
  let items: string[] = [];

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.commandName;

    if (command === "add") {
      const itemsInput = interaction.options.getString("items", true);

      // Split on spaces, trim, and remove empty strings
      const newItems = itemsInput
        .split(/\s+/)
        .map((i) => i.trim())
        .filter(Boolean);

      if (newItems.length === 0) {
        await interaction.reply("❗ Please provide at least one valid item!");
        return;
      }

      items.push(...newItems);
      await interaction.reply(`✅ Added: **${newItems.join(", ")}**`);
    }

    if (command === "list") {
      if (items.length === 0) {
        await interaction.reply("The wheel is empty!");
      } else {
        await interaction.reply(
          `🎯 Current list:\n${items
            .map((i, idx) => `${idx + 1}. ${i}`)
            .join("\n")}`
        );
      }
    }

    if (command === "spin") {
      if (items.length === 0) {
        await interaction.reply(
          "There's nothing to spin! Add items first with `/add`."
        );
      } else {
        const randomIndex = Math.floor(Math.random() * items.length);
        const selected = items.splice(randomIndex, 1)[0];
        await interaction.reply(
          `🎡 **The Wheel has spoken.**\n The chosen one is: **${selected}**.\nRemaining: ${
            items.length > 0 ? items.join(", ") : "None left!"
          }`
        );
      }
    }

    if (command === "reset") {
      items = [];
      await interaction.reply("🔄 The wheel has been reset.");
    }
  });
}
