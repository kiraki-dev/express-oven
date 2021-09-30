export const setPropDeep = (
  obj: any,
  prop: string | undefined,
  value: any,
): any => {
  if (!prop) {
    return value;
  }

  const pathArr = prop.split('.');
  const finalResponse = obj ?? {};
  let tempObj = finalResponse;

  pathArr.forEach((pathPart, index) => {
    if (index === pathArr.length - 1) {
      tempObj[pathPart] = value;
    }
    if (!tempObj[pathPart]) {
      tempObj[pathPart] = {};
    }

    tempObj = tempObj[pathPart];
  });

  return finalResponse;
};

export const getPropDeep = (obj: any, path: string): any => {
  if (!path) {
    return obj;
  }

  if (!obj) {
    return undefined;
  }

  const pathArr = path.split('.');
  let value = obj;

  for (const pathPart of pathArr) {
    value = value[pathPart];

    if (value === undefined) {
      return value;
    }
  }

  return value;
};
