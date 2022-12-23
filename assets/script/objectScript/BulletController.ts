import { _decorator, Component, Node, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    bulletDirection;
    isFire: Boolean = false;
    bulletSpeed: number = 150;
    bulletDamage: number = 1;

    @property(Sprite)
    bulletSprite: Sprite;

    start() {

    }

    update(deltaTime: number) {
        if (this.isFire) {
            this.node.translate(this.bulletDirection);
        }

        if (this.node.position.subtract(Vec3.ZERO).length() > 1500) {
            this.node.destroy();
            this.isFire = false;
        }
    }

    setup(direction: Vec3, speed: number, damage: number) {
        this.bulletSpeed = speed;
        this.bulletDirection = direction.normalize().multiply(new Vec3(speed, speed, 0));
        this.isFire = true;
        this.bulletDamage = damage;
    }

    getBulletDamage() {
        return this.bulletDamage;
    }
}


