import { get } from "env-var";

export const env = {
	NODE_ENV: get("NODE_ENV")
		.default("development")
		.asEnum(["development", "production", "test"]),
	DISCORD_TOKEN: get("DISCORD_TOKEN").required().asString(),
	CLIENT_ID: get("CLIENT_ID").required().asString(),
	GUILD_ID: get("GUILD_ID").required().asString(),
};
