class GameStateManager {
  constructor(states = [], currentStateName) {
    this.states = [...states]; 
    this.statesStack = [];

    if (currentStateName) {
      this.pushState(currentStateName);
    }
  }

  changeState(newState) {
    this.popState();
    this.pushState(newState);
  }

  pushState(stateName) {
    const state = this.getState(stateName);
    if (state.onStart) {
      state.onStart();
    }

    this.statesStack.push(state);
  }

  popState() {
    this.statesStack[this.statesStack.length - 1].onEnd();
    this.statesStack.pop();
  }

  update(delta) {
    this.currentState.update(delta);
  }

  getState(stateName) {
    const state = this.states.find(state => state.stateName === stateName);
  
    if (!state) {
      throw new Error(`State ${state} - not found.`);
    }
    
    return state;
  }
}

export default GameStateManager;
