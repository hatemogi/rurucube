import { Cube, eqCube, defaultCube, move, Move } from '../src/model';

test('cube equality', () => {
  expect(eqCube(defaultCube, defaultCube)).toBe(true);
});

test('move 4 times result in same cube', () => {
  const moveU = move(Move.U);
  const moveU4 = (cube: Cube) => moveU(moveU(moveU(moveU(cube))));
  expect(eqCube(defaultCube, moveU(defaultCube))).toBe(false);
  expect(eqCube(defaultCube, moveU4(defaultCube))).toBe(true);
});