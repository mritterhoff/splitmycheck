/* eslint-disable constructor-super */

import PropTypes from 'prop-types';

/*
  Immutable object that contains a number 'num' and string 'stringRep'.
*/
class NumStringPair {
  constructor(num, stringRep) {
    this.num = num;
    this.stringRep = stringRep;

    // sanity check
    if (this.num < 0) {
      throw new Error(`NumStringPair: num can not be negative: ${this.num}`);
    }
  }
}

class Percent extends NumStringPair {
  static of(...args) {
    if (arguments.length === 1) {
      const arg = args[0];

      if (typeof arg === 'number') {
        // show 1 decimal point but only if necessary
        const isWholeNumber = arg === Number(arg.toFixed(0));
        return new Percent(arg, arg.toFixed(isWholeNumber ? 0 : 1));
      }
      // used by StateLoader 
      else if (typeof arg === 'object') {
        return new Percent(arg.num, arg.stringRep);
      }
    }
    throw new Error('Expecting 1 argument');
  }

  // Returns a new Percent,
  as(stringRep, finalize) {
    return finalize
      ? Percent.of(Number(stringRep))
      : new Percent(this.num, stringRep);
  }
}

class Price extends NumStringPair {
  static of(...args) {
    if (args.length === 1) {
      const arg = args[0];

      // used by StateLoader and Dish
      if (typeof arg === 'number') {
        return new Price(arg, arg.toFixed(2));
      }
      // used by StateLoader
      else if (typeof arg === 'object') {
        return new Price(arg.num, arg.stringRep);
      }
    }
    throw new Error('Needed to supply 1 argument');
  }

  // Returns a new Price,
  as(stringRep, finalize) {
    return finalize
      ? Price.of(Number(stringRep))
      : new Price(this.num, stringRep);
  }
}

Price.shape = PropTypes.shape({
  num: PropTypes.number,
  stringRep: PropTypes.string
});

Price.prototype.toString = function toString() {
  return `(num: ${this.num}, stringRep: ${this.stringRep})`;
};

export { Price, Percent };
