import { _decorator, Component, instantiate, log, Node, Prefab, Sprite, Touch, tween, Vec3 } from 'cc';
import { Config } from '../GameConfig/config';
import { CanonController } from './objectScript/CanonController';
import { BulletController } from './objectScript/BulletController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    gamePlay: Node;

    @property(Node)
    canonPlayer: Node;

    @property(Prefab)
    bulletPrefab: Prefab;

    start() {
        this.gamePlay.on(Node.EventType.TOUCH_START, this.handleRotateCanon, this)

    }

    update(deltaTime: number) {

    }

    handleRotateCanon(event: Touch) {
        //lay vi tri tro chuot
        let touchLocation = event.getUILocation();
        //chuyen ve dang vector co huong so voi goc canon
        console.log(touchLocation)
        let vecLocation = new Vec3(touchLocation.x - Config.HALF_SCREEN_W, touchLocation.y - Config.HALF_SCREEN_H);
        //lay khoang cach
        let vecDirection = this.getDistance(this.canonPlayer.position, vecLocation);
        //chuyen ve vector don vi
        vecDirection.normalize();
        //lay goc quay
        let zAngel = Math.atan2(vecDirection.x, vecDirection.y) * 180 / Math.PI;

        //lay canonSprite va chuyen ve node
        let canonSpriteNode = this.canonPlayer.getComponent(CanonController).getCanonSprite().node;

        //ban
        const fire = () => {
            //khoi tao bulletPre
            let bullet = instantiate(this.bulletPrefab);
            //dat goc toa do cho bullet
            bullet.setPosition(this.canonPlayer.position);

            bullet.getComponent(BulletController).setup(vecDirection, 5);

            this.canonPlayer.addChild(bullet);

        }

        //animation
        tween(canonSpriteNode).sequence(
            tween(canonSpriteNode).to(0.2, { eulerAngles: new Vec3(0, 0, -zAngel) }),

            tween(canonSpriteNode).call(() => {
                fire();
            })
        ).start();
    }

    getDistance(origin: Vec3, target: Vec3) {
        return target.subtract(origin);
    }
}


