let context = null as any;

export const setContext = (newContext: any) => context = newContext;

export const getContext = () => context;

const originalThen = Promise.prototype.then;

Promise.prototype.then = function(this: Promise<unknown>, onFulfilled, onRejected) {
  const previousContext = context;
  const originalOnFulfilled = onFulfilled as any;
  return originalThen.apply(this, [(...args) => {
    context = previousContext;
    return originalOnFulfilled(...args);
  }, onRejected]);
} as Promise<unknown>['then'];
