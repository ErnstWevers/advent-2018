const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const addRecord = new Stream.Transform();
const claims = new Map();
const idList = new Map();

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
  const id = data[0].slice(1);
  const loc = data[2].slice(0, -1).split(',');
  const dim = data[3].split('x');
  idList.set(id);

  for (let x = 0; x < dim[0]; x++) {
    for (let y = 0; y < dim[1]; y++) {
      const curr = `${parseInt(loc[0], 10) + x},${parseInt(loc[1], 10) + y}`;
      if (claims.has(curr)) {
        idList.delete(id);
        idList.delete(claims.get(curr));
      }
      claims.set(curr, id);
    }
  }
  done();
};

readStream
  .pipe(handleStream)
  .pipe(addRecord)
  .on('finish', () => {
    console.log(`the non-overlapping claim is: ${idList.keys().next().value}`);
  });
