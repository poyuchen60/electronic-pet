import React, { Component } from 'react';
import AnimationCard from './AnimationCard';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    padding: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 200px)',
    gridAutoRows: '200px',
    gridGap: '10px',
  }
}

class AnimationManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animations: [],
      editing: -1
    }
  }

  componentDidMount = () => {
    fetch('http://localhost:8000/animations')
      .then( res => res.json() )
      .then( animations => this.setState({animations}) )
  }

  handleAnimationEditClose = () => {
    this.setState({editing: -1});
  }

  handleAnimationEditOpen = (editing) => () => {
    this.setState({editing})
  }

  render() {
    const { animations, editing } = this.state;
    const { classes } = this.props;
    const {
      handleAnimationEditClose,
      handleAnimationEditOpen
    } = this;
    return <div>
      <div className={classes.container}>
        { animations.map( (a, i) => 
          <AnimationCard {...a} key={a.id} onEdit={handleAnimationEditOpen(i)} />
        ) }
      </div>
      <Dialog
        open={editing >= 0}
        onClose={() => handleAnimationEditClose()}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {"編輯動畫"}
        </DialogTitle>
        <DialogContent>
          <p>{editing >= 0 && animations[editing].name}</p>
        </DialogContent>
      </Dialog>
    </div>
  }
}

export default withStyles(styles)(AnimationManager);