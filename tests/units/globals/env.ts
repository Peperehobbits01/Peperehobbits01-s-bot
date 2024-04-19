import env from "../../../app/globals/env";

beforeAll(() => {
    process.env = {};
    process.env.KEY = 'value';
});

test('get env from defined key', () => {
    expect(env('KEY')).toBe('value')
    expect(env('KEY', 'testing')).toBe('value')
});

test('get env from undefined key', () => {
    expect(env('COLUMN')).toBe(undefined)
    expect(env('COLUMN', 'testing')).toBe('testing')
});