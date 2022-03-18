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
  expectNoChange(moveU4);
  expectNoChange(moveR4);
});

test('moving *_ after * results same cube', () => {
  expectNoChange(move(Move.R, Move.R_));
  expectNoChange(move(Move.R_, Move.R));
  expectNoChange(move(Move.R, Move.R, Move.R_, Move.R_));
  expectNoChange(move(Move.L, Move.L_));
  expectNoChange(move(Move.L_, Move.L));
});