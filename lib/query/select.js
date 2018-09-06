const SelfIterable = require('../selfIterable');

class SelectIterator extends SelfIterable {
  constructor(source, selector) {
    super();
    this.source = source;
    this.selector = selector;
  }

  next() {
    let { done, value } = this.source.next();
    if (done) {
      return { done };
    }

    return {
      done: false,
      value: this.selector(value)
    };
  }
}

function select(source, selector) {
  const iterator = new SelectIterator(source, selector);
  return iterator;
}

module.exports = exports = select;