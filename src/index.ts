import * as M from './model';
import * as V from './view';
import * as A from './animation';

const commandHistory: M.Move[] = [];

var view: V.View = V.initView(M.defaultCube, window);
document.body.appendChild(view.element);

function move(m: M.Move) {
  commandHistory.push(m);
  console.log("history", commandHistory);
  A.request(m);
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
  }
  return '';
};

function animate(time: number) {
  requestAnimationFrame(animate);
  V.render(view = A.doAnimation(view, time));
}

requestAnimationFrame(animate);
