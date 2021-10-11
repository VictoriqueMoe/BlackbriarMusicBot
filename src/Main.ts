import {Intents} from "discord.js";
import {Client, DIService} from "discordx";
import {Player} from "discord-music-player";
import * as dotenv from "dotenv";
import {container} from "tsyringe";

dotenv.config({path: __dirname + '/../.env'});

export class Main {
    public static async start(): Promise<void> {
        DIService.container = container;
        const client = new Client({
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
        container.registerInstance(Client, client);
        await client.login(process.env.token);
    }

    public static initMusicPlayer(): void {
        const client = container.resolve(Client);
        const player = new Player(client, {
            leaveOnEmpty: true,
            quality: "high"
        });
        container.registerInstance(Player, player);
    }
}

((async (): Promise<void> => {
    await Main.start();
})());