import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  InteractionResponse,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type BotClient = Client & {
  commands: Collection<unknown, unknown>;
};

export type Interaction = ChatInputCommandInteraction & {
  guildId: string;
};

export type Command = {
  default: {
    data: SlashCommandOptionsOnlyBuilder;
    execute(
      interaction: ChatInputCommandInteraction
    ): Promise<InteractionResponse<boolean> | undefined | void>;
  };
};
