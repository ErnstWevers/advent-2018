const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const getFreq = new Stream.Transform();
let sum = 0;

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => handleStream.push(line));
  done();
};

getFreq._transform = (chunk, encoding, done) => {
  sum += parseInt(chunk, 10);
  getFreq.push(`${sum.toString()}\n`);
  done();
};

readStream
  .pipe(handleStream)
  .pipe(getFreq)
  .on('finish', () => console.log(`The frequency ends up being: ${sum}`));
