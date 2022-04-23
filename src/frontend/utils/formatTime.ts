function zeroPad(n: number) {
  if (n < 10) {
    return `0${n}`
  } else {
    return n;
  }
}


function formatTime(dateTime: Date | string) {
  const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  const hh = zeroPad(d.getHours());
  const mm = zeroPad(d.getMinutes());
  const dd = zeroPad(d.getDate());
  const mn = zeroPad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${yyyy}/${mn}/${dd} ${hh}:${mm}`
}

export {formatTime};