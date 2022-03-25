import * as M from './model';
import * as V from './view';

type FrameTime = number;
type AnimationCommand = {
  startAt: FrameTime;
  endAt: FrameTime;
  processedUntil: FrameTime;
  onTime: (v: V.View, t: FrameTime, animation: AnimationCommand) => V.View;
  onFinish: (v: V.View, t: FrameTime) => V.View;
}

const animationQueue: AnimationCommand[] = [];

function doAnimation(view: V.View, t: FrameTime): V.View {
  const duration = 300; // in milliseconds
  var newView = view;
  if (animationQueue.length > 0) {
    const animation = animationQueue[0];
    if (animation.startAt <= 0) {
      // not started yet
      animation.startAt = t;
      animation.processedUntil = t;
      animation.endAt = t + (duration / (animationQueue.length * animationQueue.length));
    } else if (t <= animation.endAt) {
      // should be during animation
      newView = animation.onTime(view, t, animation);
      animation.processedUntil = t;
    } else {
      // finished
      newView = animation.onFinish(view, t);
      animationQueue.shift();
    }
  }
  return newView;
}

function request(v: V.View, m: M.Move) {
  animationQueue.push({
    startAt: 0,
    processedUntil: 0,
    endAt: 0,
    onTime: (view, t, animation) => {
      const dt = t - animation.processedUntil;
      const duration = animation.endAt - animation.startAt;
      return V.rotate(view, m, dt / duration);
    },
    onFinish: (view, t) => V.resetCubes(view, M.move(m)(view.cube))
  });
}

export { doAnimation, request }