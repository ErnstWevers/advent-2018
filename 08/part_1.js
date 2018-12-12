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
  nodeMap.set(cur, { par });
  nodeMap.get(cur).chi = readValThenIncr();
  nodeMap.get(cur).num = readValThenIncr();
};

const addNode = () => {
  par = cur;
  cur = uuid4();
  nodeMap.set(cur, { par });
  nodeMap.get(cur).chi = readValThenIncr();
  nodeMap.get(cur).num = readValThenIncr();
};

const closeNode = () => {
  nodeMap.get(cur).che = [];
  for (let i = 0; i < nodeMap.get(cur).num; i++) {
    nodeMap.get(cur).che.push(readValThenIncr());
  }
  if (nodeMap.get(par)) {
    nodeMap.get(par).chi = nodeMap.get(par).chi - 1;
    cur = par;
    par = nodeMap.get(par).par;
  }
};

const parseNodes = () => {
  while (location < input.length) {
    if (nodeMap.get(cur).chi > 0) {
      addNode();
    }
    if (nodeMap.get(cur).chi === 0) {
      closeNode();
    }
  }
};

const getCheckSum = () => {
  let sum = 0;
  nodeMap.forEach(value =>
    value.che.forEach(num => {
      sum += num;
    })
  );
  return sum;
};

readStream.pipe(handleStream).on('finish', () => {
  initNodeMap();
  parseNodes();
  console.log(`the checksum for all the nodes is: ${getCheckSum()}`);
});
