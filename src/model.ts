enum FaceColor {
  WHITE, YELLOW, BLUE, GREEN, RED, ORANGE
};

type Face = [ FaceColor, FaceColor, FaceColor,
              FaceColor, FaceColor, FaceColor,
              FaceColor, FaceColor, FaceColor ];

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

export { FaceColor, Face, Cube, defaultCube };