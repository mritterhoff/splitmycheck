// Some small useful functions that make sense to share
class Utils {
  // display num as  '$num.##' or '$ num.##' (nbsp after $)
  // add commas using regex, via https://stackoverflow.com/a/14428340/1188090
  static priceAsString(num, space = true) {
    return '$' + (space ? '\u00A0' : '') + num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
  }

  // Return a shallow clone of the given 2d array
  static clone2D(a) {
    return a.map(o => [...o]);
  }

  static sumFunc(p, c) {
    return p + c;
  }
}

export { Utils };