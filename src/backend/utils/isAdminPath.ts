function isAdminPath(path: string) {
  return path.indexOf('/admin') >= 0;
}

export {isAdminPath}
