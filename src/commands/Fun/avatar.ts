import { EmbedBuilder, type GuildMember, SlashCommandBuilder, type CacheType, type CommandInteraction, type SlashCommandUserOption } from "discord.js";
import { ClientBot, Command } from '../../classes/index.js';

export default class extends Command { 
    constructor() {
        super({
            builder: new SlashCommandBuilder()
                .setName('avatar')
                .setDescription('View member avatar')
                .addUserOption((option: SlashCommandUserOption) => {
                    return option.setName('member')
                        .setDescription("View another member's avatar")
                        .setRequired(false)
                }),
            cooldown: 1
        });
    };
    public async callback(_client: ClientBot, interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!interaction.inCachedGuild()) return;

        const member: GuildMember = interaction.options.get('member')?.member || interaction.member;
        const embed: EmbedBuilder = new EmbedBuilder();
            embed.setTitle(`Member avatar ${interaction.member.displayName}`);
            embed.setColor(0x2F3136)
            embed.setImage(member.displayAvatarURL({ size: 1024 }));

        await interaction.deferReply().catch(() => interaction.followUp({ content: 'An error occurred during the interaction process' }));
        return void (await interaction.editReply({ embeds: [embed] }));
    };
};