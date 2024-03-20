# Installation of development environnement

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
| Visual Studio Code | 1.86.2 or higher | Recommended IDE              |

### Recommanded extention in the .vscode folder for Visual Studio Code users.


#### After pulling the repo, install dependencies (add the '-D' argument to install dev dependencies) :

```
npm install
```

#### Do database migrations :

Not possible yet but will be introduced in the future.

#### Config files :

You have to create your own config.js file and adding your token of bot
Here is what it should looks like :
```javascript
module.exports = {

    "token" : "YourTokenHere"
}
```
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
│   Config.js
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
│       Foncitons fils required to run some commands.
│
└───Loaders
        The loaders that load the events and commands files.

```

# Requirements

### Node.js

La version 20.x est requise pour faire fonctionner le bot.

Le reste bientôt...
