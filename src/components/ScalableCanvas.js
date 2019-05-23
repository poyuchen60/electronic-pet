import React, { Component } from 'react';


const indicatorStyle = ({
  position: 'absolute',
  top: 0,
  left: 0
})

class ScalableCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.indicator = React.createRef();
  }

  componentDidUpdate = (prevProps) => {
    const { scale, img, indicator } = prevProps;
    this.props.img
      && (scale !== this.props.scale || img !== this.props.img)
      && this.draw();

    this.props.indicator
      && indicator !== this.props.indicator
      && this.drawIndicator();

    !this.props.indicator
      && indicator
      && this.clearIndicator();
  }

  draw = () => {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    const { width, height, colors, sortedPixels } = this.props.img;
    const { scale } = this.props;
    canvas.width = width * (scale + 1) - 1;
    canvas.height = height * (scale + 1) - 1;

    sortedPixels.forEach( (ary,index) => {
      if(!ary) return;
      ctx.fillStyle = colors[index];
      ary.forEach( i => {
        const x = i % width, y = Math.trunc(i / width);
        ctx.fillRect (x * (scale + 1), y * (scale + 1), scale, scale);
      })
    })
  }
  drawIndicator = () => {
    const { index, color } = this.props.indicator;
    const canvas = this.indicator.current;
    const ctx = canvas.getContext("2d");
    const { width, height, sortedPixels } = this.props.img;
    const { scale } = this.props;
    canvas.width = width * (scale + 1) - 1;
    canvas.height = height * (scale + 1) - 1;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    sortedPixels[index].forEach( i => {
      const x = i % width, y = Math.trunc(i / width);
      ctx.fillRect (x * (scale + 1), y * (scale + 1), scale, scale);
    })
    ctx.fillStyle = color;
    sortedPixels[index].forEach( i => {
      const x = i % width, y = Math.trunc(i / width);
      ctx.fillRect (x * (scale + 1), y * (scale + 1), scale, scale);
    })
  }
  clearIndicator = () => {
    const canvas = this.indicator.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
  }

  render() {
    return <div style={{position: 'relative'}}>
      <canvas
        width='1px'
        height='1px'
        id='indicator'
        ref={this.indicator}
        style={indicatorStyle}
      ></canvas>
      <canvas
        id='canvas'
        ref={this.canvas}
        // style={{border: '1px solid gray'}}
      ></canvas>
    </div>
  }
}

export default ScalableCanvas;