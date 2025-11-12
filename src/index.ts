import {
	ActivityType,
	Client,
	Events,
	GatewayIntentBits,
	MessageFlags,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import "dotenv/config";
import type { BotClient, Command } from "./@types";
import { env } from "./config/env";
import importCommands from "./utils/importCommands";
import registerSlashCommands from "./utils/registerSlashCommands";

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as BotClient;

client.once(Events.ClientReady, async (readyClient) => {
	readyClient.user.setActivity({
		name: "Spinning Wheels 🎡",
		type: ActivityType.Custom,
	});

	// Import commands and store in client.commands
	await importCommands(client);

	// Register commands with Discord
	const commandsArray: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
		Array.from(client.commands.values()).map((cmd) => cmd.data.toJSON());
	await registerSlashCommands(commandsArray);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand() || !interaction.guildId) return;

	const command = client.commands.get(interaction.commandName) as Command;

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
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

client.login(env.DISCORD_TOKEN);
