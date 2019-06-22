import React, { Component } from 'react';
import PNGParser from '../PNGParser';
import ScalableCanvas from './ScalableCanvas';
import ColorList from './ColorList';
import ImageResize from './ImageResize';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  container: {
    position: 'relative'
  },
  sizeEditor: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  editor: {
    display: 'flex',
    height: '330px',
    alignItems: 'center',
    '& .canvasWrapper': {
      position: 'relative'
    },
    '& .canvas': {
      border: '1px solid #eaeaea'
    },
    '& .indicator': {
      border: '1px solid rgba(0,0,0,0)',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1
    }
  },
  inputWrapper: {
    display: 'flex',
    '& .text': {
      width: '150px',
      marginLeft: '30px'
    },
    '& .text:first-child': {
      marginLeft: 0
    }
  }
})

class ImageEditor extends Component {

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.fileReader = new FileReader();
    this.state = {
      name: props.image.name,
      description: props.image.description,
      img: undefined,
      isReading: false,
      scale: 7,
      indicator: undefined,
      sizeEditing: false
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
    const { filename } = this.props.image;
    const imgBlob = await fetch(`http://localhost:8000/public/${filename}`)
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
    const { onClose, image } = this.props;
    const { img, name, description } = this.state;
    const url = `http://localhost:8000/images/${image.id}`;
    const newInfo = await fetch(url, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({
        name, description, 
        pixels: img.pixels, colors: img.colors,
        width: img.width, height: img.height
      })
    }).then( res => res.json() );
    onClose(newInfo);
  }
  handleTempColorChange = (action) => this.setState({
    indicator: action
  })
  handleInputChange = (property) => (event) => this.setState({
    [property]: event.target.value
  });
  hadleSizeEditorOpen = () => this.setState({sizeEditing: true});
  hadleSizeEditSubmit = (newImg) => {
    const { img } = this.state;
    this.setState({img: newImg || img, sizeEditing: false});
  }

  render() {
    const { onClose, classes } = this.props;
    const { img, scale, indicator, name, description, sizeEditing } = this.state;
    const {
      handleColorChange,
      handleImageSubmit,
      handleTempColorChange,
      handleInputChange,
      hadleSizeEditorOpen,
      hadleSizeEditSubmit
    } = this;
    const indicatorImg = indicator && {
      width: img.width,
      height: img.height,
      colors: ['rgba(255,255,255,1)', indicator.color],
      sortedPixels: [img.sortedPixels[indicator.index], img.sortedPixels[indicator.index]]
    }
    return (
      <div className={classes.container}>
        { sizeEditing && <div className={classes.sizeEditor}>
          <ImageResize img={img} onSubmit={hadleSizeEditSubmit} />
        </div> }
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
          <TextField
            label="Size"
            className='text'
            value={`${img && img.height} * ${img && img.width}`}
            onClick={hadleSizeEditorOpen}
            margin="normal"
          />
        </div>
        <div className={classes.editor}>
          <div className='canvasWrapper'>
            <ScalableCanvas
              className='canvas'
              img={img}
              scale={scale}
            />
            <ScalableCanvas
              img={indicatorImg}
              scale={scale}
              className='indicator'
            />
          </div>
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
