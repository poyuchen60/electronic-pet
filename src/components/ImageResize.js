import React, { Component } from 'react';
import ScalableCanvas from './ScalableCanvas';
import FunctionalBorder from './FunctionalBorder';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    position: 'relative',
    width: '365px',
    height: '365px',
    overflow: 'hidden',
    margin: '10px'
  },
  frame: {
    position: 'absolute',
    outline: '9999px solid rgba(0,0,0,0.3)'
  },
  relative: {
    position: 'relative',
    top: '3px',
    left: '3px'
  }
}

class ImageResize extends Component {
  constructor(props) {
    super(props);
    const { img } = this.props;
    this.container = React.createRef();
    this.state = {
      img: img,
      width: img.width,
      height: img.height,
      position: {
        x: Math.trunc((60 - img.width) / 2),
        y: Math.trunc((60 - img.height) / 2)
      },
      imgPosition: {
        x: Math.trunc((60 - img.width) / 2),
        y: Math.trunc((60 - img.height) / 2)
      },
      handler: undefined
    }
  }

  componentDidMount = () => {
    // const imgBlob = await fetch('http://localhost:8000/public/img-1558516662987.png')
    //   .then(res => res.blob());
    // const fileReader = new FileReader();
    // fileReader.onload = () => {
    //   PNGParser.parse(fileReader.result)
    //     .then( img => this.setState({
    //       img, loading: false,
    //       width: img.width, height: img.height,
    //       position: {
    //         x: Math.trunc((60 - img.width) / 2),
    //         y: Math.trunc((60 - img.height) / 2)
    //       },
    //       imgPosition: {
    //         x: Math.trunc((60 - img.width) / 2),
    //         y: Math.trunc((60 - img.height) / 2)
    //       }
    //     }))
    // }
    // fileReader.readAsArrayBuffer(imgBlob);
    document.addEventListener('mousemove', this.handleMouseMove);
  }
  componentWillUnmount = () => 
    document.removeEventListener('mousemove', this.handleMouseMove)
  
  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { img, width, height, position, imgPosition } = this.state;
    const xMin = position.x, xMax = position.x + width - 1;
    const yMin = position.y, yMax = position.y + height - 1;
    const { width: imgWidth, colors, sortedPixels } = img;
    const newColors = colors.slice(0);
    const newPixels = new Array(width * height);
    const newSortedPixels = sortedPixels.map( (ary, i) => {
      return ary.map( index => ({
        x: index % imgWidth + imgPosition.x,
        y: Math.trunc(index / imgWidth) + imgPosition.y
      })).filter(({x, y}) =>
        x >= xMin && x <= xMax && y >= yMin && y <= yMax
      ).map(({x, y}) =>
        ({ x: x-position.x, y: y-position.y })
      ).map(({x, y}) => {
        const index = y * width + x;
        newPixels[index] = i;
        return index;
      })
    })
    let iColor = newColors.indexOf('rgba(255,255,255,0.00)');
    if(iColor < 0 ){
      iColor = newColors.length;
      newColors.push('rgba(255,255,255,0.00)');
      newSortedPixels.push([]);
    }
    for(let i = 0; i < width * height; i++){
      if(newPixels[i] === undefined){
        newPixels[i] = iColor;
        newSortedPixels[iColor].push(i);
      }
    }
    onSubmit({
      width, height,
      pixels: newPixels,
      colors: newColors,
      sortedPixels: newSortedPixels
    });
  }

  handleMouseMove = (e) => {
    const { handler } = this.state;
    const { buttons } = e;
    if(!handler) return;
    buttons === 0
      ? this.setState({handler: undefined})
      : handler(e)
  }


  handleMouseDown = handler => (e) => {
    e.preventDefault();
    this.setState({handler});
  }
  left = (e) => {
    const { clientX } = e;
    const { left } = this.container.current.getBoundingClientRect();
    const { position: {x, y}, width } = this.state;
    const delta = Math.round((clientX - (left + x * 6) + 1) / 6);
    let newX = x + delta;
    let newWidth = width - delta;
    newWidth > 0 && newX >= 0 && newX <= 60 && this.setState({
      width: newWidth,
      position: {x: newX, y}
    });
  }
  right = (e) => {
    const { clientX } = e;
    const { left } = this.container.current.getBoundingClientRect();
    const { position: {x} } = this.state;
    const width = Math.round((clientX - (left + x * 6) + 1) / 6);
    width > 0 && (width + x) <= 60 && this.setState({width});
  }
  top = (e) => {
    const { clientY } = e;
    const { top } = this.container.current.getBoundingClientRect();
    const { position: {x, y}, height } = this.state;
    const delta = Math.round((clientY - (top + y * 6) + 1) / 6);
    let newY = y + delta;
    let newHeight = height - delta;
    newHeight > 0 && newY >= 0 && newY <= 60 && this.setState({
      height: newHeight,
      position: {x, y: newY}
    });
  }
  bottom = (e) => {
    const { clientY } = e;
    const { top } = this.container.current.getBoundingClientRect();
    const { position: {y} } = this.state;
    const height = Math.round((clientY - (top + y * 6) + 1) / 6);
    height > 0 && (height + y) <= 60 && this.setState({height});
  }

  render() {
    const { classes, onSubmit } = this.props;
    const {
      img, imgPosition,
      height, width, position
    } = this.state;
    const { handleMouseDown, right, bottom, top, left, handleSubmit } = this;
    const style = img && {
      position: 'absolute',
      left: imgPosition.x * 6,
      top: imgPosition.y * 6,
    }
    const frameStyle = img && {
      left: position.x * 6,
      top: position.y * 6,
      width: width * 6 - 1,
      height: height * 6 -1
    }
    return <>
      <div className={classes.container} ref={this.container}>
        <div className={classes.relative}>
          <div className={classes.frame} style={frameStyle}>
            <FunctionalBorder
              right={handleMouseDown(right)}
              bottom={handleMouseDown(bottom)}
              left={handleMouseDown(left)}
              top={handleMouseDown(top)}
            />
          </div>
          <ScalableCanvas img={img} scale={5} style={style}/>
        </div>
      </div>
      <button onClick={handleSubmit}>確定</button>
      <button onClick={() => onSubmit()}>取消</button>
    </>
  }
}


export default withStyles(styles)(ImageResize);