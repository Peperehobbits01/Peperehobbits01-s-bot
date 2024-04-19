import config from "../../../app/globals/config";

test('get env from defined key in a defined config file', () => {
    expect(config('app.name')).toBe('Bot')
    expect(config('app.name', 'Testing')).toBe('Bot')
});

test('get env from undefined key in a defined config file', () => {
    expect(config('app.nameVersion')).toBe(undefined)
    expect(config('app.nameVersion', 'Testing')).toBe('Testing')
});

test('get env from undefined key in an undefined config file', () => {
    expect(config('application.name')).toBe(undefined)
    expect(config('application.name', 'Testing')).toBe('Testing')
});