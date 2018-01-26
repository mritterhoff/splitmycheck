import PropTypes from 'prop-types';

/*
  Immutable object that contains a number 'num' and string 'stringRep'.
*/
class Price {
  constructor() {
    if (arguments.length === 1) {
      let arg = arguments[0];

      // used by StateLoader and Dish
      if (typeof arg === 'number') {
        this.num = arg;
        this.stringRep = this.num.toFixed(2);
      }
      // used by StateLoader
      else if (typeof arg === 'object') {
        this.num = arg.num;
        this.stringRep = arg.stringRep;
      }
      else {
        throw new Error('was expecting string or number, not ' + arg);
      }
    }
    // internal only
    else if (arguments.length === 2) {
      this.num = arguments[0];
      this.stringRep = arguments[1];
    }
    else {
      throw new Error('Need to supply 1 or 2 arguments');
    }

    // sanity check
    if (this.num < 0) {
      throw new Error(`Price: num can not be negative: ${this.num}`);
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
})

Price.prototype.toString = function() {
  return `(num: ${this.num}, stringRep: ${this.stringRep})`;
}

export { Price };