const fs = require('fs');
const stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new stream.Transform();
const boxList = [];

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') boxList.push(line);
  });
  done();
};

const compareBoxes = (foo, bar) => {
  let diff = 0;
  for (let i = 0; i < foo.length; i++) {
    if (foo[i] !== bar[i]) diff++;
  }
  return diff < 2;
};

const subtractBoxes = (foo, bar) => {
  const common = [];
  for (let i = 0; i < foo.length; i++) {
    if (foo[i] === bar[i]) common.push(foo[i]);
  }
  return common.join('');
};

readStream.pipe(handleStream).on('finish', () => {
  for (let i = 0; i < boxList.length - 1; i++) {
    for (let j = i + 1; j < boxList.length; j++) {
      if (compareBoxes(boxList[i], boxList[j])) {
        console.log(
          `the common letters in the IDs are: ${subtractBoxes(
            boxList[i],
            boxList[j]
          )}`
        );
        return null;
      }
    }
  }
});
