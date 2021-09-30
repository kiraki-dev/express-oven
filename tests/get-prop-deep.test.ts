import { getPropDeep } from '../src/utils/object-utils';

describe('getPropDeep()', () => {
  it('should return undefined if obj is null', () => {
    const result = getPropDeep(null, 'a.b.c');

    expect(result).toBe(undefined);
  });

  it('should should undefined if nothing in the object in given path', () => {
    const result = getPropDeep({ d: 'e' }, 'a.b.c');

    expect(result).toStrictEqual(undefined);
  });

  it('should return obj if path is empty string', () => {
    const result = getPropDeep({ a: 'b' }, '');

    expect(result).toStrictEqual({ a: 'b' });
  });

  it('should return prop in the given path on obj', () => {
    const obj = {
      a: {
        b: {
          c: {
            d: 'e',
          },
        },
      },
      g: { h: 'l' }
    };
    const result = getPropDeep(obj, 'a.b.c');

    expect(result).toStrictEqual({ d: 'e' });
  });
});
