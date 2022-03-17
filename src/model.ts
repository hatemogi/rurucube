import { CubeReflectionMapping } from "three";

enum FaceColor {
  WHITE, YELLOW, BLUE, GREEN, RED, ORANGE
};

type Face = FaceColor[];

enum FaceIndex {
  FRONT, BACK, UP, DOWN, LEFT, RIGHT
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

function copyCell(to: Face, from: Face, indice: number[]): Face {
  const target = to.concat([]);
  indice.forEach(idx => target[idx] = from[idx]);
  return target;
}

function moveU({front, back, up, down, left, right}: Cube): Cube {
  return {
    front: front.slice(0, 6).concat(right.slice(6, 9)),
    back: back.slice(0, 6).concat(left.slice(6,9)),
    up,
    down,
    left: left.slice(0, 6).concat(front.slice(6,9)),
    right: right.slice(0, 6).concat(back.slice(6,9))
  }
}


type CubeFunc = (c: Cube) => Cube;

function moveR(prime: boolean): CubeFunc {
  return ({front, back, up, down, left, right}: Cube) => {
    return {
      front: copyCell(front, prime ? up : down,    [2, 5, 8]),
      back : copyCell(back,  prime ? down : up,    [2, 5, 8]),
      up   : copyCell(up,    prime ? back : front, [2, 5, 8]),
      down : copyCell(down,  prime ? front : back, [2, 5, 8]),
      left,
      right,
    }
  }
}

const move: (m: Move) => CubeFunc =
  m => {
    if (m == Move.U) return moveU;
    else if (m == Move.R) return moveR(true);
    else if (m == Move.R_) return moveR(false);
    else moveU;
  }

export { FaceColor, Face, Cube, defaultCube, Move, move, eqCube };
