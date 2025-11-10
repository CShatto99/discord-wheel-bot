import { EmbedBuilder, Events, Interaction } from "discord.js";
import { BotClient } from "../@types";
import { Commands } from "../constants";
import shuffle from "./shuffle";

type CommandHelp = {
  name: string;
  description: string;
  usage?: string;
  example?: string;
};

const commandHelps: CommandHelp[] = [
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

    if (command === Commands.Help) {
      const commandName = interaction.options.getString("command");

      if (commandName) {
        const cmd = commandHelps.find(
          (c) => c.name.toLowerCase() === commandName.toLowerCase()
        );
        if (!cmd) {
          await interaction.reply(`❌ Command "${commandName}" not found.`);
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle(`Help: /${cmd.name}`)
          .setDescription(cmd.description)
          .addFields(
            { name: "Usage", value: `\`${cmd.usage}\`` },
            { name: "Example", value: `\`${cmd.example}\`` }
          )
          .setColor(0x00ffff);

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("🎡 Wheel Bot Commands")
          .setDescription(
            "Use `/help <command>` to get more info about a specific command."
          )
          .setColor(0x00ffff);

        commandHelps.forEach((c) => {
          embed.addFields({ name: `/${c.name}`, value: c.description });
        });

        await interaction.reply({ embeds: [embed] });
      }
    }
  });
}
