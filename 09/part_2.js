const linked = new Map();
const score = new Map();
linked.set(0, { v: 0, p: 0, n: 0 });

const move = (linked, curr, num) => {
  let node = curr;
  const traverse = Math.abs(num);
  for (let i = 0; i < traverse; i++) {
    node = num < 0 ? linked.get(node.p) : linked.get(node.n);
  }
  return node;
};

const insert = (linked, curr, marble) => {
  const nextNode = linked.get(curr.n);
  const prevNode = curr;
  prevNode.n = marble;
  nextNode.p = marble;
  linked.set(marble, { v: marble, p: prevNode.v, n: nextNode.v });
  return linked.get(marble);
};

const take = (linked, curr, marble, players) => {
  // score the player
  const player = marble % players;
  if (score.has(player)) {
    const newScore = score.get(player) + curr.v + marble;
    score.set(player, newScore);
  } else {
    score.set(player, curr.v + marble);
  }
  // remove the marble
  const prevNode = linked.get(curr.p);
  const nextNode = linked.get(curr.n);
  prevNode.n = nextNode.v;
  nextNode.p = prevNode.v;
  linked.delete(curr.v);
};

const playGame = (players, marbles) => {
  let curr = linked.get(0);
  let i = 1;
  while (i <= marbles) {
    if (i % 23 !== 0) {
      curr = move(linked, curr, 1);
      curr = insert(linked, curr, i);
    } else {
      curr = move(linked, curr, -7);
      take(linked, curr, i, players);
      curr = move(linked, curr, 1);
    }
    i++;
  }
};

const getMax = map => {
  let high = 0;
  map.forEach(value => {
    high = value > high ? value : high;
  });
  return high;
};

playGame(448, 7162800);
console.log(`highest score:  ${getMax(score)}`);
