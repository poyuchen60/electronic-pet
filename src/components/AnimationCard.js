import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  constainer: {
    border: '1px solid black'
  },
  frames: {
    position: 'relative',
    '& img': {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    },
    '& img:first-child': {
      position: 'static',
    },
    '& .shown': {
      opacity: 1
    }
  }
})

class AnimationCard extends Component {

  constructor(props) {
    super(props);
    this.constainer = React.createRef();
    this.timer = undefined;
    this.state = {
      ready: false,
      currentFrame: 0,
    }
  }

  componentDidMount = () => {
    const constainer = this.constainer.current;
    const imgs = constainer.getElementsByTagName('img');
    Promise.all(Array.prototype.map.call( imgs, img => new Promise( (resolve,reject) => {
      img.onload = () => resolve();
    })))
      .then( this.setState({ready: true}, this.animate));
  }

  componentWillUnmount = () => this.timer && clearInterval(this.timer);

  animate = () => {
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      const { currentFrame } = this.state;
      const { frames } = this.props;
      frames.length > 0
        && this.setState({ currentFrame: (currentFrame + 1) % frames.length });
    }, 125);
  }

  render() {
    const { classes, name, description, images, frames, onEdit, updating } = this.props;
    const { currentFrame } = this.state;
    return <div className={classes.constainer} ref={this.constainer}>
      <Typography variant="h5" color="inherit" noWrap>
        { name }
      </Typography>
      <Typography variant="h5" color="inherit" noWrap>
        { description }
      </Typography>
      <button onClick={onEdit} >{'編輯'}</button>
      <div className={classes.frames}>
      {
        Object.entries(images).map( ([id, filename]) =>
          <img
            key={id}
            alt='animation-frames'
            src={`http://localhost:8000/public/${filename}`}
            className={ id === frames[currentFrame] ? 'shown' : undefined }
          />
        )
      }
      </div>
      { updating && <p>Updating....</p> }
    </div>
  }
}


export default withStyles(styles)(AnimationCard);
