import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('config')
export class Config extends Component {
    public static HALF_SCREEN_W = 360;
    public static HALF_SCREEN_H = 640;
}


