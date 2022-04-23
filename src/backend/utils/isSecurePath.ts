function isSecurePath(path: string) {
  return path.indexOf('/secure') >= 0;
}

export {isSecurePath}
