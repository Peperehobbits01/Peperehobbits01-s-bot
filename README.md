# Presentation of Peperehobbits01's bot

Peperehobbits01's bot is a multipurpose Discord bot using discord.js to connect to Discord. It is mostly made for the
Discord server of the youtubeur Peperehobbits01, but it is designed to be usable on other servers. No system can be disabled, and it is
not planned as a feature. So if a system isn't to your liking, I commanded looking for another Discord bot then Peperehobbits01's bot.

## Requirements to run/program the software

| Software | Version          | More information           |
|----------|------------------|----------------------------|
| Node.js  | 22.x or higher   | Bundles javaScript and npm |
| MySQL    | 8.2.x or higher  | The database of the bot    |

## Recommended to program this software

| Software   | Version         | More information                                                               |
|------------|-----------------|--------------------------------------------------------------------------------|
| phpMyAdmin | 5.2.1 or higher | Interface for MySQL                                                            |
| WebStorm   | 26.0 or higher  | Development IDE for javascript development that also integrates db connections |

#### After pulling the repo, install dependencies:

```shell
npm install
```

#### Database setup :

Use the peperehobbits01_s_bot.sql file after creating a database and import the file into it.

#### Config files :

You have to copy the .env.example and name the copy .env, you can then put the values you want for each setting.

#### Twitch live notifications :

1. Sign in to the [Twitch Developer Console](https://dev.twitch.tv/console/apps), register an application, and copy its **Client ID** and **Client Secret** into `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` in `.env`. The bot uses Twitch's app access token flow; no user login, OAuth scopes, or redirect URL are needed. Keep the secret private and never commit `.env`.
2. In each Discord server, run `/config` as the server owner to set:
   - `twitchChannelUsernames`: Twitch logins separated by commas (for example `channel_one,channel_two`).
   - `twitchAnnouncementChannel`: the ID of the text channel for announcements.
   - `twitchNotifRole`: the ID of the role to mention.
3. Make sure the bot can view and send messages in that channel, embed links, and attach files. The bot checks for new live streams every five minutes. Its first successful check establishes a baseline, so streams already live when it starts are not announced.

#### To test the application :

If you are on WebStorm or any other JetBrains IDE, use the built-in run feature, you can choose between Dev Env (acts has prod env), or debug env to have the debug logging enabled.
For the others simply run :

```shell
node main
```

VScode support for it's run feature is planned to be added in the feature, but there is no ETA for it.

# Project architecture

```
█───Project folder
│
│   .env.example
│   .gitignore
│   .gitattributes
│   LICENSE
│   main.js
│   package.json
│   package-lock.json
│   peperehobbits01_s_bot.sql
│   README.md
│
└───src
    │
    ├───Assets
    │   Assets that are used in the bot for commands like /rank.
 	│
 	├───Commands
    │	│
    │	├───Expérience
    │	│       Experience related commands.
    │	│   
    │	├───Fun
    │	│       Fun related commands.
    │	│   
    │	├───Giveaway       
    │	│       Giveaway related commands.
    │	│   
    │	├───Information       
    │	│       Information related commands.
    │	│    
    │	└───Modération       
    │	       Moderation related commands.
    │
    ├───Enum
    │		Enumaration files.
    │      
 	├───Events
 	│       Discord related events.       
 	│
 	├───Fonctions
 	│       Fonctions files required to run some commands.
 	│
	└───Loaders
    	    The loaders that load the events and commands files.

```
