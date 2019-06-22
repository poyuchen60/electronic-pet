const Timer = (speed) => {
  let time = 0
  const update = (timestep) => {
    time += timestep;
    const steps = Math.trunc(time / speed);
    time %= speed;
    return steps;
  }
  const reset = (newSpeed=speed) => {
    time = 0;
    speed = newSpeed;
  }
  return {
    update,
    reset
  }
}

const create = (animation) => {
  const { frames, images, speed } = animation;
  let currentFrame = 0, timer = Timer(speed);

  const update = (timestep) => {
    timestep = Math.min(timestep, 100);
    currentFrame = (currentFrame + timer.update(timestep)) % frames.length;
    return images[frames[currentFrame]];
  }

  const reset = () => {
    currentFrame = 0;
    timer.reset();
  }

  return {
    update,
    reset
  }
}

export default {
  create
}

export {
  Timer
}