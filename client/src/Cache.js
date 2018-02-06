

class Cache {
  constructor() {
    this._cache = {};
  }

  // Kind of hacky method to get a key for the cache
  static key() {
    let key = arguments.length === 1
      ? arguments[0].join('_')
      : [...arguments].join('_');
    return key;
  }

  has() {
    let key = Cache.key([...arguments]);
    return this._cache[key] !== undefined;
  }

  get() {
    let key = Cache.key([...arguments]);
    return this._cache[key];
  }

  put() {
    let args = [...arguments];
    let value = args[0];
    args = args.slice(1);
    let key = Cache.key(args);
    this._cache[key] = value;
    // console.log('put', key, value);
  }

  clear() {
    this._cache = {};
  }
}

export { Cache };