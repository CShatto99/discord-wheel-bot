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

const MAX_ITEMS_PER_GUILD = 100;

/**
 * Sets up an event handler for handling Discord interactions.
 */
export default function createInteractions(client: BotClient) {
  const itemsByGuild = new Map<string, string[]>();

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) {
      return;
    }

    const guildId = interaction.guildId;
    const command = interaction.commandName;

    if (!itemsByGuild.has(guildId)) {
      itemsByGuild.set(guildId, []);
    }
    const items = itemsByGuild.get(guildId)!;

    if (command === Commands.Add) {
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
          `🚫 You already have ${MAX_ITEMS_PER_GUILD} items. Remove some first before adding more.`
        );
      }

      const itemsToAdd = newItems.slice(0, availableSlots);
      const rejectedItems = newItems.slice(availableSlots);

      items.push(...itemsToAdd);
      itemsByGuild.set(guildId, items);

      let message = `✅ Added: **${itemsToAdd.join(", ")}**`;

      if (rejectedItems.length > 0) {
        message += `\n⚠️ The following couldn't be added because the wheel reached its limit of ${MAX_ITEMS_PER_GUILD}: **${rejectedItems.join(
          ", "
        )}**`;
      }

      await interaction.reply(message);
    }

    if (command === Commands.List) {
      if (items.length === 0) {
        return interaction.reply(
          `The wheel is empty! Add items first with \`/${Commands.Add}\`.`
        );
      }

      await interaction.reply(
        `🎯 Current list:\n${items
          .map((i, idx) => `${idx + 1}. ${i}`)
          .join("\n")}`
      );
    }

    if (command === Commands.Spin) {
      if (items.length === 0) {
        return interaction.reply(
          `There's nothing to spin! Add items first with \`/${Commands.Add}\`.`
        );
      }

      const randomIndex = Math.floor(Math.random() * items.length);
      const selected = items.splice(randomIndex, 1)[0];

      itemsByGuild.set(guildId, items);

      await interaction.reply(
        `🎡 **The Wheel has spoken.** The chosen one is: **${selected}**.\nRemaining: ${
          items.length > 0 ? items.join(", ") : "None left!"
        }`
      );
    }

    if (command === Commands.Reset) {
      itemsByGuild.set(guildId, []);
      await interaction.reply("🔄 The wheel has been reset.");
    }

    if (command === Commands.Remove) {
      const target = interaction.options.getString("item", true);
      const index = items.findIndex((i) => i === target);
      if (index === -1) {
        return interaction.reply(`❌ Item **${target}** not found.`);
      }

      const removed = items.splice(index, 1)[0];

      itemsByGuild.set(guildId, items);

      await interaction.reply(`🗑️ Removed: **${removed}**`);
    }

    if (command === Commands.Shuffle) {
      if (items.length === 0) {
        return interaction.reply(
          `There's nothing to shuffle! Add items first with \`/${Commands.Add}\`.`
        );
      }

      shuffle(items);
      itemsByGuild.set(guildId, items);
      await interaction.reply("🔀 The wheel items have been shuffled!");
    }

    if (command === Commands.Help) {
      const commandName = interaction.options.getString("command");

      if (commandName) {
        const cmd = COMMAND_HELPS.find(
          (c) => c.name.toLowerCase() === commandName.toLowerCase()
        );
        if (!cmd) {
          return interaction.reply(`❌ Command "${commandName}" not found.`);
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

        COMMAND_HELPS.forEach((c) => {
          embed.addFields({ name: `/${c.name}`, value: c.description });
        });

        await interaction.reply({ embeds: [embed] });
      }
    }
  });
}
