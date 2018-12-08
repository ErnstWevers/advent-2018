const fs = require('fs');
const stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new stream.Transform();
const getFreq = new stream.Transform();
let twos = 0;
let threes = 0;

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => handleStream.push(line));
  done();
};

getFreq._transform = (chunk, encoding, done) => {
  const boxId = chunk.toString().split('');
  const freqs = boxId.map(e =>
    boxId.reduce((a, c) => (e === c ? a + 1 : a), 0)
  );
  if (freqs.includes(2)) twos++;
  if (freqs.includes(3)) threes++;
  done();
};

readStream
  .pipe(handleStream)
  .pipe(getFreq)
  .on('finish', () => console.log(`This is the checksum: ${twos * threes}`));
