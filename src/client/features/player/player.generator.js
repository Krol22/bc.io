import { EcsEntity } from '@krol22/ecs';

import * as PIXI from 'pixi.js';

import DrawComponent from '../../../common/components/draw';
import NetworkComponent from '../../../common/components/network';
import AnimationComponent from '../../../common/components/animation';

const generatePlayer = (networkId) => {
  const spriteSheet = new PIXI.BaseTexture.from(PIXI.Loader.shared.resources['tanks'].url);

  const frameWidth = 16;
  const frameHeight = 16;

  const animationComponent = new AnimationComponent({
    currentAnimation: {
      name: 'IDLE', 
      frame: 0,
    },
    frames: [
      new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0 * frameWidth, 0 * frameHeight, frameWidth, frameHeight)),
      new PIXI.Texture(spriteSheet, new PIXI.Rectangle(1 * frameWidth, 0 * frameHeight, frameWidth, frameHeight)),
    ],
    animations: {
      IDLE: {
        frames: [0],
        loop: false,
      },
      MOVE: {
        frames: [0, 1],
        loop: true,
        time: 2,
      },
    }
  });

  const networkComponent = new NetworkComponent(networkId);
  const drawComponent = new DrawComponent(0, 0,
    new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0 * frameWidth, 0 * frameHeight, frameWidth, frameHeight)),
  );

  return new EcsEntity([
    networkComponent,
    drawComponent,
    animationComponent,
  ]);
};

export default generatePlayer;

