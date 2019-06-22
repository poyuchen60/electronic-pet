import React, { Component } from 'react';
import PNGParser from '../PNGParser';
import ScalableCanvas from './ScalableCanvas';
import ImageList from './ImageList';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  container: {
    display: 'grid',
    gridTemplateColumns: '330px 1fr',
    gridTemplateRows: '60px 380px',
  },
  inputWrapper: {
    display: 'flex',
    gridColumn: 'span 2',
    '& .text': {
      width: '150px',
      marginLeft: '30px',
    },
    '& .text:first-child': {
      marginLeft: 0
    }
  },
  buttons: {
    padding: '5px 0',
    display: 'flex',
    gridColumn: 'span 2',
    '& button': {
      width: '80px',
      padding: '3px 0',
      margin: '0 5px',
    }
  },
  canvasWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    '& .canvas':{
      border: '1px solid #eaeaea'
    }
  },
  player: {
    display: 'flex',
    flexDirection: 'column',
  },
  frames: {
    display: 'flex',
    alignItems: 'flex-end',
    overflowX: 'auto',
    '& img': {
      border: '1px solid white',
      cursor: 'pointer'
    },
    '& img.current': {
      borderColor: 'red'
    }
  },
  operators: {
    alignItems: 'flex-end',
    display: 'flex',
    '& .button': {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    '& .button:hover': {
      color: 'red'
    },
    '& .frameOperators': {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end'
    }
  }
})

const imageFetchAndParse = (id, filename) => {
  return new Promise( async (resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      PNGParser.parse(fileReader.result)
        .then( img => resolve([id, img]) )
    }
    fetch(`http://192.168.8.101:8000/public/${filename}`)
      .then(res => {
        if(res.status === 404){
          throw new Error('not found');
        } else {
          return res.blob()
        }
      })
      .then(blob => fileReader.readAsArrayBuffer(blob))
      .catch(e => resolve([id, undefined]));
  })
}

class AnimationEditor extends Component {

  constructor(props) {
    super(props);
    const { id, name, description, frames, images } = props.animation;
    this.timer = undefined;
    this.state = {
      imgs: {},
      currentFrame: 0,
      id, name, description,
      frames: frames.slice(),
      images: { ...images },
      isPlaying: true
    }
  }

  componentDidMount = () => {
    const { images } = this.state;
    Promise.all(Object.entries(images).map(
      ([id, filename]) => imageFetchAndParse(id, filename)
    ))
      .then( array => {
        const { imgs } = this.state;
        array.forEach( ([key, img]) => (imgs[key] = img))
        this.setState({imgs}, () => {
          this.timer = setInterval( () => {
            const { currentFrame, frames, isPlaying } = this.state;
            isPlaying
              && frames
              && frames.length > 0
              && this.setState({ currentFrame: (currentFrame + 1) % frames.length });
          }, 125)
        });
      })
  }

  componentWillUnmount = () => this.timer && clearInterval(this.timer);

  animate = () => {
    !this.state.isPlaying
      && this.state.frames.length > 0
      && this.setState({isPlaying: true});
  }

  stop = () => {
    this.state.isPlaying && this.setState({isPlaying: false});
  }

  update = (id, filename) => () => {
    console.log('updating', id);
    imageFetchAndParse(id, filename).then( ([key, img]) => {
      const { imgs } = this.state;
      this.setState({imgs: { ...imgs, [key]: img }});
    })
  }

  handleFrameMoveForward = () => {
    const { currentFrame, frames } = this.state;
    if(currentFrame === 0) return;
    const current = frames[currentFrame], swap = frames[currentFrame - 1];
    const newFrames = frames.slice();
    newFrames[currentFrame] = swap;
    newFrames[currentFrame - 1] = current;
    this.setState({frames: newFrames, currentFrame: currentFrame - 1});
  }
  handleFrameMoveBack = () => {
    const { currentFrame, frames } = this.state;
    if(currentFrame === (frames.length - 1)) return;
    const current = frames[currentFrame], swap = frames[currentFrame + 1];
    const newFrames = frames.slice();
    newFrames[currentFrame] = swap;
    newFrames[currentFrame + 1] = current;
    this.setState({frames: newFrames, currentFrame: currentFrame + 1});
  }
  handleFrameRemove = () => {
    const { currentFrame, frames } = this.state;
    const newFrames = frames.slice();
    newFrames.splice(currentFrame, 1);
    this.setState({
      frames: newFrames,
      currentFrame: currentFrame === newFrames.length
        ? currentFrame - 1 : currentFrame
    })
  }

  handleFrameClick = (index) => () => {
    this.setState({isPlaying: false, currentFrame: index});
  }

  handleFrameAdd = (id, filename) => () => {
    let { images, frames, imgs } = this.state;
    const callback = imgs[id] ? undefined : this.update(id, filename)
    images = { ...images, [id]: filename };
    frames = [ ...frames, String(id) ];
    this.setState({images, frames}, callback);
  }

  handleAnimationSubmit = () => {
    const { onClose } = this.props;
    const { name, description, frames } = this.state;
    onClose({ name, description, frames });
  }

  handleInputChange = (property) => (event) => {
    this.setState({[property]: event.target.value})
  }

  render() {
    const {
      name, description,
      imgs, currentFrame, frames, images, isPlaying
    } = this.state;
    const { classes, onClose } = this.props;
    const {
      handleFrameClick,
      animate,
      stop,
      handleFrameAdd,
      handleAnimationSubmit,
      handleFrameMoveForward,
      handleFrameMoveBack,
      handleFrameRemove,
      handleInputChange
    } = this;
    return <div className={classes.container}>
      <div className={classes.inputWrapper}>
        <TextField
          label="Name"
          className='text'
          value={name}
          onChange={handleInputChange('name')}
          margin="normal"
        />
        <TextField
          label="Description"
          className='text'
          value={description}
          onChange={handleInputChange('description')}
          margin="normal"
        />
      </div>
      <div className={classes.player}>
        <div className={classes.canvasWrapper}>
          <ScalableCanvas
            img={ frames && imgs[frames[currentFrame]] }
            scale={6}
            className='canvas'
          />
        </div>
        <div className={classes.operators}>
          <div className='button' onClick={animate}><PlayIcon /></div>
          <div className='button' onClick={stop}><PauseIcon /></div>

          { !isPlaying && <div className='frameOperators'>
            <div
              className='button'
              onClick={handleFrameMoveForward}
            ><LeftIcon /></div>
            <div
              className='button'
              onClick={handleFrameMoveBack}
            ><RightIcon /></div>
            <div
              className='button'
              onClick={handleFrameRemove}
            ><DeleteIcon /></div>
          </div> }
        </div>
        <div className={classes.frames}>
          { frames && frames.map( (f,i) =>
              <img
                key={i}
                alt={`frame#${i}`}
                src={`http://localhost:8000/public/${images[f]}`}
                className={ currentFrame === i ? 'current' : undefined }
                onClick={handleFrameClick(i)}
              />
            )
          }
        </div>
      </div>
      <ImageList onClick={handleFrameAdd} />
      <div className={classes.buttons}>
        <Button
          onClick={handleAnimationSubmit}
          className='button'
        >
          確定
        </Button>
        <Button onClick={() => onClose()} className='button'>取消</Button>
      </div>
    </div>
  }
}


export default withStyles(styles)(AnimationEditor);
export {
  imageFetchAndParse
}