import type {
  ChatInputCommandInteraction,
  Client,
  Collection,
  InteractionResponse,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type BotClient = Client & {
  commands: Collection<string, Command>;
};

export type Interaction = ChatInputCommandInteraction & {
  guildId: string;
};

export type Command = {
  data: SlashCommandOptionsOnlyBuilder;
  execute(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean> | undefined>;
};

export type CommandKey =
  | "Add"
  | "Help"
  | "List"
  | "Remove"
  | "Reset"
  | "Shuffle"
  | "Spin";
export type CommandData = {
  name: string;
  description: string;
  usage?: string;
  example?: string;
};
