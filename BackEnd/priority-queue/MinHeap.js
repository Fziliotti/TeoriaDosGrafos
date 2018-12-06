const Heap = require('./Heap')

class MinHeap extends Heap {
    
    pairIsInCorrectOrder(firstElement, secondElement) {
      return this.compare.lessThanOrEqual(firstElement, secondElement);
    }
  }

  module.exports = MinHeap