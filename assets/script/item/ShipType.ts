import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShipType')
export class ShipType extends Component {
    @property(SpriteFrame)
    shipSprite: SpriteFrame;

    start() {

    }

    update(deltaTime: number) {

    }
}


