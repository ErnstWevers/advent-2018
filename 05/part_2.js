const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
const input = [];
let stack = [];
let smallest = 99999;

const checkFold = (foo, bar) =>
  foo !== bar ? foo.toUpperCase() === bar || foo === bar.toUpperCase() : false;

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const chars = data.split('');
  chars.forEach(char => {
    if (char !== '') {
      input.push(char);
    }
  });
  done();
};

const arrayFold = (array, letter) => {
  let lastChar;
  array.forEach(newChar => {
    if (!(newChar.toLowerCase() === letter)) {
      if (!lastChar) {
        lastChar = newChar;
      } else if (checkFold(newChar, lastChar)) {
        lastChar = stack.pop();
      } else {
        stack.push(lastChar);
        lastChar = newChar;
      }
    }
  });
  smallest = stack.length < smallest ? stack.length : smallest;
  stack = [];
};

const cyclingLetters = array =>
  alpha.forEach(letter => arrayFold(array, letter));

readStream.pipe(handleStream).on('finish', () => {
  cyclingLetters(input);
  console.log(`this is the number of letters remaining: ${smallest}`);
});
