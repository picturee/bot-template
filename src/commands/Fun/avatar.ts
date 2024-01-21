import { CommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export default abstract class extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder()
            .setName('avatar')
            .setDescription('View member avatar')
            .addUserOption((option: SlashCommandUserOption) => {
                return option.setName('member')
                    .setDescription("View another member's avatar")
                    .setRequired(false);
            }),
        });
    }
    public callback(client: Client, interaction: CommandInteraction) {
        if (!interaction.inCachedGuild()) return;
        
        const member: GuildMember = interaction.options.get('member')?.member || interaction.member;
        return interaction.deferReply().then(() => {
            interaction.editReply({ embeds: [new EmbedBuilder()
                .setTitle(`Member avatar ${interaction.member.displayName}`)
                    .setColor(0x2F3136)
                    .setImage(member.displayAvatarURL({ size: 1024 }))
                ],
            });
        }).catch((e: Error) => console.error(e));
    }; 
};