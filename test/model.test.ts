import { Cube, eqCube, defaultCube, move, Move } from '../src/model';

function expectCube(expected: Cube, actual: Cube) {
  expect(eqCube(expected, actual)).toBe(true);
}

function expectNoChange(fn: ((c: Cube) => Cube)) {
  expect(eqCube(defaultCube, fn(defaultCube))).toBe(true);
}

test('cube equality', () => {
  expect(eqCube(defaultCube, defaultCube)).toBe(true);
  expect(eqCube(defaultCube, move(Move.U)(defaultCube))).toBe(false);
});

test('move 4 times result in same cube', () => {
  const moveU4 = move(Move.U, Move.U, Move.U, Move.U);
  const moveR4 = move(Move.R, Move.R, Move.R, Move.R);
  const moveL4 = move(Move.L, Move.L, Move.L, Move.L);
  const moveF4 = move(Move.F, Move.F, Move.F, Move.F);
  expectNoChange(moveU4);
  expectNoChange(moveR4);
  expectNoChange(moveL4);
  expectNoChange(moveF4);
});

test('moving *_ after * results same cube', () => {
  expectNoChange(move(Move.R, Move.R_));
  expectNoChange(move(Move.R_, Move.R));
  expectNoChange(move(Move.R, Move.R, Move.R_, Move.R_));
  expectNoChange(move(Move.L, Move.L_));
  expectNoChange(move(Move.L_, Move.L));
  expectNoChange(move(Move.F, Move.F_));
  expectNoChange(move(Move.F_, Move.F));
  expectNoChange(move(Move.D, Move.D_));
  expectNoChange(move(Move.D_, Move.D));
});