import config from '../../../app/globals/config';

it('should exist', () => {
    expect(config('database')).not.toBeUndefined();
});

it('should contain these variables', () => {
    expect(config('database.type')).not.toBeUndefined();

    expect(config('database.mysql.host')).not.toBeUndefined();
    expect(config('database.mysql.port')).not.toBeUndefined();
    expect(config('database.mysql.database')).not.toBeUndefined();
    expect(config('database.mysql.username')).not.toBeUndefined();
    expect(config('database.mysql.password')).not.toBeUndefined();
});