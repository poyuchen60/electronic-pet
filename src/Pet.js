import Action from './Action';
import State from './State';
import { Timer } from './Animation';

const Movement = (speed) => {
  const timer = Timer(speed);
  const update = (timestep) => {
    timestep = Math.min(timestep, 100);
    return timer.update(timestep);
  }
  return {
    update
  }
}



const actionBuilder = (animation, conditions, decline) => {
  return (state) => new Action(state, animation, conditions, decline);
}

const create = (animations) => {
  // const actions = Object.entries(animations).reduce( (accu, a) => {
  //   accu[a[0]] = actionBuilder(a[1], [], new State(-20, 0, 0));
  //   return accu;
  // }, {});
  const actions = {};
  const full = (state) => {
    return state.food > 0 ? actions['running'] : undefined;
  }
  const isHungry = (state) => {
    return state.food <= 0 ? actions['starving'] : undefined;
  }

  actions.running = actionBuilder(animations['running'], [isHungry], new State(-20, 0, 0))
  actions.starving = actionBuilder(animations['starving'], [full], new State(-1, 0, 0))

  
  
  let currentAction = actions['running'](new State(100, 100, 100));
  let movement = Movement(40), lasttime;

  const update = (time) => {
    let timestep = lasttime ? (time - lasttime) : 0;
    let state = currentAction.state;
    lasttime = time;
    currentAction = currentAction.progress(timestep);
    return {
      image: currentAction.image,
      movement: state.food < 0 ? 0 : movement.update(timestep)
    }
  }
  const load = (timestep) => {
    currentAction = currentAction.progress(timestep);
  }

  const feed = () => {
    currentAction.state.food += 100;
  }
  
  const state = () => ({
    ...currentAction.state
  })

  return {
    update,
    feed,
    state,
    load
  }
}

export default {
  create
}