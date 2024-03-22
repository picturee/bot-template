import { DiscordClient, Commands } from '../../structures/index.js';
import { EmbedBuilder, type GuildMember, SlashCommandBuilder, type SlashCommandUserOption, ChatInputCommandInteraction } from "discord.js";

export default class AvatarCommands extends Commands {
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
               cooldown: 10
          });
     };
     public override async run(_client: DiscordClient, interaction: ChatInputCommandInteraction) {
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