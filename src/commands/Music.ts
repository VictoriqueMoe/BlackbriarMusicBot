import {ButtonComponent, Discord, Slash, SlashGroup, SlashOption} from "discordx";
import {
    ButtonInteraction,
    CommandInteraction,
    GuildMember,
    MessageActionRow,
    MessageButton,
    MessageEmbed
} from "discord.js";
import {Playlist, Queue, Song} from "discord-music-player";
import {Main} from "../Main";
import {InteractionUtils} from "../utils/Utils";

@Discord()
@SlashGroup("music", "Commands to play music from Youtube")
export class Music {

    private static getGuildQueue(interaction: CommandInteraction | ButtonInteraction): Queue {
        return Main.player.getQueue(interaction.guildId);
    }

    @Slash("playercontrols", {
        description: "Player controls to skip, pause, skip, stop, resume, etc..."
    })
    private async playerControls(interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply();
        const nextButton = new MessageButton()
            .setLabel("Next")
            .setEmoji("⏭")
            .setStyle("PRIMARY")
            .setCustomId("btn-next");
        const row = new MessageActionRow().addComponents(nextButton);
        interaction.editReply({
            content: "Music controls",
            components: [row]
        });
    }

    @ButtonComponent("btn-next")
    private async next(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferReply({
            ephemeral: true
        });
        const guildQueue = Music.getGuildQueue(interaction);
        if (!guildQueue) {
            return InteractionUtils.replyWithText(interaction, "No songs are currently playing");
        } else {
            if (!guildQueue.isPlaying) {
                return InteractionUtils.replyWithText(interaction, "No songs are currently playing");
            }
        }
        const {member} = interaction;
        if (!(member instanceof GuildMember)) {
            return InteractionUtils.replyWithText(interaction, "Internal Error");
        }
        const vc = member.voice.channel;
        if (!vc) {
            return InteractionUtils.replyWithText(interaction, "You must first join the voice channel before you can use this");
        }
        guildQueue.skip();
        const embed = Music.displayPlaylist(guildQueue);
        await interaction.editReply({
            embeds: [embed]
        });
    }

    @Slash("nowplaying", {
        description: "View the current playlist"
    })
    private async nowPlaying(interaction: CommandInteraction): Promise<void> {
        const guildQueue = Music.getGuildQueue(interaction);
        if (!guildQueue || !guildQueue.isPlaying) {
            return InteractionUtils.replyWithText(interaction, "No songs are currently playing");
        }
        const embed = Music.displayPlaylist(guildQueue);
        await interaction.reply({
            embeds: [embed]
        });
    }

    @Slash("play", {
        description: "Plays or Queues a song"
    })
    private async play(
        @SlashOption("search", {
            description: "The song name or URL",
            required: true
        })
            search: string,
        @SlashOption("isplaylist", {
            description: "is this url a playlist",
            required: true
        })
            isPlaylist: boolean,
        @SlashOption("timestamp", {
            description: "if url contains a timestamp, it will start there",
            required: false
        })
            timestamp: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();
        const player = Main.player;
        const {guildId} = interaction;
        const guildQueue = Music.getGuildQueue(interaction);
        const queue = player.createQueue(guildId);
        const member = InteractionUtils.getInteractionCaller(interaction);
        if (!(member instanceof GuildMember)) {
            return InteractionUtils.replyWithText(interaction, "Internal Error", false);
        }
        const vc = member.voice.channel;
        if (!vc) {
            return InteractionUtils.replyWithText(interaction, "You must first join the voice channel you want me to connect to");
        }
        if (!queue.isPlaying) {
            await queue.join(member.voice.channel);
        }
        let newSong: Song | Playlist = null;
        try {
            if (isPlaylist) {
                newSong = await queue.playlist(search, {
                    requestedBy: interaction.user
                });
            } else {
                newSong = await queue.play(search, {
                    timecode: timestamp,
                    requestedBy: interaction.user
                });
            }

        } catch (e) {
            if (!guildQueue) {
                queue.stop();
            }
            return InteractionUtils.replyWithText(interaction, `Unable to play ${search}`);
        }
        const embed = Music.displayPlaylist(queue, newSong, member);
        await interaction.editReply({
            embeds: [embed]
        });
    }

    private static displayPlaylist(queue: Queue, newSong?: Song | Playlist, memberWhoAddedSong?: GuildMember): MessageEmbed {
        const songs = queue.songs;
        const embed = new MessageEmbed().setColor('#FF470F').setTimestamp();
        embed.addField("Currently playing", queue.nowPlaying.name);
        embed.addField('\u200b', '\u200b');
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            embed.addField(`#${i + 1}`, song.name);
        }
        if (newSong) {
            embed.setDescription(`New song ${newSong.name} added to the queue`);
        } else {
            embed.setDescription(`Current Playlist`);
        }
        if (memberWhoAddedSong) {
            const avatar = memberWhoAddedSong.user.displayAvatarURL({format: 'jpg'});
            embed.setAuthor(`${memberWhoAddedSong.displayName}`, avatar);
        } else {
            const botImage = Main.client.user.displayAvatarURL({dynamic: true});
            embed.setAuthor(`${Main.client.user.username}`, botImage);
        }
        return embed;
    }
}