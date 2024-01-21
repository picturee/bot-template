import Client from '../structures/Client';
import Command from '../structures/Command';
import Event from '../structures/Event';

import { Interaction } from 'discord.js';

export default new Event('interactionCreate', async (client: Client, interaction: Interaction) => {
    await Command.isCommandHandler(client, interaction);
});