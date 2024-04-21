import { Client } from "discord.js";

class Application {
    private static isInternalConstructing = false;
    private static _instance: Application;
    private _client: Client | undefined;

    private constructor() {
        if (!Application.isInternalConstructing) {
            throw new TypeError("Application is not constructable");
        }
        Application.isInternalConstructing = false;
    }

    public static getInstance(): Application
    {
        if(Application._instance === undefined){
            Application.isInternalConstructing = true;
            Application._instance = new Application()
        }

        return Application._instance;
    }

    public getClient(): Client {
        if(this._client === undefined){
            this._client = new Client({
                intents: []
            });
        }

        return this._client;
    }
}

export default Application;