let context = null as any;

export const setContext = (newContext: any) => context = newContext;

export const getContext = () => context;

const originalThen = Promise.prototype.then;

Promise.prototype.then = function(this: Promise<unknown>, onFulfilled, onRejected) {
  const previousContext = context;
  const originalOnFulfilled = onFulfilled as any;
  const originalOnRejected = onRejected as any;
  return originalThen.apply(this, [(...args) => {
    context = previousContext;
    if (!onFulfilled) {
      return;
    }
    return originalOnFulfilled(...args);
  }, (...args) => {
    context = previousContext;
    if (!onRejected) {
      return;
    }
    return originalOnRejected(...args);
  }]);
} as Promise<unknown>['then'];
