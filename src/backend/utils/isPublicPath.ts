function isPublicPath(path: string) {
  return path.indexOf('/public') >= 0;
}

export {isPublicPath}
