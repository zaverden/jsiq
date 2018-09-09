const { expect } = require('chai');
const SelfIterable = require('../lib/selfIterable');

function expectIterator(iterator, values) {
  expect(iterator).has.property(Symbol.iterator);
  expect(iterator[Symbol.iterator]).to.be.a('function');
  expect(iterator[Symbol.iterator]()).to.be.equal(iterator);

  expect(iterator).has.property('next');
  expect(iterator.next).to.be.a('function');

  for (let value of values) {
    expect(iterator.next()).is.deep.equal({ value, done: false });
  }
  expect(iterator.next()).to.have.a.property('done', true);
}

function* gen(n) {
  let i = 0;
  while (i < n) {
    yield ++i;
  }
}

class IterableIterator {
  next() {
    return { done: true };
  }

  [Symbol.iterator]() {
    return this;
  }
}

class Iterator {
  constructor(n) {
    this.i = 0;
    this.n = n;
  }
  next() {
    if (this.i < this.n) {
      return {
        value: ++this.i,
        done: false
      };
    }
    return { done: true };
  }
}

const valueProviders = {
  gen: { 'generator': () => gen(1) },
  inner: { 'IQ iterator': () => new SelfIterable() },
  array: {
    'Array': () => [],
    'Array[Symbol.iterator]()': () => [][Symbol.iterator]()
  },
  set: {
    'Set': () => new Set(),
    'Set[Symbol.iterator]()': () => new Set()[Symbol.iterator](),
    'Set.keys()': () => new Set().keys(),
    'Set.values()': () => new Set().values(),
    'Set.entries()': () => new Set().entries(),
  },
  map: {
    'Map': () => new Map(),
    'Map[Symbol.iterator]()': () => new Map()[Symbol.iterator](),
    'Map.keys()': () => new Map().keys(),
    'Map.values()': () => new Map().values(),
    'Map.entries()': () => new Map().entries(),
  },
  custom: { 'Custom IterableIterator': () => new IterableIterator() },
};

module.exports = exports = {
  gen,
  IterableIterator,
  Iterator,
  valueProviders,
  expectIterator
};
