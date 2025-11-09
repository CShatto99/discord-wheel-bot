import {
  Client,
  Collection,
  BaseInteraction as DiscordBaseInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type BotClient = Client & {
  commands: Collection<unknown, unknown>;
};

export type BaseInteraction = DiscordBaseInteraction & {
  client: {
    commands: BotClient;
  };
};

export type Command = {
  default: {
    data: SlashCommandBuilder;
    execute(interaction: DiscordBaseInteraction): Promise<void>;
    autocomplete(interaction: DiscordBaseInteraction): Promise<void>;
  };
};
