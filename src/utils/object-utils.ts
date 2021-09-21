export const sepPropDeep = (
  obj: any,
  prop: string | undefined,
  value: any
): any => {
  if (!prop) {
    return value;
  }

  let finalResponse = obj;
  const pathArr = prop.split('.');

  if (finalResponse === undefined) {
    pathArr.reverse().forEach((pathPart) => {
      finalResponse = {
        [pathPart]: value,
      };
    });
  } else {
    pathArr.forEach((pathPart, index) => {
      if (index === pathPart.length - 1) {
        finalResponse[pathPart] = value;
      }
      if (!finalResponse[pathPart]) {
        finalResponse[pathPart] = { };
      }
    })
  }

  return finalResponse;
}

export const getObjValue = (obj: any, path: string): any => {
  const pathArr = path.split('.');
  let value = obj;

  for (const pathPart of pathArr) {
    value = value[pathPart];

    if (value === undefined) {
      return value;
    }
  }

  return value;
}
