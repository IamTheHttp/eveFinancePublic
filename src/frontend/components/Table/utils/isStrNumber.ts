function isStrNumber(val: string | number) {
  if (typeof val === 'number') {
    return true;
  }

  if (val && val.toString) {
    return parseInt(val.toString()).toString() === val;
  } else {
    return false;
  }
}

export default isStrNumber;