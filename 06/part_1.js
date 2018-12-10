const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const pointList = new Map();
const infinite = new Map();

handleStream._transform = (chunk, encoding, done) => {
  const data = chunk.toString();
  const lines = data.split('\n');
  lines.forEach(line => {
    if (line !== '') {
      const point = line.split(',').map(c => parseInt(c, 10));
      pointList.set(point, 0);
    }
  });
  done();
};

const getBounds = map => {
  const init = map.keys().next().value;
  const edge = { t: init[1], r: init[0], b: init[1], l: init[0] };
  map.forEach((value, key) => {
    edge.t = key[1] < edge.t ? key[1] : edge.t;
    edge.r = key[0] > edge.r ? key[0] : edge.r;
    edge.b = key[1] > edge.b ? key[1] : edge.b;
    edge.l = key[0] < edge.l ? key[0] : edge.l;
  });
  return edge;
};

const findNearest = (point, map, max) => {
  let minDist = max;
  let closest = false;
  map.forEach((value, key) => {
    const dist = Math.abs(point[0] - key[0]) + Math.abs(point[1] - key[1]);
    closest = minDist > dist ? key : closest;
    closest = minDist === dist ? false : closest;
    minDist = minDist > dist ? dist : minDist;
  });
  return closest;
};

const mapNearest = (map, obj) => {
  for (let x = obj.l; x <= obj.r; x++) {
    for (let y = obj.t; y <= obj.b; y++) {
      const point = findNearest([x, y], map, obj.r - obj.r + obj.b - obj.t);
      if ((point && x === obj.l) || x === obj.r || y === obj.l || y === obj.r) {
        infinite.set(point);
      }
      if (point && map.has(point)) map.set(point, map.get(point) + 1);
    }
  }
  return map;
};

const filterMap = (trash, keep) => {
  let highest = 0;
  trash.forEach((value, key) => keep.delete(key));
  keep.forEach(value => {
    highest = value > highest ? value : highest;
    return null;
  });
  return highest;
};

readStream.pipe(handleStream).on('finish', () => {
  const areaMap = mapNearest(pointList, getBounds(pointList));
  console.log(`the largest area is: ${filterMap(infinite, areaMap)}`);
});
