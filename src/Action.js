import Animation from './Animation';
import State from './State';


class Action {
  constructor(state, animation, conditions, decline){
    this.conditions = conditions;
    this.state = state;
    this.lasttime = 0;
    this.animation = Animation.create(animation);
    this.image = this.animation.update(0);
    this.decline = decline;
  }

  check = () => {
    let found = undefined;
    const withLasttime = {...this.state, lasttime: this.lasttime };
    this.conditions.some(
      c => found = c(withLasttime)
    )
    return found;
  }

  progress = (timestep) => {
    this.image = this.animation.update(timestep);
    let next = undefined;
    while(timestep){
      const step = timestep > 100 ? 100 : timestep;
      timestep -= step;
      this.lasttime += step;
      this.state.plus(State.multiply(this.decline, step / 1000));
      next = this.check();
      if(next)
        break;
    }
    return next ? next(this.state).progress(timestep) : this;
  }
}

export default Action;