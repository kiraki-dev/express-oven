export const getNumberId = (data: any[], idField: string) => {
  return Math.max(...data.map(item => item[idField])) + 1;
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
