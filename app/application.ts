import { Client } from "discord.js";

class Application {
    private static _instance: Application;
    private _client: Client | undefined;

    private constructor() {}

    public static getInstance(): Application
    {
        if(Application._instance === undefined){
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