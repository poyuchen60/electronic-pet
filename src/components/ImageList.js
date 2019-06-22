import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = ({
  container: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto'
  },
  item: {
    display: 'flex',
    padding: '5px',
    cursor: 'pointer',
    '& .title': {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '5px',
    },
    '&:hover': {
      backgroundColor: '#eaeaea',
    },
    '& .imgWrapper': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
})

class ImageList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }

  componentDidMount = () => {
    fetch('http://localhost:8000/images')
      .then( res => res.json() )
      .then( images => this.setState({images}) );
  }


  render() {
    const { classes, onClick } = this.props;
    const { images } = this.state;
    return <ul className={classes.container}>
      { images.map( ({filename, id, name, description}) => <li
          key={id}
          className={classes.item}
          onClick={onClick(id, filename)}
        >
          <div className='imgWrapper' >
            <img
              alt={name}
              src={`http://localhost:8000/public/${filename}`}
            />
          </div>
          <div className='title'>
            <span>{name}</span>
            <span>{description}</span>
          </div>
        </li>)
      }
    </ul>
  }
}


export default withStyles(styles)(ImageList);