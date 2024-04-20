import config from '../../../app/globals/config';

it('should exist', () => {
    expect(config('app')).not.toBeUndefined();
});

it('should contain these variable', () => {
    expect(config('app.name')).not.toBeUndefined();
    expect(config('app.token')).not.toBeUndefined();
    expect(config('app.locale')).not.toBeUndefined();
});