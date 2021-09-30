export const sepPropDeep = (
  obj: any,
  prop: string | undefined,
  value: any,
): any => {
  if (!prop) {
    return value;
  }

  let finalResponse = obj;
  const pathArr = prop.split('.');

  if (finalResponse === undefined) {
    pathArr.reverse().forEach((pathPart, index) => {
      if (index === 0) {
        finalResponse = {
          [pathPart]: value,
        };
      } else {
        finalResponse = {
          [pathPart]: finalResponse,
        }
      }
    });
  } else {
    let tempObj = finalResponse;

    pathArr.forEach((pathPart, index) => {
      if (index === pathPart.length - 1) {
        tempObj[pathPart] = value;
      }
      if (!tempObj[pathPart]) {
        tempObj[pathPart] = {};
      }

      tempObj = tempObj[pathPart];
    });
  }

  return finalResponse;
};

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
};
