/* eslint-disable @typescript-eslint/no-non-null-assertion */

class MinHeapPriorityQueue<T> {
  private heap: T[] = [];
  private getPriority: (item: T) => number;

  constructor(getPriority: (item: T) => number) {
    this.getPriority = getPriority;
  }

  enqueue(value: T): void {
    this.heap.push(value);
    this.siftUp();
  }

  dequeue(): T | null {
    if (this.size() <= 1) return this.heap.pop() ?? null;

    const min = this.heap[0]!;
    this.heap[0] = this.heap.pop()!;
    this.siftDown();

    return min;
  }

  size(): number {
    return this.heap.length;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j]!, this.heap[i]!];
  }

  private siftUp(): void {
    let index = this.size() - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.getPriority(this.heap[index]!) >= this.getPriority(this.heap[parentIndex]!)) break;

      this.swap(parentIndex, index);

      index = parentIndex;
    }
  }

  private siftDown(): void {
    let index = 0;

    while (2 * index + 1 < this.size()) {
      let smallerChildIndex = 2 * index + 1;
      if (
        2 * index + 2 < this.size() &&
        this.getPriority(this.heap[2 * index + 2]!) <
          this.getPriority(this.heap[smallerChildIndex]!)
      )
        smallerChildIndex = 2 * index + 2;

      if (this.getPriority(this.heap[smallerChildIndex]!) >= this.getPriority(this.heap[index]!))
        break;

      this.swap(smallerChildIndex, index);

      index = smallerChildIndex;
    }
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
namespace Huffman {
  export type HuffmanLeafNode = {
    kind: 'leaf';
    weight: number;
    symbol: string;
  };

  export type HuffmanInternalNode = {
    kind: 'internal';
    weight: number;
    left: HuffmanTreeNode;
    right: HuffmanTreeNode;
  };

  export type HuffmanTreeNode = HuffmanLeafNode | HuffmanInternalNode;

  export class HuffmanTree {
    root: HuffmanTreeNode | null;

    constructor(frequencies: [string, number][]) {
      this.root = HuffmanTree.buildTree(frequencies);
    }

    static buildTree(frequencies: [string, number][]): HuffmanTreeNode | null {
      const priorityQueue = new MinHeapPriorityQueue<HuffmanTreeNode>((node) => node.weight);

      for (const [symbol, weight] of frequencies) {
        priorityQueue.enqueue({ kind: 'leaf', symbol, weight });
      }

      while (priorityQueue.size() > 1) {
        const leftNode = priorityQueue.dequeue()!;
        const rightNode = priorityQueue.dequeue()!;

        const newInternalNode: HuffmanInternalNode = {
          kind: 'internal',
          weight: leftNode.weight + rightNode.weight,
          left: leftNode,
          right: rightNode,
        };

        priorityQueue.enqueue(newInternalNode);
      }

      return priorityQueue.dequeue()!;
    }
  }

  export function getFrequencies(data: string): [string, number][] {
    const frequencyMap = new Map<string, number>();

    for (const char of data) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    return Array.from(frequencyMap.entries());
  }

  export function buildTree(frequencies: [string, number][]): HuffmanTree {
    return new HuffmanTree(frequencies);
  }

  export type TreeTraversalCallback = (node: HuffmanTreeNode, code: string) => void;

  export function preOrderTraversalWithStack(
    root: HuffmanTreeNode,
    callback: TreeTraversalCallback
  ): void {
    type CodeStackNode = {
      treeNode: HuffmanTreeNode;
      code: string;
    };

    const codeStack: CodeStackNode[] = [];
    codeStack.push({ treeNode: root, code: '' });

    while (codeStack.length > 0) {
      const { treeNode, code } = codeStack.pop()!;
      callback(treeNode, code);

      if (treeNode.kind !== 'leaf') {
        codeStack.push({ treeNode: treeNode.left, code: code + '0' });
        codeStack.push({ treeNode: treeNode.right, code: code + '1' });
      }
    }
  }

  export function generateSymbolToCodeMap(tree: HuffmanTree): Map<string, string> {
    if (!tree.root) throw new Error('empty tree');

    const symbolToCodeMap = new Map<string, string>();
    preOrderTraversalWithStack(tree.root, (node, code) => {
      if (node.kind === 'leaf') symbolToCodeMap.set(node.symbol, code);
    });

    return symbolToCodeMap;
  }

  export function generateCodeToSymbolMap(tree: HuffmanTree): Map<string, string> {
    if (!tree.root) throw new Error('empty tree');

    const codeToSymbolMap = new Map<string, string>();
    preOrderTraversalWithStack(tree.root, (node, code) => {
      if (node.kind === 'leaf') codeToSymbolMap.set(code, node.symbol);
    });

    return codeToSymbolMap;
  }

  export function encode(data: string, symbolToCodeMap: Map<string, string>): string {
    let encoded = '';
    for (const char of data) encoded += symbolToCodeMap.get(char);

    return encoded;
  }

  export function decode(encoded: string, codeToSymbolMap: Map<string, string>) {
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
}
/* eslint-enable @typescript-eslint/no-namespace */

// takes: String; returns: [ [String,Int] ] (Strings in return value are single characters)
function frequencies(s: string): [string, number][] {
  return Huffman.getFrequencies(s);
}

function encodeDecodeHelper(
  action: 'encode' | 'decode',
  freqs: [string, number][],
  data: string
): string | null {
  if (freqs.length < 2) return null;
  const tree = Huffman.buildTree(freqs);
  const map =
    action === 'encode'
      ? Huffman.generateSymbolToCodeMap(tree)
      : Huffman.generateCodeToSymbolMap(tree);
  return Huffman[action](data, map);
}

// takes: [ [String,Int] ], String; returns: String (with "0" and "1")
function encode(freqs: [string, number][], s: string): string | null {
  return encodeDecodeHelper('encode', freqs, s);
}

// takes [ [String, Int] ], String (with "0" and "1"); returns: String
function decode(freqs: [string, number][], bits: string): string | null {
  return encodeDecodeHelper('decode', freqs, bits);
}
