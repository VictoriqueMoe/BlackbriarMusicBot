import {ArgsOf, Client, Discord, On} from "discordx";
import {Main} from "../Main";
import {injectable} from "tsyringe";

@Discord()
@injectable()
export class OnReady {
    public constructor(private _client: Client) {
    }

    @On("ready")
    private async initialize([client]: ArgsOf<"ready">): Promise<void> {
        await this._client.initApplicationCommands();
        Main.initMusicPlayer();
        console.log("Bot logged in!");
    }

    @On("interactionCreate")
    private async intersectionInit([interaction]: ArgsOf<"interactionCreate">): Promise<void> {
        await this._client.executeInteraction(interaction);
    }
}