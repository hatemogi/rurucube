module Model exposing (..)

import Array exposing (Array, repeat, slice, append)

type FaceColor
  = White
  | Yellow
  | Blue
  | Green
  | Red
  | Orange
  | NoColor

type alias Face = Array FaceColor

type alias Cube =
  { front : Face
  , back  : Face
  , left  : Face
  , right : Face
  , up    : Face
  , down  : Face
  }

defaultCube : Cube
defaultCube =
  { front = repeat 9 Blue
  , back  = repeat 9 Green
  , up    = repeat 9 White
  , down  = repeat 9 Yellow
  , left  = repeat 9 Red
  , right = repeat 9 Orange
  }

type Move
  = U | U_
  | D | D_
  | L | L_
  | R | R_
  | F | F_
  | B | B_
  | X | X_
  | Y | Y_
  | Z | Z_

moveU : Cube -> Cube
moveU { front, back, up, down, left, right} =
  { front = append (slice 0 6 front) (slice 6 9 right)
  , back = back
  , up = up
  , down = down
  , left = left
  , right = right
  }

move : Move -> Cube -> Cube
move m = case m of
  U -> moveU
  _ -> moveU




