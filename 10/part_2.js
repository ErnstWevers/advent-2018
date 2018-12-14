const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const input = [];

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') {
      const point = line
        .slice(10)
        .replace(/<|>/g, '')
        .replace(/\s+/g, '')
        .replace('velocity=', ',')
        .split(',');
      input.push({
        xpos: parseInt(point[0], 10),
        ypos: parseInt(point[1], 10),
        xvel: parseInt(point[2], 10),
        yvel: parseInt(point[3], 10)
      });
    }
  });
  done();
};

const getHeight = arr => {
  let top = arr[0].ypos;
  let bot = arr[0].ypos;
  arr.forEach(point => {
    top = point.ypos < top ? point.ypos : top;
    bot = point.ypos > bot ? point.ypos : bot;
  });
  return bot - top;
};

const steps = (arr, sec) => {
  const stepped = arr.map(line => {
    const newLine = { ...line };
    newLine.xpos += sec * newLine.xvel;
    newLine.ypos += sec * newLine.yvel;
    return newLine;
  });
  return stepped;
};

const findSteps = arr => {
  const step0 = getHeight(arr);
  const step1 = getHeight(steps(arr, 1));
  return (step0 - 9) / (step0 - step1);
};

readStream.pipe(handleStream).on('finish', () => {
  console.log(`number of secs until the magic word: ${findSteps(input)}`);
});
