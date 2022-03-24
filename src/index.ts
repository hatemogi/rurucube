import * as M from './model';
import * as V from './view';

const commandHistory: M.Move[] = [];

type FrameTime = number;
type AnimationCommand = {
  startAt: FrameTime;
  endAt: FrameTime;
  processedUntil: FrameTime;
  onTime: (t: FrameTime, animation: AnimationCommand) => void;
  onFinish: (t: FrameTime) => void;
}

const animationQueue: AnimationCommand[] = [];

var cube: M.Cube = V.initCubes(M.defaultCube);

function move(m: M.Move) {
  commandHistory.push(m);
  console.log("history", commandHistory);
  animationQueue.push({
    startAt: 0,
    processedUntil: 0,
    endAt: 0,
    onTime: (t, animation) => {
      const dt = t - animation.processedUntil;
      const duration = animation.endAt - animation.startAt;
      V.rotate(m, dt / duration);
    },
    onFinish: t => {
      cube = V.resetCubes(M.move(m)(cube));
    }
  });
}

function doAnimation(t: FrameTime) {
  const duration = 300; // in milliseconds
  if (animationQueue.length > 0) {
    const animation = animationQueue[0];
    if (animation.startAt <= 0) {
      // not started yet
      animation.startAt = t;
      animation.processedUntil = t;
      animation.endAt = t + (duration / (animationQueue.length * animationQueue.length));
    } else if (t <= animation.endAt) {
      // should be during animation
      animation.onTime(t, animation);
      animation.processedUntil = t;
    } else {
      // finished
      animation.onFinish(t);
      animationQueue.shift();
    }
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
    case "Space": V.setCameraPosition(); break;
    case "Escape": cube = V.resetCubes(M.defaultCube); break;
  }
  return '';
};

V.setCameraPosition();

function animate(time: number) {
  requestAnimationFrame(animate);
  doAnimation(time);
  V.render();
}

requestAnimationFrame(animate);
