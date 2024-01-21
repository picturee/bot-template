import { GuildMember, SlashCommandBuilder, SlashCommandUserOption, EmbedBuilder, CommandInteraction } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

const isAssertion: { status: Object, activityState: Object } = {
    status: {
        online: '<:online:948618544181043202> В сети',
        idle: '<:idle:948618544411721738> Нет на месте',
        dnd: '<:dnd:948618544063594527> Не беспокоить',
        offline: '<:offline:993653306406752356> Не в сети'
    },
    activityState: {
        desktop: '🖥',
        mobile: '📱',
        web: '🌐'
    },
};

export default abstract class extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder()
                .setName('profile')
                .setDescription('Displaying Participant Information')
                .addUserOption((option: SlashCommandUserOption) => {
                    return option.setName('member')
                        .setDescription('Please indicate the participant')
                        .setRequired(false);
                }),
            });
        };
    public callback(client: Client, interaction: CommandInteraction) {
        if (!interaction.inCachedGuild()) return;
    
        const getMember: GuildMember = interaction.options.get('member')?.member || interaction.member;
        const getActiveDevices: string = Object.entries(getMember.presence?.clientStatus || {}).map((value: string[]) => isAssertion.activityState[value[0].toLowerCase()]).join(' ');

        const embed: EmbedBuilder = new EmbedBuilder()
            .setAuthor({ name: `Информация о пользователе ${getMember.displayName}`, iconURL: `${getMember.displayAvatarURL()}` })
            .setDescription(`\n> • Пользователь: ${getMember.user.displayName} [${getMember.displayName}]\n> • iD аккаунта: ${getMember.id}\n> • Активные устройства: ${getActiveDevices}\n> • Статус пользователя: ${isAssertion.status[getMember.presence?.status ?? '<:offline:993653306406752356> Не в сети']}`)
            .setThumbnail(getMember.displayAvatarURL({ size: 1024 }))
            .setColor(0x2F3136)
            .setImage(getMember.user.bannerURL({ size: 512})!);

        return interaction.deferReply().then(() => { 
            return interaction.editReply({ embeds: [embed] }); 
        }).catch((e: Error) => console.error(e));
    };
};