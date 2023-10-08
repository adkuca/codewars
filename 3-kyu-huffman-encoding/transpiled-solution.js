'use strict';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
class MinHeapPriorityQueue {
  constructor(getPriority) {
    this.heap = [];
    this.getPriority = getPriority;
  }
  enqueue(value) {
    this.heap.push(value);
    this.siftUp();
  }
  dequeue() {
    if (this.size() <= 1) return this.heap.pop() ?? null;
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown();
    return min;
  }
  size() {
    return this.heap.length;
  }
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  siftUp() {
    let index = this.size() - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.getPriority(this.heap[index]) >= this.getPriority(this.heap[parentIndex])) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }
  siftDown() {
    let index = 0;
    while (2 * index + 1 < this.size()) {
      let smallerChildIndex = 2 * index + 1;
      if (
        2 * index + 2 < this.size() &&
        this.getPriority(this.heap[2 * index + 2]) < this.getPriority(this.heap[smallerChildIndex])
      )
        smallerChildIndex = 2 * index + 2;
      if (this.getPriority(this.heap[smallerChildIndex]) >= this.getPriority(this.heap[index]))
        break;
      this.swap(smallerChildIndex, index);
      index = smallerChildIndex;
    }
  }
}
/* eslint-disable @typescript-eslint/no-namespace */
var Huffman;
(function (Huffman) {
  class HuffmanTree {
    constructor(frequencies) {
      this.root = HuffmanTree.buildTree(frequencies);
    }
    static buildTree(frequencies) {
      const priorityQueue = new MinHeapPriorityQueue((node) => node.weight);
      for (const [symbol, weight] of frequencies) {
        priorityQueue.enqueue({ kind: 'leaf', symbol, weight });
      }
      while (priorityQueue.size() > 1) {
        const leftNode = priorityQueue.dequeue();
        const rightNode = priorityQueue.dequeue();
        const newInternalNode = {
          kind: 'internal',
          weight: leftNode.weight + rightNode.weight,
          left: leftNode,
          right: rightNode,
        };
        priorityQueue.enqueue(newInternalNode);
      }
      return priorityQueue.dequeue();
    }
  }
  Huffman.HuffmanTree = HuffmanTree;
  function getFrequencies(data) {
    const frequencyMap = new Map();
    for (const char of data) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    return Array.from(frequencyMap.entries());
  }
  Huffman.getFrequencies = getFrequencies;
  function buildTree(frequencies) {
    return new HuffmanTree(frequencies);
  }
  Huffman.buildTree = buildTree;
  function preOrderTraversalWithStack(root, callback) {
    const codeStack = [];
    codeStack.push({ treeNode: root, code: '' });
    while (codeStack.length > 0) {
      const { treeNode, code } = codeStack.pop();
      callback(treeNode, code);
      if (treeNode.kind !== 'leaf') {
        codeStack.push({ treeNode: treeNode.left, code: code + '0' });
        codeStack.push({ treeNode: treeNode.right, code: code + '1' });
      }
    }
  }
  Huffman.preOrderTraversalWithStack = preOrderTraversalWithStack;
  function generateSymbolToCodeMap(tree) {
    if (!tree.root) throw new Error('empty tree');
    const symbolToCodeMap = new Map();
    preOrderTraversalWithStack(tree.root, (node, code) => {
      if (node.kind === 'leaf') symbolToCodeMap.set(node.symbol, code);
    });
    return symbolToCodeMap;
  }
  Huffman.generateSymbolToCodeMap = generateSymbolToCodeMap;
  function generateCodeToSymbolMap(tree) {
    if (!tree.root) throw new Error('empty tree');
    const codeToSymbolMap = new Map();
    preOrderTraversalWithStack(tree.root, (node, code) => {
      if (node.kind === 'leaf') codeToSymbolMap.set(code, node.symbol);
    });
    return codeToSymbolMap;
  }
  Huffman.generateCodeToSymbolMap = generateCodeToSymbolMap;
  function encode(data, symbolToCodeMap) {
    let encoded = '';
    for (const char of data) encoded += symbolToCodeMap.get(char);
    return encoded;
  }
  Huffman.encode = encode;
  function decode(encoded, codeToSymbolMap) {
    let decoded = '';
    let tempCode = '';
    for (const bit of encoded) {
      tempCode += bit;
      if (codeToSymbolMap.has(tempCode)) {
        decoded += codeToSymbolMap.get(tempCode);
        tempCode = '';
      }
    }
    if (tempCode.length !== 0) throw new Error('Invalid encoded string. Extra bits were found.');
    return decoded;
  }
  Huffman.decode = decode;
})(Huffman || (Huffman = {}));
/* eslint-enable @typescript-eslint/no-namespace */
// takes: String; returns: [ [String,Int] ] (Strings in return value are single characters)
function frequencies(s) {
  return Huffman.getFrequencies(s);
}
function encodeDecodeHelper(action, freqs, data) {
  if (freqs.length < 2) return null;
  const tree = Huffman.buildTree(freqs);
  const map =
    action === 'encode'
      ? Huffman.generateSymbolToCodeMap(tree)
      : Huffman.generateCodeToSymbolMap(tree);
  return Huffman[action](data, map);
}
// takes: [ [String,Int] ], String; returns: String (with "0" and "1")
function encode(freqs, s) {
  return encodeDecodeHelper('encode', freqs, s);
}
// takes [ [String, Int] ], String (with "0" and "1"); returns: String
function decode(freqs, bits) {
  return encodeDecodeHelper('decode', freqs, bits);
}
