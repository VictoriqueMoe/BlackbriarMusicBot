import {Intents} from "discord.js";
import {Client} from "discordx";
import {Player} from "discord-music-player";
import * as dotenv from "dotenv";

dotenv.config({path: __dirname + '/../.env'});

export class Main {
    public static client: Client;
    public static player: Player;

    public static async start(): Promise<void> {
        Main.client = new Client({
            botId: `blackbriarmusicbot`,
            prefix: "!",
            classes: [
                `${__dirname}/{commands,events}/**/*.{ts,js}`
            ],
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES
            ],
            botGuilds: ["691775875116433477"],
            silent: false,
        });
        await Main.client.login(process.env.token);
    }

    public static initMusicPlayer(): void {
        Main.player = new Player(Main.client, {
            leaveOnEmpty: true,
            quality: "high"
        });
    }
}

((async (): Promise<void> => {
    await Main.start();
})());