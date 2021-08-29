import lightJoin from 'light-join';

let baseUrl = '';

// later we can use this when we'll create a standalone runner
export const setBaseUrl = (url: string) => baseUrl = url;
export const getBaseUrl = () => baseUrl;

export const getAppUrl = (path: string) => lightJoin(getBaseUrl(), path);
