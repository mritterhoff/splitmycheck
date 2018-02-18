import { Price } from './NumTypes';

class Dish {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  // Static factory to simplify constructor
  static of(name = '', priceObjOrNum = 0) {
    if (typeof priceObjOrNum === 'object') {
      return new Dish(name, priceObjOrNum);
    }
    else if (typeof priceObjOrNum === 'number') {
      return new Dish(name, Price.of(priceObjOrNum));
    }

    throw new Error(`Dish: was expecting price obj or number, got ${priceObjOrNum}`);
  }
}

export default Dish;
