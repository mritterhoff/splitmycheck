import PropTypes from 'prop-types';


/*
Scenarios:
1: creating a new Price from a number, like in the inital states:
  Price(0)  => {0, 0.00}


2. 

Immutable (ideally)
*/
class Price {
  constructor() {
    if (arguments.length === 2) {
      this.num = arguments[0];
      this.stringRep = arguments[1];
    }
    else if (arguments.length === 1) {
      let arg = arguments[0];
     if (typeof arg === 'number') {
        this.num = arg;
        this.stringRep = this.num.toFixed(2);
      }
      else if (typeof arg === 'string') {
        this.num = Number(arg);
        this.stringRep = this.num.toFixed(2);
      }
      else if (typeof arg === 'object') {
        this.num = arg.num;
        this.stringRep = arg.stringRep;
      }
      else {
        throw new Error('was expecting string or number, not ' + arg);
      }
    }
    else {
      throw new Error('Need to supply 1 or 2 arguments');
    }

    console.log(`New Price: num: '${this.num}', stringRep: '${this.stringRep}'`);
  }

  withNewStringRep(newStringRep) {
    return new Price(this.num, newStringRep);
  }
}

// https://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
Price.__type = 'Price';


Price.shape = PropTypes.shape({
  num: PropTypes.number,
  stringRep: PropTypes.string
})

Price.prototype.toString = function() {
  return `(num: ${this.num}, stringRep: ${this.stringRep})`;
}

export { Price };