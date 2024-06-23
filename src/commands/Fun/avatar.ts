import { Commands, type ClientCommand, type DiscordClient } from '#structures/index.js';
import { EmbedBuilder, resolveColor, SlashCommandBuilder, type CacheType, type CommandInteraction, type GuildMember, type SlashCommandUserOption } from 'discord.js';

export default class AvatarCommands extends Commands implements ClientCommand {
     constructor() {
          super({
               builder: new SlashCommandBuilder()
                    .setName('avatar') 
                    .setDescription('View member avatar')
                    .addUserOption((option: SlashCommandUserOption) => {
                         return option.setName('member')
                         .setDescription("View another member's avatar")
                         .setRequired(false);
                    }),
               cooldown: 1
          });
     };
     public override async run(_client: DiscordClient, interaction: CommandInteraction<CacheType>): Promise<void> {
          if (!interaction.inCachedGuild()) return;

          const member: GuildMember = interaction.options.get('member')?.member || interaction.member;
          const embed: EmbedBuilder = new EmbedBuilder()
               .setTitle(`Member avatar ${interaction.member.displayName}`)
               .setColor(resolveColor(parseInt(process.env.DISCORD_EMBED_COLOR || 'FFFFFF', 16)))
               .setImage(member.displayAvatarURL({ size: 1024 }));

          await interaction.deferReply().catch(() => interaction.followUp({ content: 'An error occurred during the interaction process' }));
          await interaction.editReply({ embeds: [embed] });
     };
};