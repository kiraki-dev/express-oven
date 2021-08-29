export const getNumberId = (data: any[], idField: string) => {
  return Math.max(...data.map(item => item[idField])) + 1;
}
