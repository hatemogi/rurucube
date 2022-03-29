import * as M from './model';
import * as V from './view';
import { animationRequest, doAnimation } from './animation';

const commandHistory: M.Move[] = [];

var view: V.View = V.initView(M.defaultCube, window);
document.body.appendChild(view.element);

function move(m: M.Move) {
  commandHistory.push(m);
  console.log("history", commandHistory);
  animationRequest(m);
}

function shuffleCubeRequest() {
  const m = M.allMoves;
  for (var i = 0; i < 10; i++) {
    const randomMove = m[Math.floor(Math.random() * m.length)];
    move(randomMove);
  }
}

window.onkeydown = (ev: KeyboardEvent) => {
  console.log('keydown', ev.code, ev.shiftKey, ev.timeStamp);
  const S = M.Slice;
  const prime = ev.shiftKey;
  const moveSlice = (slice: M.Slice) => move({ slice, prime });
  switch (ev.code) {
    case "KeyU": moveSlice(S.U); break;
    case "KeyL": moveSlice(S.L); break;
    case "KeyR": moveSlice(S.R); break;
    case "KeyF": moveSlice(S.F); break;
    case "KeyB": moveSlice(S.B); break;
    case "KeyD": moveSlice(S.D); break;
    case "KeyX": moveSlice(S.X); break;
    case "KeyY": moveSlice(S.Y); break;
    case "KeyZ": moveSlice(S.Z); break;
    case "Space": V.resetCameraPosition(view); break;
    case "Escape": view = V.resetCubes(view, M.defaultCube); break;
    case "Enter": shuffleCubeRequest(); break;
  }
  return '';
};

function animate(time: number) {
  requestAnimationFrame(animate);
  V.render(view = doAnimation(view, time));
}

requestAnimationFrame(animate);
