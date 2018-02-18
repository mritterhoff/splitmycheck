import { Price, Percent } from './NumTypes';
import Dish from './Dish';

const lsSplitterKey = 'SplitterState';
const lsVersionKey = 'Version';

// when we introduce breaking changes, increment this, so that the ls gets cleared
// TODO do something more robust
// must be a string, because LS uses key/value string pairs
const lsVersion = '1';

class StateLoader {
  static loadInitial() {
    // check if we have stashed data from the server in a global window var, use if present
    if (window.SERVER_DATA) {
      // calling stringify is a bit hacky, but the subsequent call to parse
      // gives the Price object their as() method.
      // TODO find a better way to make this happen
      return deserialize(serialize(window.SERVER_DATA));
    }

    if (localStorage) {
      if (localStorage.getItem(lsVersionKey) === lsVersion) {
        // check if we have state stored in localStorage, and use it if we do
        if (localStorage.getItem(lsSplitterKey)) {
          return deserialize(localStorage.getItem(lsSplitterKey));
        }
      }
      else {
        localStorage.clear();
        localStorage.setItem(lsVersionKey, lsVersion);
      }
    }

    return this.getDefault();
  }

  static updateLocalStorage(state) {
    if (localStorage) {
      localStorage.setItem(lsSplitterKey, serialize(state));
    }
  }

  static getDefault() {
    return {
      // list of people
      people: [ '', '' ],

      // list of {name, price} dish objects
      dishes: [ Dish.of() ],

      // 2d array of booleans
      // orders[dInd][pInd]
      orders: [ [ true, true ] ],

      tax: Price.of(0),
      tip: Percent.of(20)
    };
  }

  static getExample() {
    return {
      people: [ 'Mark', 'Damian', 'Kai', 'Kapil' ],
      dishes: [
        Dish.of('Pitcher', 19.40),
        Dish.of('Wings', 15.75),
        Dish.of('Scotch Egg', 14.60),
        Dish.of('Pizza', 22.10),
        Dish.of('Shrimp', 12.98)
      ],
      orders: [
        [ true, true, true, true ],
        [ false, false, true, true ],
        [ true, true, false, false ],
        [ true, true, true, true ],
        [ false, false, true, false ]
      ],
      tax: Price.of(7.65),
      tip: Percent.of(20)
    };
  }
}

function serialize(input) {
  const obj = JSON.stringify(input, customReader);
  console.log('serialized into string:', obj);
  return obj;
}

function deserialize(input) {
  const loaded = JSON.parse(input, customParser);
  console.log('loaded into object:', loaded);
  return loaded;
}

// used by serialize to make an object again
function customParser(key, val) {
  if (key === 'price' || key === 'tax') {
    return Price.of(val);
  }
  if (key === 'tip') {
    return Percent.of(val);
  }
  return val;
}

// used by deserialize to make a string
function customReader(key, val) {
  // console.log(`key value pair is: ${key}, ${val}`);
  if (key === 'price' || key === 'tax' || key === 'tip') {
    return val.num;
  }
  return val;
}

export default StateLoader;
