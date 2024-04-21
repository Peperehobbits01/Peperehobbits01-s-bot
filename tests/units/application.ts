import Application from '../../app/application';
import { Client } from "discord.js";

describe('Application', () => {
    it('should not allow direct instantiation of Application', () => {
        expect(() => {
            // @ts-ignore
            new Application();
        }).toThrow();
    })

    it('should create instance using static method', () => {
        expect(Application.getInstance()).toBeInstanceOf(Application);
        expect(Application.getInstance).not.toThrow();
    })

    it('should get the same instance of Client', () => {
        const application = Application.getInstance();
        const client = application.getClient()

        expect(client).toBeInstanceOf(Client);
        expect(application.getClient()).toBe(client);
    })
})