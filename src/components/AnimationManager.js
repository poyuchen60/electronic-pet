import React, { Component } from 'react';
import AnimationCard from './AnimationCard';
import AnimationEditor from './AnimationEditor';


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
  },
  newAnimation: {
    display: 'flex',
    border: '1px solid black',
    '& button': {
      flex: 1
    }
  }
}

class AnimationManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animations: [],
      editing: -1,
      updating: -1,
    }
  }

  componentDidMount = () => {
    fetch('http://localhost:8000/animations')
      .then( res => res.json() )
      .then( animations => this.setState({animations}) )
  }

  handleAnimationEditClose = (newAnimation) => {
    const { editing } = this.state;
    newAnimation
      ? this.setState({editing: -1, updating: editing}, async () => {
        const { updating, animations } = this.state;
        const url = `http://localhost:8000/animations/${animations[updating].id}`;
        const updated = await fetch(url, {
          headers: {
            'content-type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify(newAnimation)
        }).then(res => res.json())
        this.setState({
          animations: animations.map( (a,i) => i === updating ? updated : a),
          updating: -1
        })
      })
      : this.setState({editing: -1});
  }

  handleAnimationEditOpen = (editing) => () => {
    if(this.state.updating >= 0) return;
    this.setState({editing})
  }
  handleAnimationCreate = () => {
    fetch('http://localhost:8000/animations', {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({name: 'new animation', description: 'none'})
    })
      .then(res => res.json())
      .then(newAnimation => {
        const { animations } = this.state;
        this.setState({animations: [...animations, newAnimation]});
      })
  }

  render() {
    const { animations, editing, updating } = this.state;
    const { classes } = this.props;
    const {
      handleAnimationEditClose,
      handleAnimationEditOpen,
      handleAnimationCreate
    } = this;
    return <div>
      <div className={classes.container}>
        <div className={classes.newAnimation}>
          <Button
            onClick={handleAnimationCreate}
            color='primary'
          >{'新增'}</Button>
        </div>
        { animations.map( (a, i) => 
          <AnimationCard
            {...a}
            key={a.id}
            onEdit={handleAnimationEditOpen(i)}
            updating={i === updating}
          />
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
          <AnimationEditor
            animation={animations[editing]}
            onClose={handleAnimationEditClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  }
}

export default withStyles(styles)(AnimationManager);