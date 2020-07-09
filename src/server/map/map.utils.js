import path from 'path';
import fs from 'fs';

function loadMap(mapName) {
  // eslint-disable-next-line no-undef
  const mapData = fs.readFileSync(path.join(__dirname, `${mapName}.json`));

  const { number, map } = JSON.parse(mapData);  

  return {
    number, map,
  };
}

export {
  loadMap,
}; 

