import path from 'path';
import fs from 'fs';

function loadMap(mapName) {
  // eslint-disable-next-line no-undef
  const mapData = fs.readFileSync(path.join(__dirname, `${mapName}.json`));

  const { number, map } = JSON.parse(mapData);  

  map.forEach(element => {element.x += 3; element.y += 3;});

  return {
    number, map,
  };
}

export {
  loadMap,
}; 

