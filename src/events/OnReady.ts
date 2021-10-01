import {ArgsOf, Discord, On} from "discordx";
import {Main} from "../Main";

@Discord()
export class OnReady {
    @On("ready")
    private async initialize([client]: ArgsOf<"ready">): Promise<void> {
        await Main.client.initApplicationCommands();
        Main.initMusicPlayer();
        console.log("Bot logged in!");
    }
}