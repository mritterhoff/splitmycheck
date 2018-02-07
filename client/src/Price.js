import PropTypes from 'prop-types';

/*
  Immutable object that contains a number 'num' and string 'stringRep'.
*/
class NumStringPair {
  num;
  stringRep;

  constructor(num, stringRep) {
    this.num = num;
    this.stringRep = stringRep;

    // sanity check
    if (this.num < 0) {
      throw new Error(`NumStringPair: num can not be negative: ${this.num}`);
    }
  }

  isPercent() {
    return this.__type === 'Percent';
  }
}

class Percent extends NumStringPair {
  constructor(num, stringRep) {
    if (arguments.length === 1) {
      const arg = arguments[0];

      // used by StateLoader
      if (typeof arg === 'number') {
        // show 1 decimal point but only if necessary
        if (arg === Number(num.toFixed(0))) {
          super(arg, num.toFixed(0));
        }
        else {
          super(arg, num.toFixed(1));
        }
      }
      // used by StateLoader
      else if (typeof arg === 'object') {
        super(arg.num, arg.stringRep);
      }
    }
    // internal only
    else if (arguments.length === 2) {
      super(arguments[0], arguments[1]);
    }
    else {
      throw new Error('Need to supply 1 or 2 arguments');
    }

    // https://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
    // Used in custom desearlizer (see StateLoader.js)
    // must be on this (rather than prototype) in order to be serialized
    this.__type = 'Percent';
  }

  // Returns a new Percent,
  as(stringRep, finalize) {
    return finalize
      ? new Percent(Number(stringRep))
      : new Percent(this.num, stringRep);
  }
}

class Price extends NumStringPair {
  constructor(num, stringRep) {
    if (arguments.length === 1) {
      const arg = arguments[0];

      // used by StateLoader and Dish
      if (typeof arg === 'number') {
        super(arg, num.toFixed(2));
      }
      // used by StateLoader
      else if (typeof arg === 'object') {
        super(arg.num, arg.stringRep);
      }
    }
    // internal only
    else if (arguments.length === 2) {
      super(arguments[0], arguments[1]);
    }
    else {
      throw new Error('Need to supply 1 or 2 arguments');
    }

    // https://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
    // Used in custom desearlizer (see StateLoader.js)
    // must be on this (rather than prototype) in order to be serialized
    this.__type = 'Price';
  }

  // Returns a new Price,
  as(stringRep, finalize) {
    return finalize
      ? new Price(Number(stringRep))
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
