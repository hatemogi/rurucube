import { Cube, eqCube, defaultCube, move, Move, FaceColor } from '../src/model';

const [W, B, O, Y, G, R] = [
  FaceColor.WHITE,  FaceColor.BLUE,  FaceColor.ORANGE,
  FaceColor.YELLOW, FaceColor.GREEN, FaceColor.RED];

const testCube: Cube = {
  up    : [B,W,B, R,W,O, G,W,G],
  front : [W,B,Y, W,O,Y, W,G,Y],
  left  : [R,B,O, R,B,O, R,B,O],
  right : [O,G,R, O,G,R, O,G,R],
  down  : [B,Y,B, O,Y,R, G,Y,G],
  back  : [W,G,Y, W,R,Y, W,B,Y]
}

function expectCube(expected: Cube, actual: Cube) {
  expect(eqCube(expected, actual)).toBe(true);
}

function expectNoChange(fn: ((c: Cube) => Cube)) {
  expect(eqCube(testCube, fn(testCube))).toBe(true);
}

test('cube equality', () => {
  expect(eqCube(defaultCube, defaultCube)).toBe(true);
  expect(eqCube(defaultCube, testCube)).toBe(false);
});

test('move 4 times result in same cube', () => {
  [Move.U, Move.U_, Move.R, Move.R_, Move.L, Move.L_,
   Move.F, Move.F_, Move.D, Move.D_, Move.B, Move.B_,
   Move.X, Move.X_, Move.Y, Move.Y_, Move.Z, Move.Z_
  ].forEach(m => {
    const move4 = move(m, m, m, m);
    expectNoChange(move4);
  });
});

test('moving *_ after * results same cube', () => {
  [[Move.U, Move.U_], [Move.R, Move.R_], [Move.L, Move.L_],
   [Move.F, Move.F_], [Move.D, Move.D_], [Move.B, Move.B_],
   [Move.X, Move.X_], [Move.Y, Move.Y_], [Move.Z, Move.Z_]
  ].forEach(([normalM, primeM]) => {
    expectNoChange(move(normalM, primeM));
    expectNoChange(move(primeM, normalM));
  });
});

test('moving R-pattern 6 times results same cube', () => {
  const rpattern = [Move.R, Move.U, Move.R_, Move.U_];
  const rpattern2 = rpattern.concat(rpattern);
  const rpattern6 = rpattern2.concat(rpattern2).concat(rpattern2);
  expectNoChange(move.apply(rpattern6));
});