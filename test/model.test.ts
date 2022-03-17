import { Cube, eqCube, defaultCube, move, Move } from '../src/model';

test('cube equality', () => {
  expect(eqCube(defaultCube, defaultCube)).toBe(true);
});

test('move 4 times result in same cube', () => {
  const moveU = move(Move.U);
  const moveR = move(Move.R);
  const moveU4 = (cube: Cube) => moveU(moveU(moveU(moveU(cube))));
  const moveR4 = (cube: Cube) => moveR(moveR(moveR(moveR(cube))));
  expect(eqCube(defaultCube, moveU(defaultCube))).toBe(false);
  expect(eqCube(defaultCube, moveU4(defaultCube))).toBe(true);
  expect(eqCube(defaultCube, moveR4(defaultCube))).toBe(true);
});

test('moving R_ after R results same cube', () => {
  const moveRR_ = (cube: Cube) => move(Move.R_)((move(Move.R)(cube)));
  expect(eqCube(defaultCube, moveRR_(defaultCube))).toBe(true);
});