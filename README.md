# Installation of development environnement

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
