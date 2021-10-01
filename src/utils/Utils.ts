import {ButtonInteraction, CommandInteraction, GuildMember, Message, SelectMenuInteraction} from "discord.js";
import {APIInteractionGuildMember, APIMessage} from "discord-api-types";

export namespace InteractionUtils {

    export async function followupWithText(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction, content: string, ephemeral: boolean = false): Promise<Message | APIMessage> {
        return interaction.followUp({
            content,
            ephemeral
        });
    }

    export async function editWithText(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction, content: string): Promise<Message | APIMessage> {
        return interaction.editReply({
            content
        });
    }

    export async function replyWithText(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction, content: string, ephemeral: boolean = false): Promise<void> {
        if (interaction.deferred) {
            await interaction.editReply({
                content
            });
        } else {
            return interaction.reply({
                content,
                ephemeral
            });
        }
    }

    export function getInteractionCaller(interaction: CommandInteraction): GuildMember | APIInteractionGuildMember {
        const {member} = interaction;
        if (member == null) {
            interaction.reply("Unable to extract member");
            throw new Error("Unable to extract member");
        }
        if (member instanceof GuildMember) {
            return member;
        }
        return member;
    }
}