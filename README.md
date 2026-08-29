# Presentation of Peperehobbits01's bot

Peperehobbits01's bot is a multipurpose Discord bot using discord.js to connect to Discord. It is mostly made for the
Discord server
of the youtubeur Peperehobbits01, but it is designed to be usable on other servers. No system can be disabled, and it is
not planned as a feature. So if a system isn't
to your liking, I commanded looking for another Discord bot then Peperehobbits01's bot.

## Requirements to run/program the software

| Software | Version          | More information           |
|----------|------------------|----------------------------|
| Node.js  | 22.x or higher   | Bundles javaScript and npm |
| MySQL    | 8.2.x or higher  | The database of the bot    |

### All the dependecies in the packages.json files.

## Recommended to program this software

| Software   | Version         | More information             |
|------------|-----------------|------------------------------|
| phpMyAdmin | 5.2.1 or higher | Interface for MySQL          |
| XAMPP      | 8.2.4 or higher | Bundles MysQL and phpMyAdmin |

#### After pulling the repo, install dependencies (add the '-D' argument to install dev dependencies) :

```shell
npm install
```

#### Do database migrations :

Use the peperehobbits01_s_bot.sql file after creating a database and import the file into it.

#### Config files :

You have to copy the .env.example and name the copy .env, you can then put the values you want for each setting.

#### To test the application :

Simply run :

```shell
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
│   peperehobbits01_s_bot.sql
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
 	├───Events
 	│       Discord related events.       
 	│
 	├───Fonctions
 	│       Fonctions files required to run some commands.
 	│
	└───Loaders
    	    The loaders that load the events and commands files.

```
