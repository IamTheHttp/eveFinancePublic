function debounce(fn: Function, bounceLimit: number) {
  function debounced(...args: any[]) {
    // @ts-ignore
    if (debounced.timer) {
      // @ts-ignore
      clearTimeout(debounced.timer);
    }
    // @ts-ignore
    debounced.timer = setTimeout(() => {
      fn.apply(null, args);
    }, bounceLimit)
  }

  return debounced;
}

export {debounce}