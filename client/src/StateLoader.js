import { Price } from './Price.js'
import { Dish } from './Dish.js'

const lsSplitterKey = 'SplitterState';

class StateLoader {
  static loadInitial() {
    // check if we have state stored in localStorage, and use it if we do
    if (localStorage && localStorage.getItem(lsSplitterKey)) {
      console.log('loading past state from localStorage');
      try {
        let lsObj = localStorage.getItem(lsSplitterKey);
        return JSON.parse(lsObj, (key, val) => {
            if (typeof(val) === 'object') {
              if (val.__type === 'Price') {
                return new Price(val);
              }
            }

            return val;

            // or if your object is in a context (like window), and there are many of
            // them that could be in there, you can do:
            //
            // if(typeof(val) === 'object' && context[val.__type])
            //    return new context[val.__type](val);
          });
      } 
      catch (ex) {
        throw new Error(ex);
      }
    }
    else {
      return this.getDefault();
    }
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
      console.log('localStorage updated!');
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
      tip: new Price(0)
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
      tip: new Price(15)
    };
  }
}

export { StateLoader };