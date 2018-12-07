const fs = require('fs');
const stream = require('stream');

const readStream = fs.createReadStream('./input/input.txt');
const handleStream = new stream.Transform();
const getFreq = new stream.Transform();

const input = [];
let sum = 0;
let doubleFreq;

handleStream._transform = (chunk, encoding, next) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => handleStream.push(line));
  next();
};

getFreq._transform = (chunk, encoding, done) => {
  sum += parseInt(chunk, 10);
  input.push(sum);
  done();
};

readStream
  .pipe(handleStream)
  .pipe(getFreq)
  .on('finish', () => {
    let limit = 1000;
    while (!doubleFreq && limit > 0) {
      for (let i = 0; i < input.length; i++) {
        const freq = input[i] + limit * sum;
        if (input.find(i => i === freq)) {
          doubleFreq = freq;
          break;
        }
      }
      limit--;
    }
    console.log(`the first double frequency is at: ${doubleFreq}`);
  });
