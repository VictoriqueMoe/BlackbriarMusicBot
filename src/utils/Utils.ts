import {BaseCommandInteraction, GuildMember, MessageComponentInteraction} from "discord.js";

export namespace InteractionUtils {

    export async function followupWithText(interaction: BaseCommandInteraction | MessageComponentInteraction, content: string, ephemeral: boolean = false): Promise<void> {
        await interaction.followUp({
            content,
            ephemeral
        });
    }

    export async function editWithText(interaction: BaseCommandInteraction | MessageComponentInteraction, content: string): Promise<void> {
        await interaction.editReply({
            content
        });
    }

    export async function replyWithText(interaction: BaseCommandInteraction | MessageComponentInteraction, content: string, ephemeral: boolean = false): Promise<void> {
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

    export function getInteractionCaller(interaction: BaseCommandInteraction): GuildMember | null {
        const {member} = interaction;
        if (member == null) {
            interaction.reply("Unable to extract member");
            throw new Error("Unable to extract member");
        }
        if (member instanceof GuildMember) {
            return member;
        }
        return null;
    }
}