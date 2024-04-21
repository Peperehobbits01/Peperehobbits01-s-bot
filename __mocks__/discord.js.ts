const Discord = jest.createMockFromModule('discord.js');

import {EventEmitter} from 'events';

class Client extends EventEmitter {
    login() {
        return new Promise((resolve) => {
            resolve('');
        });
    }
}

(Discord as any).Client = Client;

module.exports = Discord;