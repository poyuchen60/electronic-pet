import React, { Component } from 'react';
import ImageManager from './components/ImageManager';
import AnimationManager from './components/AnimationManager';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

const styles = ({
  title: {

  }
})

class App extends Component {
  render(){
    const { classes } = this.props;
    return <div>
      <CssBaseline />
      <AppBar position="static" >
        <Toolbar>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            後臺
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <ImageManager /> */}
      <AnimationManager />
    </div>
  }
}

export default withStyles(styles)(App);