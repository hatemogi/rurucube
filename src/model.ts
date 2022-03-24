enum FaceColor {
  WHITE, YELLOW, BLUE, GREEN, RED, ORANGE, NONE
};

type Face = FaceColor[];

function oppositeColor(color: FaceColor): FaceColor {
  if (color === FaceColor.NONE) return FaceColor.NONE;
  return (color % 2) * -2 + color + 1;
}

enum FaceIndex {
  DL, D, DR,
  L, C, R,
  UL, U, UR
}

type Cube = {
  front : Face,
  back  : Face,
  up    : Face,
  down  : Face,
  left  : Face,
  right : Face
};

const [W, Y, B, G, R, O] = [
  FaceColor.WHITE, FaceColor.YELLOW, FaceColor.BLUE,
  FaceColor.GREEN, FaceColor.RED,    FaceColor.ORANGE
];

const defaultCube: Cube = {
  front: [ B,B,B, B,B,B, B,B,B ],
  back:  [ G,G,G, G,G,G, G,G,G ],
  up:    [ W,W,W, W,W,W, W,W,W ],
  down:  [ Y,Y,Y, Y,Y,Y, Y,Y,Y ],
  left:  [ R,R,R, R,R,R, R,R,R ],
  right: [ O,O,O, O,O,O, O,O,O ]
};

enum Slice {
  U, D, L, R, F, B, X, Y, Z
}

const allSlices = [
  Slice.U, Slice.D,
  Slice.L, Slice.R,
  Slice.F, Slice.B,
  Slice.X, Slice.Y, Slice.Z];

type Move = {
  slice: Slice,
  prime: boolean
}

const allMoves: Move[] = allSlices.flatMap(slice =>
  [false, true].flatMap(prime =>
    ({slice, prime})));

const eqFace = (f1: Face, f2: Face) =>
  f1.join() === f2.join();

const eqCube = (c1: Cube, c2: Cube) =>
  eqFace(c1.front, c2.front) &&
  eqFace(c1.back,  c2.back)  &&
  eqFace(c1.up,    c2.up)    &&
  eqFace(c1.down,  c2.down)  &&
  eqFace(c1.left,  c2.left)  &&
  eqFace(c1.right, c2.right)

type CubeFunc = (c: Cube) => Cube;

function copyFace(from: Face, to: Face, toIndexes: number[]): Face {
  const result = to.concat([]);
  toIndexes.forEach(ti => result[ti] = from[ti]);
  return result;
}

function reorderFace(from: (n: number) => number): ((face: Face) => Face) {
  return (face: Face) => {
    const target = face.concat([]);
    face.forEach((x, n) => target[from(n)] = x);
    return target;
  }
}

const clockwiseF = (x: number) => (7 * x + 6) % 10;
const counterclockwiseF = (x: number) => (3 * x + 2) % 10;
const halfTurnF = (x: number) => 8 - x;

const clockwise = reorderFace(clockwiseF);
const counterclockwise = reorderFace(counterclockwiseF);
const halfTurn = reorderFace(halfTurnF);

function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => f(a, b);
}

type MoveFunc = (prime: boolean) => (cube: Cube) => Cube;

const moveU: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: copyFace(right, front, [6,7,8]),
  back : copyFace(left,  back,  [6,7,8]),
  up   : clockwise(up),
  down,
  left : copyFace(front, left,  [6,7,8]),
  right: copyFace(back,  right, [6,7,8])
});

const moveR: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: copyFace(down,           front, [2,5,8]),
  back : copyFace(halfTurn(up),   back,  [0,3,6]),
  up   : copyFace(front,          up,    [2,5,8]),
  down : copyFace(halfTurn(back), down,  [2,5,8]),
  left,
  right: clockwise(right),
});

const moveL: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: copyFace(up,             front, [0,3,6]),
  back : copyFace(halfTurn(down), back,  [2,5,8]),
  up   : copyFace(halfTurn(back), up,    [0,3,6]),
  down : copyFace(front,          down,  [0,3,6]),
  left : clockwise(left),
  right,
});

const moveF: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: clockwise(front),
  back,
  up   : copyFace(clockwise(left),  up,    [0,1,2]),
  down : copyFace(clockwise(right), down,  [6,7,8]),
  left : copyFace(clockwise(down),  left,  [2,5,8]),
  right: copyFace(clockwise(up),    right, [0,3,6]),
});

const moveD: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: copyFace(left,  front, [0,1,2]),
  back : copyFace(right, back,  [0,1,2]),
  up,
  down : clockwise(down),
  left : copyFace(back,  left,  [0,1,2]),
  right: copyFace(front, right, [0,1,2]),
});

const moveB: CubeFunc = ({front, back, up, down, left, right}) => ({
  front,
  back : clockwise(back),
  up   : copyFace(counterclockwise(right), up,    [6,7,8]),
  down : copyFace(counterclockwise(left),  down,  [0,1,2]),
  left : copyFace(counterclockwise(up),    left,  [0,3,6]),
  right: copyFace(counterclockwise(down),  right, [2,5,8]),
});

function moveX({front, back, up, down, left, right}: Cube): Cube {
  return {
    front: down,
    back : halfTurn(up),
    up   : front,
    down : halfTurn(back),
    left : counterclockwise(left),
    right: clockwise(right)
  };
}

const moveY: CubeFunc = ({front, back, up, down, left, right}) => ({
  front: right,
  back : left,
  up   : clockwise(up),
  down : counterclockwise(down),
  left : front,
  right: back
});

function moveZ({front, back, up, down, left, right}: Cube): Cube {
  return {
    front: clockwise(front),
    back : counterclockwise(back),
    up   : clockwise(left),
    down : clockwise(right),
    left : clockwise(down),
    right: clockwise(up)
  };
}

function repeat(count: number): ((f: CubeFunc) => CubeFunc) {
  return (f: CubeFunc) => (c: Cube) => {
    let result: Cube = c;
    while (--count >= 0) result = f(result);
    return result;
  }
}

const moveOne: (m: Move) => CubeFunc =
  ({slice, prime}) => {
    const P = repeat(prime ? 3 : 1);
    switch (slice) {
      case Slice.U : return P(moveU);
      case Slice.R : return P(moveR);
      case Slice.L : return P(moveL);
      case Slice.F : return P(moveF);
      case Slice.D : return P(moveD);
      case Slice.B : return P(moveB);
      case Slice.X : return P(moveX);
      case Slice.Y : return P(moveY);
      case Slice.Z : return P(moveZ);
    }
  }

function move(...sequence: Move[]): CubeFunc {
  return (initialCube: Cube) => sequence.reduce((cube, m) => moveOne(m)(cube), initialCube);
}

export { FaceColor, Face, Cube, defaultCube, Slice, allSlices, Move, allMoves, move, eqCube, oppositeColor };
