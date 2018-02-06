import { Price, Percent } from './Price.js'
import { Dish } from './Dish.js'

const lsSplitterKey = 'SplitterState';

class StateLoader {
  static loadInitial() {
    // check if we have stashed data from the server in a global window var, use if present
    if (window.SERVER_DATA) {
      // stringify-ing is a bit hacky, give the Price object their as() methods though...
      // TODO find a better way to make this happen
      return JSON.parse(JSON.stringify(window.SERVER_DATA), customParser);
    }

    // check if we have state stored in localStorage, and use it if we do
    if (localStorage && localStorage.getItem(lsSplitterKey)) {
      return JSON.parse(localStorage.getItem(lsSplitterKey), customParser);
    }
    return this.getDefault();
  }

  static getStateFromLS() {
    if (localStorage && localStorage.getItem(lsSplitterKey)) {
      return localStorage.getItem(lsSplitterKey);
    }
    throw new Error('error loading state from localStorage');
  }

  static updateLocalStorage(state) {
    if (localStorage) {
      localStorage.setItem(lsSplitterKey, JSON.stringify(state));
    }
  }

  static getDefault() {
    return {
      // list of people
      people: ['', ''],

      // list of {name, price} dish objects
      dishes: [new Dish()],

      // 2d array of booleans
      // orders[dInd][pInd]
      orders: [ [true, true] ],

      tax: new Price(0),
      tip: new Percent(15)
    };
  }

  static getExample() {
    return {
      people: ['Mark', 'Damian', 'Kai', 'Kapil'],
      dishes: [
        new Dish('Pitcher', 19.40),
        new Dish('Wings', 15.75),
        new Dish('Scotch Egg', 14.60),
        new Dish('Pizza', 22.10),
        new Dish('Shrimp', 12.98)
      ],
      orders: [
        [true,true,true,true],
        [false,false,true,true],
        [true,true,false,false],
        [true,true,true,true],
        [false,false,true,false]
      ],
      tax: new Price(7.65),
      tip: new Percent(20)
    };
  }
}

function customParser(key, val) {
  if (typeof(val) === 'object') {
    if (val.__type === 'Price') {
      return new Price(val);
    }
    if (val.__type === 'Percent') {
      return new Percent(val);
    }
  } 
  return val;
}

export { StateLoader };