import 'dotenv/config'
import { Client, IntentsBitField, Partials } from 'discord.js'

// Verify env keys
const requiredEnvKeys = ['TOKEN']
if (requiredEnvKeys.some((key) => !process.env[key])) {
    throw new Error('Missing env keys: ' + requiredEnvKeys.join(', '))
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel],
})

client.login(process.env.TOKEN).then(async () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})
