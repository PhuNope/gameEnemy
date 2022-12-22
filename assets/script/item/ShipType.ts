import { _decorator, Component, Node, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ShipType")
export class ShipType extends Component {
  @property(SpriteFrame)
  shipSprite: SpriteFrame;

  @property(Number)
  shipHealth: Number;

  @property(Number)
  shipSpeed: Number;
}
