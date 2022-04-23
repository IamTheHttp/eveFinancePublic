export function sortPredicate(key: string) {
  return (a: any, b: any) => {
    if (a[key] < b[key]) {
      return -1
    }

    if (a[key] > b[key]) {
      return 1
    } else {
      return 0;
    }
  }
}
