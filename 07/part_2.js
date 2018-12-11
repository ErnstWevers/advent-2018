const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const input = { after: [], before: [] };
let working = {};
let time = 0;

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

const getFinished = work => Object.keys(work).find(key => work[key] === 0);

const doWork = work => {
  const decrement = {};
  while (!Object.values(work).includes(0)) {
    Object.keys(work).forEach(key => {
      decrement[key] = work[key] - 1;
    });
    time++;
    return doWork(decrement);
  }
  return work;
};

const loopOver = input => {
  /* eslint-disable no-loop-func */
  while (input.before.length > 0) {
    const options = findOptions(input);
    options.forEach(letter => {
      if (!Object.keys(working).includes(letter)) {
        working[letter] = 51 + parseInt(letter, 36);
      }
    });
    working = doWork(working);
    const letter = getFinished(working);
    delete working[getFinished(working)];
    const reduced = removeNodes(input, letter);
    if (input.after.length === 1) reduced.before.push(...input.after);
    return loopOver(reduced);
  }
};

readStream.pipe(handleStream).on('finish', () => {
  loopOver(input);
  console.log(`the time required to finish all the tasks is: ${time}`);
});
