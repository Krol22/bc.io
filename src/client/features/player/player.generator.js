import { EcsEntity } from '@krol22/ecs';

import * as PIXI from 'pixi.js';

import DrawComponent from '../../../common/components/draw';
import NetworkComponent from '../../../common/components/network';
import AnimationComponent from '../../../common/components/animation';

import { FRAME_WIDTH, FRAME_HEIGHT } from '../../../common/constants';

const generatePlayer = (networkId) => {
  const spriteSheet = new PIXI.BaseTexture.from(PIXI.Loader.shared.resources['tanks'].url);

  const animationComponent = new AnimationComponent({
    currentAnimation: {
      name: 'IDLE', 
      frame: 0,
    },
    frames: [
      new PIXI.Texture(
        spriteSheet,
        new PIXI.Rectangle(0 * FRAME_WIDTH, 0 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
      ),
      new PIXI.Texture(
        spriteSheet,
        new PIXI.Rectangle(1 * FRAME_WIDTH, 0 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
      ),
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
    new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0 * FRAME_WIDTH, 0 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT)),
    1,
  );

  return new EcsEntity([
    networkComponent,
    drawComponent,
    animationComponent,
  ]);
};

export default generatePlayer;

