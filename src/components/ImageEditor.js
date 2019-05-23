import React, { Component } from 'react';
import PNGParser from '../PNGParser';
import ScalableCanvas from './ScalableCanvas';
import ColorList from './ColorList';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  container: {
  },
  editor: {
    display: 'flex',
    height: '330px',
    alignItems: 'center'
  }
})

class ImageEditor extends Component {

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.fileReader = new FileReader();
    this.state = {
      img: undefined,
      isReading: false,
      scale: 7,
      indicator: undefined
    }
  }

  componentDidMount = () => {
    const { fileReader } = this;
    fileReader.onload = () => {
      PNGParser.parse(fileReader.result)
        .then( img => this.setState({img, isReading: false}))
    }
    this.handleImageLoad();
  }

  handleImageLoad = () => {
    const { isReading } = this.state;
    !isReading
      && this.setState({isReading: true}, this.handleFileRead );
  }
  handleScaleChange = (event) => {
    this.setState({scale: Number(event.target.value)});
  }

  handleFileRead = async () => {
    const { imgInfo } = this.props;
    const imgBlob = await fetch(`http://localhost:8000/public/${imgInfo.filename}`)
      .then(res => res.blob());
    this.fileReader.readAsArrayBuffer(imgBlob);
  }

  handleColorChange = (index, color) => {
    const { img } = this.state;
    let { colors, sortedPixels, pixels } = img;
    const duplicated = colors.findIndex( c => c === color);
    if(duplicated < 0 || duplicated === index){
      colors = colors.map( (c, i) => i === index ? color : c);
    } else {
      sortedPixels[index].forEach( pIndex => {
        pixels[pIndex] = duplicated;
        sortedPixels[duplicated].push(pIndex);
      });
      sortedPixels[index] = [];
      colors[index] = undefined;
    }
    this.setState({img: {
      ...img,
      colors, sortedPixels, pixels
    }});
  }

  handleImageSubmit = async () => {
    const { onClose, imgInfo } = this.props;
    const { img } = this.state;
    const url = `http://localhost:8000/images/${imgInfo.id}`;
    const newInfo = await fetch(url, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ pixels: img.pixels, colors: img.colors })
    }).then( res => res.json() );
    onClose(newInfo);
  }
  handleTempColorChange = (action) => this.setState({
    indicator: action
  })

  render() {
    const { onClose, classes } = this.props;
    const { img, scale, indicator } = this.state;
    const { handleColorChange, handleImageSubmit, handleTempColorChange } = this;
    return (
      <div className={classes.container}>
        <div className={classes.editor}>
          <ScalableCanvas
            img={img}
            scale={scale}
            indicator={indicator}
          />
          <ColorList
            onChange={handleColorChange}
            colors={img && img.colors}
            onTempChange={handleTempColorChange}
          />
        </div>
        <div>
          <Button
            color='primary'
            onClick={handleImageSubmit}
          >
          {"確定"}</Button>
          <Button onClick={() => onClose()} color='primary'>{"取消"}</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ImageEditor);
