import type { CommandData, CommandKey } from "../@types";

export const EMBED_COLOR = 0x5865f2;
export const MAX_ITEMS_PER_GUILD = 100;
export const MAX_ITEM_LENGTH = 20;

export const Commands: Record<CommandKey, CommandData> = {
  Add: {
    name: "add",
    description: `Add one or more items to the wheel (space-separated, max ${MAX_ITEM_LENGTH} chars per item)`,
    usage: "/add <items>",
    example: "/add apple banana cherry",
  },
  Help: {
    name: "help",
    description: "Show help information for commands.",
    usage: "/help [command]",
  },
  List: {
    name: "list",
    description: "Show all current items.",
    usage: "/list",
  },
  Remove: {
    name: "remove",
    description: "Remove an item from the wheel by name.",
    usage: "/remove <item>",
    example: "/remove banana",
  },
  Reset: {
    name: "reset",
    description: "Reset the wheel, removing all items.",
    usage: "/reset",
  },
  Shuffle: {
    name: "shuffle",
    description: "Shuffle all items in the wheel randomly.",
    usage: "/shuffle",
  },
  Spin: {
    name: "spin",
    description:
      "Spin the wheel and remove the selected item. Specify a count to spin multiple times.",
    usage: "/spin [count]",
    example: "/spin 3",
  },
} as const;
