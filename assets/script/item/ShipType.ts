import { _decorator, Component, Node, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ShipType")
export class ShipType {
  @property(SpriteFrame)
  shipSprite: SpriteFrame;

  @property({ type: Number })
  shipHealth: number;

  @property({ type: Number })
  shipSpeed: number;
}
