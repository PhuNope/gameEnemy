import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { ShipType } from '../item/ShipType';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Sprite)
    enemySprite: Sprite;

    @property(SpriteFrame)
    enemySpriteList: SpriteFrame[] = [];

    enemyDir;
    callback;

    start() {

    }

    update(deltaTime: number) {

    }

    setup(shipType: ShipType, position: Vec3, callback) {
        //set anh
        this.enemySprite.spriteFrame = shipType.shipSprite;
        //set vitri
        this.node.position = position;
        //set huong di
        this.enemyDir = new Vec3(0, -1, 0);

        this.callback = callback;
    }
}


