import { ClientBot } from './classes/getClientBot.js';

const client: ClientBot = new ClientBot();
void (client.login(process.env.token));