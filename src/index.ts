import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
} from "discord.js";
import dotenv from "dotenv";
import { BotClient, Command } from "./@types";
import importCommands from "./utils/importCommands";
import registerSlashCommands from "./utils/registerSlashCommands";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as BotClient;

client.once(Events.ClientReady, (readyClient) => {
  readyClient.user.setActivity({
    name: "Spinning Wheels 🎡",
    type: ActivityType.Custom,
  });
  importCommands(client);
  registerSlashCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || !interaction.guildId) return;

  const command = client.commands.get(interaction.commandName) as Command;

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
