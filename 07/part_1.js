const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const input = { after: [], before: [] };
const order = [];

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') {
      const a = line.split(' ')[7];
      input.after.push(a);
      const b = line.split(' ')[1];
      input.before.push(b);
    }
  });
  done();
};

const findOptions = ({ after, before }) => {
  const candidates = [];
  before.forEach(value => {
    if (!after.includes(value) && !candidates.includes(value)) {
      candidates.unshift(value);
    }
  });
  return candidates;
};

const pickOption = arr => arr.sort()[0];

const removeNodes = ({ after, before }, option) => {
  const zippered = after.map((entry, index) => [entry, before[index]]);
  const filtered = zippered.filter(item => item[1] !== option);
  const newObj = { after: [], before: [] };
  filtered.forEach(entry => {
    newObj.after.push(entry[0]);
    newObj.before.push(entry[1]);
  });
  return newObj;
};

const loopOver = input => {
  while (input.after.length > 0) {
    const options = findOptions(input);
    const letter = pickOption(options);
    const reduced = removeNodes(input, letter);
    order.push(letter);
    if (input.after.length === 1) {
      order.push(...input.after);
    }
    return loopOver(reduced);
  }
};

readStream.pipe(handleStream).on('finish', () => {
  loopOver(input);
  console.log(`the asked for order is: ${order.join('')}`);
});
