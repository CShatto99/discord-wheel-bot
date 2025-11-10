"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const createInteraction_1 = __importDefault(require("./utils/createInteraction"));
const registerSlashCommands_1 = __importDefault(require("./utils/registerSlashCommands"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
});
client.once(discord_js_1.Events.ClientReady, () => {
    client.user?.setActivity({
        name: "Spinning Wheels 🎡",
        type: discord_js_1.ActivityType.Custom,
    });
    (0, createInteraction_1.default)(client);
    (0, registerSlashCommands_1.default)();
});
client.login(process.env.DISCORD_TOKEN);
