function isAuthPath(path: string) {
  return path.indexOf('/auth') >= 0;
}

export {isAuthPath}
