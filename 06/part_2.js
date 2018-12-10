const fs = require('fs');
const Stream = require('stream');

const readStream = fs.createReadStream('./input.txt');
const handleStream = new Stream.Transform();
const pointList = new Map();

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

const getDistance = (point, map) => {
  let dist = 0;
  map.forEach((value, key) => {
    dist += Math.abs(point[0] - key[0]) + Math.abs(point[1] - key[1]);
  });
  return dist;
};

const mapNearest = (map, obj, accept) => {
  let area = 0;
  for (let x = obj.l; x <= obj.r; x++) {
    for (let y = obj.t; y <= obj.b; y++) {
      const point = getDistance([x, y], map);
      if (point < accept) area++;
    }
  }
  return area;
};

readStream.pipe(handleStream).on('finish', () => {
  const acceptableArea = mapNearest(pointList, getBounds(pointList), 10000);
  console.log(`the size of the safe area might be: ${acceptableArea}`);
});
