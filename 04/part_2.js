const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const getGuards = new Stream.Transform();
const input = [];
const guardsMap = new Map();

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') {
      input.push(line);
      handleStream.push(line);
    }
  });
  done();
};

const getGuardId = entry => entry.split('#')[1].split(' ')[0];

const getMinute = entry => entry.split(']')[0].slice(-2);

const getSleepiest = map => {
  let sleepy;
  let high = 0;
  map.forEach((value, key) => {
    const max = Math.max(...value);
    sleepy = max > high ? key : sleepy;
    high = max > high ? max : high;
  });
  return sleepy;
};

getGuards._transform = (chunk, encoding, done) => {
  const line = chunk.toString();
  if (line.includes('#')) {
    const guardId = getGuardId(line);
    if (!guardsMap.has(guardId)) guardsMap.set(guardId, new Array(60).fill(0));
  }
  done();
};

const handleShifts = shifts => {
  let guardId;
  let sleep;
  let wakes;
  shifts.forEach(line => {
    if (line.includes('#')) guardId = getGuardId(line);
    if (line.includes('sleep')) sleep = getMinute(line);
    if (line.includes('wakes')) wakes = getMinute(line);

    if (sleep && wakes) {
      const summary = guardsMap.get(guardId);
      for (let i = parseInt(sleep, 10); i < parseInt(wakes, 10); i++) {
        summary[i]++;
      }
      sleep = undefined;
      wakes = undefined;
    }
  });
};

readStream
  .pipe(handleStream)
  .pipe(getGuards)
  .on('finish', () => {
    input.sort();
    handleShifts(input);
    const guard = getSleepiest(guardsMap);
    const highest = Math.max(...guardsMap.get(guard));
    const minute = guardsMap.get(guard).indexOf(highest);
    console.log(`the number is ${guard * minute}`);
  });
