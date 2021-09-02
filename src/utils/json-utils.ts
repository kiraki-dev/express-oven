const defaultValue = null;

export const tryParse = (str: any = defaultValue) => {
  if (typeof str !== 'string') {
    return str;
  }

  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}
