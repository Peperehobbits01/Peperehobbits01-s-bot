// @ts-nocheck

import mock = jest.mock;
import Application from "../../app/application";
import { Message } from "discord.js";

mock('discord.js');

let client;

beforeAll(() => {
    require('../../app.ts');

    client = Application.getInstance().getClient();
});

it('should work', () => {
    expect(() => {
        const message = new Message(client);
        message.content = 'Hello World!';

        client.emit('ready');
        client.emit('messageCreate', message);
    }).not.toThrow()
})