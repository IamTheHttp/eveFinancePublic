export function addDays(date: Date, x:number) {
  date.setDate(date.getDate() + x);
  return date;
}
