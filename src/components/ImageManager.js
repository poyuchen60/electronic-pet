import React, { Component } from 'react';

import ImageGallery from './ImageGallery';
import ImageEditor from './ImageEditor';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  title: {

  },
  button: {

  },
  row: {
    display: 'flex'
  }
})

class ImageManager extends Component {

  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      imageList: [],
      uploading: false,
      editing: -1,
    }
  }

  componentDidMount = () => {
    this.handleImageListFetch();
  }

  handleImageListFetch = async () => {
    const imageList = await fetch('http://localhost:8000/images')
      .then( res => res.json());
    this.setState({imageList})
  }
  handleFileUpload = () => {
    const [file] = this.fileInput.current.files;
    if(file && !this.state.uploading){
      this.setState({uploading: true}, () =>{
        const data = new FormData();
        const name = 'temp', description = 'this is a image';
        data.append('image', file);
        data.append('name', name);
        data.append('description', description);
        fetch(`http://localhost:8000/upload`, {
          method: 'POST',
          body: data
        }).then( res => res.json())
          .then( img => {
            const { id, filename } = img;
            const { imageList } = this.state;
            this.setState({imageList: [...imageList, {
              id, filename, name, description
            }], uploading: false});
          });
      })
    }
  }
  handleImageEditOpen = (index) => this.setState({editing: index});
  handleImageEditClose = (img) => {
    const { editing, imageList } = this.state;
    img && (imageList[editing] = img)
    this.setState({editing: -1, imageList: imageList})
  }

  render() {
    const { classes } = this.props;
    const {
      handleFileUpload,
      handleImageEditOpen,
      handleImageEditClose
    } = this;
    const { imageList, uploading, editing } = this.state;
    return <div>
      <div className={classes.row}>
        <input type='file' accept='image/png' ref={this.fileInput} />
        <Button
          disabled={uploading}
          onClick={handleFileUpload}
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          上傳
        </Button>
      </div>
      <ImageGallery imageList={imageList} onEdit={handleImageEditOpen} />
      <Dialog
        open={editing >= 0}
        onClose={() => handleImageEditClose()}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {"編輯圖片"}
        </DialogTitle>
        <DialogContent>
          <ImageEditor
            imgInfo={imageList[editing]}
            onClose={handleImageEditClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  }
}


export default withStyles(styles)(ImageManager);