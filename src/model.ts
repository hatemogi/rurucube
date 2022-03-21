enum FaceColor {
  WHITE, YELLOW, BLUE, GREEN, RED, ORANGE, NONE
};

type Face = FaceColor[];

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

const [W, Y, B, G, R, O, None] = [
  FaceColor.WHITE, FaceColor.YELLOW, FaceColor.BLUE,
  FaceColor.GREEN, FaceColor.RED,    FaceColor.ORANGE,
  FaceColor.NONE
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

function copyFace(from: Face, fromIndexes: number[], to: Face, toIndexes: number[]): Face {
  const result = to.concat([]);
  toIndexes.forEach((ti, i) => result[ti] = from[fromIndexes[i]]);
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
const counterClockwiseF = (x: number) => (3 * x + 2) % 10;
const halfTurnF = (x: number) => 8 - x;

const clockwise = reorderFace(clockwiseF);
const counterClockwise = reorderFace(counterClockwiseF);
const halfTurn = reorderFace(halfTurnF);

function moveU(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: copyFace(prime ? left : right, [6,7,8], front, [6,7,8]),
      back : copyFace(prime ? right : left, [6,7,8],  back, [6,7,8]),
      up   : (prime ? counterClockwise : clockwise)(up),
      down,
      left: copyFace(prime ? back : front, [6,7,8], left,  [6,7,8]),
      right: copyFace(prime ? front: back, [6,7,8], right, [6,7,8])
    }
  }
}

function moveR(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    const turnedBack = halfTurn(back);
    return {
      front: copyFace(prime ? up : down,          [2,5,8], front, [2,5,8]),
      back : copyFace(prime ? down : up,          [2,5,8], back,  [6,3,0]),
      up   : copyFace(prime ? turnedBack : front, [2,5,8], up,    [2,5,8]),
      down : copyFace(prime ? front : turnedBack, [2,5,8], down,  [2,5,8]),
      left,
      right : (prime ? counterClockwise : clockwise)(right),
    }
  }
}

function moveL(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    const turnedBack = halfTurn(back);
    return {
      front: copyFace(prime ? down : up,          [0,3,6], front, [0,3,6]),
      back : copyFace(prime ? up : down,          [6,3,0], back,  [2,5,8]),
      up   : copyFace(prime ? front : turnedBack, [0,3,6], up,    [0,3,6]),
      down : copyFace(prime ? turnedBack: front,  [0,3,6], down,  [0,3,6]),
      left : (prime ? counterClockwise : clockwise)(left),
      right,
    }
  }
}

function moveF(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: (prime ? counterClockwise : clockwise)(front),
      back,
      up   : copyFace(prime ? right : left, prime ? [6,3,0] : [2,5,8], up,    [0,1,2]),
      down : copyFace(prime ? left : right, prime ? [8,5,2] : [0,3,6], down,  [6,7,8]),
      left : copyFace(prime ? up : down,    prime ? [0,1,2] : [8,7,6], left,  [2,5,8]),
      right: copyFace(prime ? down : up,    prime ? [6,7,8] : [2,1,0], right, [0,3,6]),
    }
  }
}

function moveD(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: copyFace(prime ? right : left, [0,1,2], front, [0,1,2]),
      back : copyFace(prime ? left : right, [0,1,2], back,  [0,1,2]),
      up,
      down : (prime ? counterClockwise : clockwise)(down),
      left : copyFace(prime ? front : back, [0,1,2], left,  [0,1,2]),
      right: copyFace(prime ? back : front, [0,1,2], right, [0,1,2]),
    }
  }
}

function moveB(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front,
      back : (prime ? counterClockwise : clockwise)(back),
      up   : copyFace(prime ? clockwise(left) : counterClockwise(right), [6,7,8], up,    [6,7,8]),
      down : copyFace(prime ? clockwise(right): counterClockwise(left),  [0,1,2], down,  [0,1,2]),
      left : copyFace(prime ? clockwise(down) : counterClockwise(up),    [0,3,6], left,  [0,3,6]),
      right: copyFace(prime ? clockwise(up)   : counterClockwise(down),  [2,5,8], right, [2,5,8]),
    }
  }
}

function moveX(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: prime ? up : down,
      back : prime ? down : up,
      up   : prime ? back : front,
      down : prime ? front : back,
      left : (prime ? clockwise : counterClockwise)(left),
      right: (prime ? counterClockwise : clockwise)(right)
    }
  }
}

function moveY(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: prime ? left : right,
      back : prime ? right : left,
      up   : (prime ? counterClockwise : clockwise)(up),
      down : (prime ? clockwise : counterClockwise)(down),
      left : prime ? back : front,
      right: prime ? front : back
    }
  }
}

function moveZ(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}) => {
    return {
      front: (prime ? counterClockwise : clockwise)(front),
      back : (prime ? clockwise : counterClockwise)(back),
      up   : prime ? counterClockwise(right) : clockwise(left),
      down : prime ? counterClockwise(left)  : clockwise(right),
      left : prime ? counterClockwise(up)    : clockwise(down),
      right: prime ? counterClockwise(down)  : clockwise(up)
    }
  }
}

const moveOne: (m: Move) => CubeFunc =
  m => {
    const [normal, prime] = [false, true];
    switch (m) {
      case Move.U : return moveU(normal);
      case Move.U_: return moveU(prime);
      case Move.R : return moveR(normal);
      case Move.R_: return moveR(prime);
      case Move.L : return moveL(normal);
      case Move.L_: return moveL(prime);
      case Move.F : return moveF(normal);
      case Move.F_: return moveF(prime);
      case Move.D : return moveD(normal);
      case Move.D_: return moveD(prime);
      case Move.B : return moveB(normal);
      case Move.B_: return moveB(prime);
      case Move.X : return moveX(normal);
      case Move.X_: return moveX(prime);
      case Move.Y : return moveY(normal);
      case Move.Y_: return moveY(prime);
      case Move.Z : return moveZ(normal);
      case Move.Z_: return moveZ(prime);
      default: return moveU(true);
    }
  }

function move(...sequence: Move[]): CubeFunc {
  return (initialCube: Cube) => sequence.reduce((cube, m) => moveOne(m)(cube), initialCube);
}

export { FaceColor, Face, Cube, defaultCube, Move, move, eqCube };
