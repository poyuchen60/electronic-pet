import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    '& .border': {
      position: 'absolute',
      boxSizing: 'border-box',
      zIndex: 20
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
      borderBottom: '1px solid red'
    },
    '& .bottom': {
      bottom: '-10px',
      borderTop: '1px solid red'
    },
    '& .left': {
      left: '-10px',
      borderRight: '1px solid red'
    },
    '& .right': {
      right: '-10px',
      borderLeft: '1px solid red'
    }
  }
}

class FunctionalBorder extends Component {

  render() {
    const { 
      classes, style,
      right, top, left, bottom
    } = this.props;

    return <div className={classes.container} style={style} >
      <div
        className='border horizental top'
        onMouseDown={top}
      ></div>
      <div
        className='border horizental bottom'
        onMouseDown={bottom}
      ></div>
      <div
        className='border vertical left'
        onMouseDown={left}
      ></div>
      <div
        className='border vertical right'
        onMouseDown={right}
      ></div>
    </div>
  }
}

export default withStyles(styles)(FunctionalBorder);