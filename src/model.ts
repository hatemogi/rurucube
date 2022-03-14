enum Color {
  W, Y, B, G, R, O, VOID
}

type Cell = {
  up: Color,
  down: Color,
  left: Color,
  right: Color,
  front: Color,
  back: Color
}

const voidCell: Cell = {
  up: Color.VOID, down: Color.VOID,
  left: Color.VOID, right: Color.VOID,
  front: Color.VOID, back: Color.VOID
};

type Layer = [Cell, Cell, Cell,
              Cell, Cell, Cell,
              Cell, Cell, Cell];

type Cube = [Layer, Layer, Layer];

const defaultLayer0: Layer = [
  { ...voidCell, front: Color.B, left: Color.R, down: Color.Y },
  { ...voidCell, front: Color.B, down: Color.Y },
  { ...voidCell, front: Color.B, right: Color.O, down: Color.Y },

  { ...voidCell, left: Color.R, down: Color.Y },
  { ...voidCell, down: Color.Y },
  { ...voidCell, right: Color.O, down: Color.Y },

  { ...voidCell, back: Color.G, left: Color.R, down: Color.Y },
  { ...voidCell, back: Color.G, down: Color.Y },
  { ...voidCell, back: Color.G, right: Color.O, down: Color.Y }
];

const defaultLayer1: Layer = [
  { ...voidCell, front: Color.B, left: Color.R, },
  { ...voidCell, front: Color.B },
  { ...voidCell, front: Color.B, right: Color.O },

  { ...voidCell, left: Color.R },
  { ...voidCell },
  { ...voidCell, right: Color.O },

  { ...voidCell, back: Color.G, left: Color.R },
  { ...voidCell, back: Color.G },
  { ...voidCell, back: Color.G, right: Color.O }
];

const defaultLayer2: Layer = [
  { ...voidCell, front: Color.B, left: Color.R, up: Color.W },
  { ...voidCell, front: Color.B, up: Color.W },
  { ...voidCell, front: Color.B, right: Color.O, up: Color.W },

  { ...voidCell, left: Color.R, up: Color.W },
  { ...voidCell, up: Color.W },
  { ...voidCell, right: Color.O, up: Color.W },

  { ...voidCell, back: Color.G, left: Color.R, up: Color.W },
  { ...voidCell, back: Color.G, up: Color.W },
  { ...voidCell, back: Color.G, right: Color.O, up: Color.W }
];


const defaultCube: Cube = [
  defaultLayer0,
  defaultLayer1,
  defaultLayer2
];

export { Color, Cell, Layer, Cube, defaultCube };