
// quick and dirty validation of stateString
function validateStateString(stateString) {
  let valid = false;
  if (typeof stateString === 'string') {
    valid = [ 'people', 'dishes', 'orders', 'tax', 'tip' ]
      .map(str => stateString.indexOf(str) > -1)
      .reduce((a,b)=>(a && b), true);
  }
  if (!valid) {
    throw new Error(`stateString is invalid: ${stateString}`);
  }
}

// quick and dirty validation of linkID
function validateLinkID(linkID) {
  let valid = false;
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (linkID.length === 6) {
    valid = linkID.split('')
      .map(letter => alphanumeric.indexOf(letter) > -1)
      .reduce((a,b)=>(a && b), true);
  }
  if (!valid) {
    throw new Error(`linkID is invalid: ${linkID}`);
  }
}

module.exports = {
  validateStateString: validateStateString, 
  validateLinkID: validateLinkID
}