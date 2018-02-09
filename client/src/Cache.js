
// Quick and dirty cache.
// TODO replace or improve
class Cache {
  constructor() {
    this._cache = {};
  }

  // Kind of hacky method to get a key for the cache
  static key(...args) {
    const key = args.length === 1
      ? args[0].join('_')
      : args.join('_');
    return key;
  }

  has(...args) {
    const key = Cache.key(args);
    return this._cache[key] !== undefined;
  }

  get(...args) {
    const key = Cache.key(args);
    return this._cache[key];
  }

  put(...args) {
    const value = args[0];
    const allButFirstArgs = args.slice(1);
    this._cache[Cache.key(allButFirstArgs)] = value;
    // console.log('put', key, value);
  }

  clear() {
    this._cache = {};
  }
}

export default Cache;
