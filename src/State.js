class State {
  constructor(food, energy, happiness){
    this.food = food;
    this.energy = energy;
    this.happiness = happiness;
  }

  static multiply = (state, factor) => {
    const { food, energy, happiness } = state;
    return new State(
      food * factor,
      energy * factor,
      happiness * factor
    );
  }

  
  plus = (state) => {
    const { food, energy, happiness } = state;
    this.food += food;
    this.energy += energy;
    this.happiness += happiness;
    return this;
  }
}

export default State;