import PropTypes from 'prop-types';

class Price {
  constructor() {
    if (arguments.length === 2) {
      this.num = arguments[0];
      this.stringRep = arguments[1];
    }
    else {
      let arg = arguments[0];
      if (typeof arg === 'string') {
        this.stringRep = arg;
        this.num = Number(arg);
      }
      else if (typeof arg === 'number') {
        this.num = arg;
        this.stringRep = Number(arg).toFixed(2);
      }
      else if (typeof arg === 'object') {
        this.num = arg.num;
        this.stringRep = arg.stringRep;
      }
      else {
        console.error('was expecting string or number, not ' + arg);
      }
    }

    console.log(`New Price: num: '${this.num}', stringRep: '${this.stringRep}'`);
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