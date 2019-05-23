import { PNG } from 'pngjs/browser';

const parse = (buffer) => {
  return new Promise( (resolve, reject) => {
    new PNG({ filterType: 4 }).parse(buffer, (err, data) => {
      if(err) return reject(err);
      const { width, height } = data;
      const widthMax = width > 80 ? 80 : width;
      const heightMax = height > 80 ? 80 : height;
      let pixels = [], colors = Object.create(null), colorIndex = 0;
      let sortedPixels = [];
      for(let y = 0; y < heightMax; y++){
        for(let x = 0; x < widthMax; x++ ){
          let offset = (width * y + x) * 4;
          let r = data.data[offset],
            g = data.data[offset + 1],
            b = data.data[offset + 2],
            a = data.data[offset + 3];
          let key = `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`;
          let index
          if(colors[key] !== undefined) {
            index = colors[key]
          } else {
            index = colors[key] = colorIndex++;
            sortedPixels[index] = []
          }
          pixels.push(index);
          sortedPixels[index].push( y * widthMax + x);
        }
      }
      resolve({
        width: widthMax, height: heightMax, pixels, sortedPixels,
        colors: Object.entries(colors).reduce( (accu, e) => {
          accu[e[1]] = e[0];
          return accu;
        }, [])
      });
    })
  })
}

export default {
  parse
}