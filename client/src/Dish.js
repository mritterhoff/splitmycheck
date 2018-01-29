import { Price } from './Price.js'

class Dish {
  constructor(name = '', priceObjOrNum = 0) {
    this.name = name;
    if (typeof priceObjOrNum === 'object') {
      this.price = priceObjOrNum;
    }
    else if (typeof priceObjOrNum === 'number') {
      this.price = new Price(priceObjOrNum)
    }
    else {
      throw new Error(`Dish: was expecting price obj or number, got ${priceObjOrNum}`)
    }
  }
}

export { Dish };