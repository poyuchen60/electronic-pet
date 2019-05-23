import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const rgbaParse = (str) => {
  if(!str) return undefined;
  const [,r,g,b,a] =
    /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d(\.\d{1,})*)\)/.exec(str);
  return {
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a)
  }
}
const rgbaToString = ({r, g, b, a}) => `rgba(${r},${g},${b},${a.toFixed(2)})`
const colorBoxStyle = color => ({
  width: '10px',
  height: '10px',
  border: '1px solid black',
  backgroundColor: color
})

const styles =({
  container: {
    position: 'relative',
    flexGrow: 1
  },
  picker: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      display: 'flex',
      height: '35px',
      alignItems: 'center',
      paddingLeft: '5px',
      cursor: 'pointer',
    },
    '& li:hover': {
      backgroundColor: '#eee'
    },
    '& li .title': {
      marginLeft: '5px'
    }
  }
})

class ColorList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      select: -1,
      pickerColor: undefined
    }
  }

  handleColorSelect = (index) => () => {
    const { colors, onTempChange } = this.props;
    index < 0 && onTempChange(undefined)
    this.setState({
      select: index,
      pickerColor: rgbaParse(colors[index])
    })
  }
  handleColorChangeComplete = (color) => {
    const { onTempChange } = this.props;
    const { select } = this.state;
    if(select < 0) return
    onTempChange({
      index: select,
      color: rgbaToString(color.rgb)
    });
    this.setState({pickerColor: color.rgb});
  }
  handleColorSubmit = () => {
    const { onChange } = this.props;
    const { select, pickerColor } = this.state;
    const rgba = rgbaToString(pickerColor);
    onChange(select, rgba)
    this.setState({select: -1});
  }

  render() {
    const { select, pickerColor } =this.state;
    const { colors, classes } = this.props;
    const {
      handleColorSelect,
      handleColorChangeComplete,
      handleColorSubmit
    } = this;
    return <div className={classes.container}>
      {select >= 0 
        && <div className={classes.picker}>
          <SketchPicker
            color={pickerColor}
            onChangeComplete={handleColorChangeComplete}
          />
          <div className="buttons">
            <Button onClick={handleColorSubmit}>確定</Button>
            <Button onClick={handleColorSelect(-1)}>取消</Button>
          </div>
        </div>
      }
      <ul className={classes.list}>
        { colors && colors.map( (c, i) => {
          return c && <li key={i} onClick={handleColorSelect(i)}>
            <div style={colorBoxStyle(c)}></div>
            <span className='title'>{c.toUpperCase()}</span>
          </li>
        })}
      </ul>
    </div>
  }
}


export default withStyles(styles)(ColorList);


// { select >= 0
//   && select < colors.length
//   && colors[select]
//   && <li>
//     <SketchPicker
//       color={rgbaParse(colors[select])}
//       onChangeComplete={handleColorChangeComplete}
//     />
//   </li>
// }