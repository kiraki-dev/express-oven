import { genUid } from 'light-uid';
import { setPropDeep } from '../src/utils/object-utils';

describe('setPropDeep()', () => {
  it('should return value if no path provided', () => {
    const value = { uid: genUid(4) };
    const result = setPropDeep({}, '', value);

    expect(result).toBe(value);
  });

  it('should return value if no path provided and obj is null', () => {
    const value = { uid: genUid(4) };
    const result = setPropDeep(null, '', value);

    expect(result).toBe(value);
  });

  it('should should return new object with the value put on the specified path if no obj provided', () => {
    const value = { uid: genUid(4) };
    const result = setPropDeep(null, 'a.b.c', value);

    const acceptedResult = {
      a: {
        b: {
          c: value,
        },
      },
    };

    expect(result).toStrictEqual(acceptedResult);
  });

  it('should return obj with the value put on the specified path', () => {
    const value = { uid: genUid(4) };
    const obj = {
      a: {
        e: 'f',
      },
      g: { h: 'l' }
    };
    const result = setPropDeep(obj, 'a.b.c', value);

    const acceptedResult = JSON.parse(JSON.stringify(obj));
    acceptedResult.a.b = {
      c: value,
    };

    expect(result).toStrictEqual(acceptedResult);
  });

  it('should return obj with the value put on the specified path, replacing the old value there', () => {
    const value = { uid: genUid(4) };
    const obj = {
      a: { e: 'f' },
      g: { h: 'l' }
    };
    const result = setPropDeep(obj, 'a', value);

    const acceptedResult = JSON.parse(JSON.stringify(obj));
    acceptedResult.a = value;

    expect(result).toStrictEqual(acceptedResult);
  });
});
