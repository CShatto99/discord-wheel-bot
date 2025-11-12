import type { Interaction } from "../@types";

/**
 * Keeps track of items per guild during runtime.
 * Key = guild ID
 * Value = array of item IDs or names
 */
export const itemsByGuild = new Map<string, string[]>();

export default function getGuildItems(guildId: Interaction["guildId"]) {
	if (!itemsByGuild.has(guildId)) {
		itemsByGuild.set(guildId, []);
	}
	return itemsByGuild.get(guildId)!;
}
