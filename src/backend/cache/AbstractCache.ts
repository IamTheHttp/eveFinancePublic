abstract class AbstractCache {
  abstract addItem(key: string, value: any): void
  abstract destroyItem(key: string): void
  abstract getItem(key: string): any
}

export {AbstractCache};