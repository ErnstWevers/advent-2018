const uuid4 = require('uuid4');
const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const input = [];
const nodeMap = new Map();
let location = 0;
let par = '';
let cur = 'top';

const readValThenIncr = (bool = true) => {
  const val = input[location];
  if (bool) location++;
  return val;
};

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const nums = data.split(' ');
  nums.forEach(num => {
    if (num !== '') {
      input.push(parseInt(num, 10));
    }
  });
  done();
};

const initNodeMap = () => {
  nodeMap.set(cur, { par, childList: [], sum: 0 });
  nodeMap.get(cur).iter = readValThenIncr(false);
  nodeMap.get(cur).childNum = readValThenIncr();
  nodeMap.get(cur).num = readValThenIncr();
};

const addNode = () => {
  par = cur;
  cur = uuid4();
  nodeMap.set(cur, { par, childList: [], sum: 0 });
  nodeMap.get(cur).iter = readValThenIncr(false);
  nodeMap.get(cur).childNum = readValThenIncr();
  nodeMap.get(cur).num = readValThenIncr();
  nodeMap.get(par).childList.push(cur);
};

const closeNode = () => {
  nodeMap.get(cur).refs = [];
  if (nodeMap.get(cur).childNum > 0) {
    for (let i = 0; i < nodeMap.get(cur).num; i++) {
      const children = nodeMap.get(cur).childList;
      if (children.length >= readValThenIncr(false)) {
        nodeMap.get(cur).sum += nodeMap.get(
          children[readValThenIncr(false) - 1]
        ).sum;
      }
      location++;
    }
  }
  if (nodeMap.get(cur).childNum === 0) {
    for (let i = 0; i < nodeMap.get(cur).num; i++) {
      nodeMap.get(cur).refs.push(readValThenIncr(false));
      nodeMap.get(cur).sum += readValThenIncr();
    }
  }
  if (nodeMap.get(par)) {
    nodeMap.get(par).iter = nodeMap.get(par).iter - 1;
    cur = par;
    par = nodeMap.get(par).par;
  }
};

const parseNodes = () => {
  while (location < input.length) {
    if (nodeMap.get(cur).iter > 0) {
      addNode();
    }
    if (nodeMap.get(cur).iter === 0) {
      closeNode();
    }
  }
};

readStream.pipe(handleStream).on('finish', () => {
  initNodeMap();
  parseNodes();
  console.log(`the new value is: ${nodeMap.get('top').sum}`);
});
