import { DiscordClient } from './structures/classes/Client.js';

const client: DiscordClient = new DiscordClient();
void (client.login(process.env.token));