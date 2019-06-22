import React, { Component } from 'react';

class ScalableCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate = (prevProps) => {
    const { scale, img } = prevProps;
    this.props.img
      && (scale !== this.props.scale || img !== this.props.img)
      && this.draw();

    !this.props.img
      && img
      && this.clear();
  }

  componentDidMount = () => {
    this.props.img && this.draw();
  }

  draw = () => {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    const { width, height, colors, sortedPixels } = this.props.img;
    const { scale, reverse } = this.props;
    canvas.width = width * (scale + 1) - 1;
    canvas.height = height * (scale + 1) - 1;

    sortedPixels.forEach( (ary,index) => {
      if(!ary) return;
      ctx.fillStyle = colors[index];
      ary.forEach( i => {
        const x = reverse
          ? width - (i % width)
          : i % width
        const y = Math.trunc(i / width);
        ctx.fillRect (x * (scale + 1), y * (scale + 1), scale, scale);
      })
    })
  }

  clear = () => {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
  }

  render() {
    return <canvas
      className={this.props.className}
      style={this.props.style}
      ref={this.canvas}
    ></canvas>
  }
}

export default ScalableCanvas;