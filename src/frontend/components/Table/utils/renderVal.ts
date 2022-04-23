function renderVal(val: string| number) {
  if (typeof val === 'number') {
    const roundedVal = Math.round(val);
    if (!isNaN(roundedVal)) {
      return  Math.round(val).toLocaleString();
    } else {
      return '';
    }
  } else {
    return val;
  }
}

export default renderVal;