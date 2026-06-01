# Presentation of Peperehobbits01's bot
Peperehobbits01's bot is a multipurpose Discord bot using discord.js to connect to Discord. It is mostly made for the Discord server
of the youtubeur Peperehobbits01, but it is designed to be usable on other servers. No system can be disabled and it is not planned as a feature. So if a system isn't
to your liking, I recommaned loking for an other Discord bot then Peperehobbits01's bot.

## Project status ⚠️

Due to this project being my first, it has some major flaws in its design, because it is easier to restart from scratch a 2.0.0 version has started developement with the help of a friend, Skudar, on a new branch in this repositories. That version is not intended for production use and his not ready at all and it is not recieving secrutiy updates consistantly because Skudar and I are not having enough time to work on the bot for know. If you really want to use this bot, I recommend using the 24w16a branch as I am still updating it frequently to make sure it is having the lastest security patches and bug fixes, no new features are being introduced but if you find a bug, you can create a issue to report it. I'll fix it when I can. If you have any questions, feel free to join my Discord server.

## Requirements to run/program the software

| Software           | Version          | More information             |
| ------------------ | ---------------- | ---------------------------- |
| Node.js            | 20.x or higher   | Bundles javaScript and npm   |
| MySQL              | 8.2.x or higher  | The database of the bot      |
| git                | 2.25.1 or higher | Commands for Github          |

### All the dependecies in the packages.json files.

## Recommanded to run/program the software

| Software           | Version          | More information             |
| ------------------ | ---------------- | ---------------------------- |
| phpMyAdmin         | 5.2.1 or higher  | Interface for MySQL          |
| XAMPP              | 8.2.4 or higher  | Bundles MysQL and phpMyAdmin |

#### After pulling the repo, install dependencies (add the '-D' argument to install dev dependencies) :

```
npm install
```

#### Do database migrations :

Not possible yet but will be introduced in the future.

#### Config files :

You have to copy the .env.example and name the copy .env, you can then put the values you want for each setting.
#### To test the application :

Simply run :

```
node main
```

# Project architecture

```
█───Project folder
│
│   main.js
│   .gitignore
│   .gitattributes
│   package-lock.json
│   package.json
│   README.md
│   anti-crash.js
│   .env.example
│
├───Assets
│       Assets that are used in the bot for commands like /rank.
│
├───Commands
│   │
│   ├───Expérience
│   │       Experience related commands.
│   │   
│   ├───Fun
│   │       Fun related commands.
│   │   
│   ├───Giveaway       
│   │       Giveaway related commands.
│   │   
│   ├───Information       
│   │       Information related commands.
│   │    
│   └───Modération       
│          Moderation related commands.
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
