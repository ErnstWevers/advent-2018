const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const foldStream = new Stream.Transform();
const stack = [];
let lastChar;

const checkFold = (foo, bar) =>
  foo !== bar ? foo.toUpperCase() === bar || foo === bar.toUpperCase() : false;

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const chars = data.split('');
  chars.forEach(char => {
    if (char !== '') {
      handleStream.push(char);
    }
  });
  done();
};

foldStream._transform = (chunk, encoding, done) => {
  const newChar = chunk.toString();
  if (!(newChar.toLowerCase() === 'p')) {
    if (!lastChar) {
      lastChar = newChar;
    } else if (checkFold(newChar, lastChar)) {
      lastChar = stack.pop();
    } else {
      stack.push(lastChar);
      lastChar = newChar;
    }
  }
  done();
};

readStream
  .pipe(handleStream)
  .pipe(foldStream)
  .on('finish', () => {
    console.log(
      `this is the number of letters remaining: ${stack.join('').length}`
    );
  });
