enum FaceColor {
  WHITE, YELLOW, BLUE, GREEN, RED, ORANGE
};

type Face = FaceColor[];

enum FaceIndex {
  DR, D, DL,
  R, C, L,
  UR, U, UL
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

enum Move {
  U, U_, D, D_, L, L_,
  R, R_, F, F_, B, B_,
  X, X_, Y, Y_, Z, Z_
};

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

function copyFaceOld(to: Face, from: Face, indice: number[], indexF: (x: number) => number = x => x): Face {
  const target = to.concat([]);
  indice.forEach(idx => target[indexF(idx)] = from[idx]);
  return target;
}

function copyFace(from: Face, fromIndexes: number[], to: Face, toIndexes: number[]): Face {
  const result = to.concat([]);
  toIndexes.forEach((ti, i) => result[ti] = from[fromIndexes[i]]);
  return result;
}

function reorderFace(fn: (x: number) => number): ((face: Face) => Face) {
  return (face: Face) => {
    const target = face.concat([]);
    face.forEach((x, i) => target[fn(i)] = x);
    return target;
  }
}

const clockwiseF = (x: number) => (7 * x + 6) % 10;
const counterClockwiseF = (x: number) => (3 * x + 2) % 10;
const halfTurnF = (x: number) => 8 - x;

const clockwise = reorderFace(clockwiseF);
const counterClockwise = reorderFace(counterClockwiseF);
const halfTurn = reorderFace(halfTurnF);

function moveU(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    return {
      front: copyFace(right, [6,7,8], front, [6,7,8]),
      back : copyFace(left , [6,7,8],  back, [6,7,8]),
      up   : (prime ? counterClockwise : clockwise)(up),
      down,
      left: copyFace(front, [6,7,8], left,  [6,7,8]),
      right: copyFace(back, [6,7,8], right, [6,7,8])
    }
  }
}

function moveR(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    const turnedBack = halfTurn(back);
    return {
      front: copyFace(prime ? up : down, [2,5,8], front, [2,5,8]),
      back : prime ? copyFace(down,  [2,5,8], back, [6,3,0])
                   : copyFace(up,    [2,5,8], back, [6,3,0]),
      up   : prime ? copyFace(turnedBack,  [2,5,8], up,   [2,5,8])
                   : copyFace(front, [2,5,8], up,   [2,5,8]),
      down : prime ? copyFace(front, [2,5,8], down, [2,5,8])
                   : copyFace(turnedBack,  [2,5,8], down, [2,5,8]),
      left,
      right : (prime ? counterClockwise : clockwise)(right),
    }
  }
}

function moveL(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    const turnedBack = halfTurn(back);
    return {
      front: copyFace(prime ? up : down,          [0,3,6], front, [0,3,6]),
      back : copyFace(prime ? down : up,          [0,3,6], back,  [8,5,2]),
      up   : copyFace(prime ? turnedBack : front, [0,3,6], up,    [0,3,6]),
      down : copyFace(prime ? front : turnedBack, [0,3,6], down,  [0,3,6]),
      left : (prime ? counterClockwise : clockwise)(left),
      right,
    }
  }
}

function moveF(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    return {
      front: (prime ? counterClockwise : clockwise)(front),
      back,
      up   : copyFace(prime ? right : left, prime ? [6,3,0] : [2,5,8], up,    [0,1,2]),
      down : copyFace(prime ? left : right, prime ? [2,5,8] : [0,3,6], down,  [6,7,8]),
      left : copyFace(prime ? up : down,    prime ? [0,1,2] : [8,7,6], left,  [2,5,8]),
      right: copyFace(prime ? down : up,    prime ? [6,7,8] : [2,1,0], right, [0,3,6]),
    }
  }
}

function moveD(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    return {
      front: copyFace(prime ? right : left, prime ? [0,1,2] : [0,1,2], front, [0,1,2]),
      back : copyFace(prime ? left : right, prime ? [0,1,2] : [0,1,2], back,  [0,1,2]),
      up,
      down : (prime ? counterClockwise : clockwise)(down),
      left : copyFace(prime ? front : back, prime ? [0,1,2] : [0,1,2], left,  [0,1,2]),
      right: copyFace(prime ? back : front, prime ? [0,1,2] : [0,1,2], right, [0,1,2]),
    }
  }
}

const moveOne: (m: Move) => CubeFunc =
  m => {
    switch (m) {
      case Move.U : return moveU(false);
      case Move.U_: return moveU(true);
      case Move.R : return moveR(false);
      case Move.R_: return moveR(true);
      case Move.L : return moveL(false);
      case Move.L_: return moveL(true);
      case Move.F : return moveF(false);
      case Move.F_: return moveF(true);
      case Move.D : return moveD(false);
      case Move.D_: return moveD(true);
      default: return moveU(true);
    }
  }

function move(...sequence: Move[]): CubeFunc {
  return (initialCube: Cube) => sequence.reduce((cube, m) => moveOne(m)(cube), initialCube);
}

export { FaceColor, Face, Cube, defaultCube, Move, move, eqCube };
