import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { BotClient } from "./@types";
import createInteraction from "./utils/createInteraction";
import registerSlashCommands from "./utils/registerSlashCommands";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
}) as BotClient;

client.once(Events.ClientReady, () => {
  client.user?.setActivity({
    name: "Spinning Wheels 🎡",
    type: ActivityType.Custom,
  });
  createInteraction(client);
  registerSlashCommands();
});

client.login(process.env.DISCORD_TOKEN);
