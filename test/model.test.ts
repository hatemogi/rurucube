import { Cube, eqCube, defaultCube, move, Move, Slice, FaceColor, Face, oppositeColor, allMoves, allSlices } from '../src/model';

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

test('반대 색상', () => {
  expect(oppositeColor(W)).toBe(Y);
  expect(oppositeColor(Y)).toBe(W);
  expect(oppositeColor(G)).toBe(B);
  expect(oppositeColor(B)).toBe(G);
  expect(oppositeColor(R)).toBe(O);
  expect(oppositeColor(O)).toBe(R);
});

test('어떻게 이동해도 가운데 조각은 서로 반대색', () => {
  const expectOppositeColor = (given: FaceColor, expected: FaceColor) =>
    expect(oppositeColor(given)).toBe(expected);
  allMoves.forEach(m => {
    const {front, back, up, down, left, right} = move(m)(testCube);
    const center = 4;
    expectOppositeColor(front[center],  back[center]);
    expectOppositeColor( left[center], right[center]);
    expectOppositeColor(   up[center],  down[center]);
  });
});

test('어떻게 이동해도 한 색상은 9조각씩 있다', () => {
  allMoves.forEach(m => {
    const { front, back, up, down, left, right } = move(m)(testCube);
    const count = (color: FaceColor, face: Face) =>
      face.filter((c: FaceColor) => c == color).length;
    const countAll = (color: FaceColor) =>
      count(color, front) + count(color, back) +
      count(color, left)  + count(color, right) +
      count(color, up)    + count(color, down);
    [W, Y, R, O, B, G].forEach(color => expect(countAll(color)).toBe(9));
  });
});

test('같은 큐브 비교', () => {
  expect(eqCube(defaultCube, defaultCube)).toBe(true);
  expect(eqCube(defaultCube, testCube)).toBe(false);
});

test('같은 회전을 4번 하면 원래 상태로', () => {
  allMoves.forEach(m => expectNoChange(move(m, m, m, m)));
});

test('시계 방향 회전과 반시계 방향 회전을 둘 다 하면 원래 상태로', () => {
  allSlices.forEach(slice => {
    const clockwise: Move = { slice, prime: false };
    const counterclockwise: Move = { slice, prime: true };
    expectNoChange(move(clockwise, counterclockwise));
    expectNoChange(move(counterclockwise, clockwise));
  })
});

test("RUR'U' 패턴을 6번 하면 원래 상태로", () => {
  const rpattern = [
    {slice: Slice.R, prime: false},
    {slice: Slice.U, prime: false},
    {slice: Slice.R, prime: true},
    {slice: Slice.U, prime: true},
  ];
  const rpattern2 = rpattern.concat(rpattern);
  const rpattern6 = rpattern2.concat(rpattern2).concat(rpattern2);
  expectNoChange(move.apply(rpattern6));
});