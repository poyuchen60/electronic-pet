import React, { Component } from 'react';
import ScalableCanvas from './ScalableCanvas';
import Pet from '../Pet';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    position: 'relative',
    '& .player': {
      position: 'absolute',
      top: '140px',

    },
    '& button': {
      position: 'relative',
    }
  }
}


const background = {
  width: 200,
  height: 55,
  colors: ['rgba(255,233,233,1)'],
  sortedPixels: [[...new Array(200 * 55).keys()]]
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.pet = undefined;
    this.state = {
      image: undefined,
      direction: -1,
      currentPosition: 100,
      food: 0,
    }
  }


  componentDidMount = async () => {
    const actions = await fetch('http://192.168.8.101:8000/public/test.txt')
      .then(res => res.json());

    const pet = Pet.create({
      'running': actions.running,
      'starving': actions.starving
    })
    this.pet = pet;
    requestAnimationFrame(this.animate);
  }

  animate = (time) => {
    const { pet } = this;
    let { currentPosition, direction } = this.state;
    const { image, movement } = pet.update(time)

    currentPosition += movement * direction;
    if(currentPosition <= 19 && direction === -1){
      currentPosition = 20;
      direction = 1;
    }
    if(currentPosition >= 181 && direction === 1){
      currentPosition = 180;
      direction = -1;
    }
    this.setState({image, currentPosition, direction, food: Math.trunc(pet.state().food) });
    requestAnimationFrame(this.animate);
  }
  feed = () => this.pet.feed();

  render() {
    const { classes } = this.props;
    const { image, currentPosition, direction, food } = this.state;
    return <div className={classes.container}>
      <div
        className="player"
        style={{left: `${(currentPosition - 20) * 7}px`}}>
        <ScalableCanvas
          scale={6}
          img={image}
          reverse={direction > 0}
        />
      </div>
      <ScalableCanvas scale={6} img={background} />
      <button onClick={this.feed}>{`Feed ${food}`}</button>
    </div>
  }
}


export default withStyles(styles)(Game);