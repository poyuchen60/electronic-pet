import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import EditIcon from '@material-ui/icons/Edit';

const styles = ({
  container: {
    padding: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridGap: '10px 5px'
  },
  media: {
    height: '100px'
  },
})

class ImageGallery extends Component {


  render() {
    const { classes, imageList, onEdit } = this.props;
    return <div className={classes.container}>
      { imageList.map( (img, i) => <Card key={img.id}>
        <CardHeader
          action={
            <IconButton onClick={ () => onEdit(i)}>
              <EditIcon />
            </IconButton>
          }
          title={img.name}
          subheader={img.description}
        />
        <CardMedia
          className={classes.media}
          image={`http://localhost:8000/public/${img.filename}`}
          title={img.name}
        />
      </Card>)}
    </div>
  }
}

export default withStyles(styles)(ImageGallery);
