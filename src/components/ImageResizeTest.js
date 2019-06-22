import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    '& .inner': {
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.1)',
      
      outline: '9999px solid rgba(0, 0, 0, 0.5)'
    },
    '& .border': {
      position: 'absolute',
    },
    '& .border.horizental': {
      width: 'calc(100% + 2px)',
      left: '-1px',
      height: '10px',
    },
    '& .border.horizental:hover': {
      backgroundColor: 'rgba(0,0,255,0.3)',
      cursor: 's-resize',
    },
    '& .border.vertical': {
      height: 'calc(100% + 2px)',
      top: '-1px',
      width: '10px',
    },
    '& .border.vertical:hover': {
      backgroundColor: 'rgba(0,255,0,0.3)',
      cursor: 'w-resize'
    },
    '& .top': {
      top: '-10px',
    },
    '& .bottom': {
      bottom: '-10px',
    },
    '& .left': {
      left: '-10px',
    },
    '& .right': {
      right: '-10px',
    }
  },
}

class ImageResize extends Component {

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      top: 50,
      left: 50,
      width: 500,
      height: 500,
      handler: undefined
    }
  }

  resizeTop = (e) => {
    const { pageY } = e;
    const { offsetTop } = this.container.current;
    const { height, top } = this.state;
    let newTop = Math.max(pageY - offsetTop, 0);
    newTop = Math.min(newTop, top + height);
    const newHeight = height + top - newTop;
    this.setState({top: newTop, height: newHeight })
  }
  resizeBottom = (e) => {
    const { pageY } = e;
    const { top } = this.state;
    const height = pageY - top;
    height >= 0 && this.setState({height});
  }
  resizeLeft = (e) => {
    const { pageX } = e;
    const { offsetLeft } = this.container.current;
    const { width, left } = this.state;
    let newLeft = Math.max(pageX - offsetLeft, 0);
    newLeft = Math.min(newLeft, width + left);
    const newWidth = Math.max(width + left - newLeft, 0);
    this.setState({left: newLeft, width: newWidth});
  }
  resizeRight = (e) => {
    const { pageX } = e;
    const { left } = this.state;
    const width = pageX - left;
    width >= 0 && this.setState({width});
  }

  componentDidMount = () => {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (e) => {
    const { handler } = this.state;
    const { buttons } = e;
    if(!handler) return;
    buttons === 0
      ? this.setState({handler: undefined})
      : handler(e)
  }

  handleMouseDown = (f) => (e) => {
    e.preventDefault();
    this.setState({handler: f});
  }
  handleMouseUp = () => {
    this.setState({handler: undefined});
  }

  render() {
    const { classes } = this.props;
    const { top, left, width, height } = this.state;
    const {
      handleMouseDown,
      resizeTop, resizeBottom, resizeLeft, resizeRight
    } = this;
    const style = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`
    }
    return <div
      ref={this.container}
      className={classes.container}
    >
      <div
        style={style}
        className='inner'
      >
        <div
          className='border horizental top'
          onMouseDown={handleMouseDown(resizeTop)}
        ></div>
        <div
          className='border horizental bottom'
          onMouseDown={handleMouseDown(resizeBottom)}
        ></div>
        <div
          className='border vertical left'
          onMouseDown={handleMouseDown(resizeLeft)}
        ></div>
        <div
          className='border vertical right'
          onMouseDown={handleMouseDown(resizeRight)}
        ></div>
      </div>
    </div>
  }
}


export default withStyles(styles)(ImageResize);