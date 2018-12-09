const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const addRecord = new Stream.Transform();
const claims = new Map();
const doubles = new Map();

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') handleStream.push(line);
  });
  done();
};

addRecord._transform = (chunk, encoding, done) => {
  const data = chunk.toString().split(' ');
  const loc = data[2].slice(0, -1).split(',');
  const dim = data[3].split('x');

  for (let x = 0; x < dim[0]; x++) {
    for (let y = 0; y < dim[1]; y++) {
      const curr = `${parseInt(loc[0], 10) + x},${parseInt(loc[1], 10) + y}`;
      if (!claims.has(curr)) {
        claims.set(curr, 1);
      } else if (!doubles.has(curr)) {
        doubles.set(curr, 1);
      }
    }
  }
  done();
};

readStream
  .pipe(handleStream)
  .pipe(addRecord)
  .on('finish', () =>
    console.log(`the number of overlapping claims is: ${doubles.size}`)
  );
