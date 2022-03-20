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
  const moveU4 = move(Move.U, Move.U, Move.U, Move.U);
  const moveR4 = move(Move.R, Move.R, Move.R, Move.R);
  const moveL4 = move(Move.L, Move.L, Move.L, Move.L);
  const moveF4 = move(Move.F, Move.F, Move.F, Move.F);
  const moveY4 = move(Move.Y, Move.Y, Move.Y, Move.Y);
  expectNoChange(moveU4);
  expectNoChange(moveR4);
  expectNoChange(moveL4);
  expectNoChange(moveF4);
  expectNoChange(moveY4);
});

test('moving *_ after * results same cube', () => {
  expectNoChange(move(Move.U, Move.U_));
  expectNoChange(move(Move.U_, Move.U));
  expectNoChange(move(Move.R, Move.R_));
  expectNoChange(move(Move.R_, Move.R));
  expectNoChange(move(Move.L, Move.L_));
  expectNoChange(move(Move.L_, Move.L));
  expectNoChange(move(Move.F, Move.F_));
  expectNoChange(move(Move.F_, Move.F));
  expectNoChange(move(Move.D, Move.D_));
  expectNoChange(move(Move.D_, Move.D));
  expectNoChange(move(Move.Y_, Move.Y));
});

test('moving R-pattern 6 times results same cube', () => {
  const rpattern = [Move.R, Move.U, Move.R_, Move.U_];
  const rpattern2 = rpattern.concat(rpattern);
  const rpattern6 = rpattern2.concat(rpattern2).concat(rpattern2);
  expectNoChange(move.apply(rpattern6));
});