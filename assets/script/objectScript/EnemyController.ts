import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Node,
    ProgressBar,
    Sprite,
    SpriteFrame,
    Vec3,
} from "cc";
import { ShipType } from "../item/ShipType";
import { BulletController } from "./BulletController";
import { GameController } from "../GameController";
const { ccclass, property } = _decorator;

@ccclass("EnemyController")
export class EnemyController extends Component {
    @property(Sprite)
    enemySprite: Sprite;

    @property(SpriteFrame)
    enemySpriteList: SpriteFrame[] = [];

    @property(ProgressBar)
    healthProgress: ProgressBar;

    enemyHealth: number;
    enemySpeed: number;
    enemyFullHealth: number;

    enemyDir;
    callback;
    isExist: boolean = false;
    setGameOver;

    start() {
        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeinContact, this);
        }
    }

    myUpdate() {
        if (this.isExist) {
            //di chuyen
            this.node.translate(this.enemyDir);
        }   

        if (this.node.position.y < -640) {
            this.node.destroy();
            this.isExist = false;
            this.setGameOver();
        }
    }

    update(deltaTime: number) { }

    setup(shipType: ShipType, position: Vec3, callback, setGameOver) {
        //set anh
        this.enemySprite.spriteFrame = shipType.shipSprite;
        //set vitri
        this.node.position = position;
        //set huong di
        this.enemyDir = new Vec3(0, -1, 0);
        //set thanh mau
        this.enemyHealth = shipType.shipHealth;
        this.enemyFullHealth = shipType.shipHealth;
        //set toc do
        this.enemySpeed = shipType.shipSpeed;

        this.callback = callback;

        //dat su ton tai enemy
        this.isExist = true;

        //dat game over
        this.setGameOver = setGameOver;
    }

    onBeinContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (this.node) {
            //tao vat the va cham
            let hitObject: Node = otherCollider.node;

            //neu va cham voi bullet
            if (hitObject.name.includes("bullet")) {
                //lay damage bullet
                let damageHealth = hitObject
                    .getComponent(BulletController)
                    .getBulletDamage();
                //set lai mau
                this.enemyHealth -= damageHealth;
                //update progress bar
                if (this.enemyHealth <= 0) {
                    this.node.destroy();
                    //dat lai label
                    this.callback(this);
                } else {
                    //set thanh mau
                    this.healthProgress.progress =
                        this.enemyHealth / this.enemyFullHealth;
                }

                //xoa bullet
                hitObject.destroy();
            }
        }
    }
}
