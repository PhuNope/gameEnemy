import {
    _decorator,
    Component,
    instantiate,
    Label,
    log,
    Node,
    Prefab,
    Sprite,
    Touch,
    tween,
    Vec3,
} from "cc";
import { Config } from "../GameConfig/config";
import { CanonController } from "./objectScript/CanonController";
import { BulletController } from "./objectScript/BulletController";
import { ShipType } from "./item/ShipType";
import { EnemyController } from './objectScript/EnemyController';
import { GameOverUIController } from "./objectScript/GameOverUIController";
import { director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property(Node)
    gamePlay: Node;

    @property(Node)
    canonPlayer: Node;

    @property(Prefab)
    bulletPrefab: Prefab;

    @property(Node)
    butlletNode: Node;

    @property(Prefab)
    enemyPrefab: Prefab;

    @property(Vec3)
    listPositionEnemy: Vec3[] = [];

    @property(ShipType)
    enemyType: ShipType[] = [];

    positionOld: number = 0;

    @property(Number)
    timeTurnList: number[] = [];

    @property(Label)
    labelScore: Label;

    score: number = 0;
    isGameOver: boolean = false;

    arrListShip: Node[] = []

    @property(Prefab)
    gameOverUIPre: Prefab;

    @property(Node)
    uiOver: Node;

    start() {
        this.gamePlay.on(Node.EventType.TOUCH_START, this.handleRotateCanon, this);

        //tao random enemy
        for (let index = 0; index < this.timeTurnList.length; index++) {
            setInterval(() => {
                this.createEnemyByType(index);
            }, this.timeTurnList[index] * 1000);

        }
    }

    handleRotateCanon(event: Touch) {
        //lay vi tri tro chuot
        let touchLocation = event.getUILocation();
        //chuyen ve dang vector co huong so voi goc canon
        let vecLocation = new Vec3(
            touchLocation.x - Config.HALF_SCREEN_W,
            touchLocation.y - Config.HALF_SCREEN_H
        );
        //lay khoang cach
        let vecDirection = this.getDistance(this.canonPlayer.position, vecLocation);
        //chuyen ve vector don vi
        vecDirection.normalize();
        //lay goc quay
        let zAngel = (Math.atan2(vecDirection.x, vecDirection.y) * 180) / Math.PI;

        //lay canonSprite va chuyen ve node
        let canonSpriteNode = this.canonPlayer
            .getComponent(CanonController)
            .getCanonSprite().node;

        //ban
        const fire = () => {
            //khoi tao bulletPre
            let bullet = instantiate(this.bulletPrefab);
            //dat goc toa do cho bullet
            bullet.setPosition(canonSpriteNode.position);

            bullet.getComponent(BulletController).setup(vecDirection, 10, 1);

            this.butlletNode.addChild(bullet);
        };

        //animation
        tween(canonSpriteNode)
            .sequence(
                tween(canonSpriteNode).to(0.2, {
                    eulerAngles: new Vec3(0, 0, -zAngel),
                }),

                tween(canonSpriteNode).call(() => {
                    fire();
                })
            )
            .start();
    }

    getDistance(origin: Vec3, target: Vec3) {
        return target.subtract(origin);
    }

    createEnemy(typeEnemy: number) {
        let enemy = instantiate(this.enemyPrefab);

        let randomPosition;

        do {
            //lay vi tri ngau nhien
            randomPosition = Math.floor(Math.random() * this.listPositionEnemy.length);

            this.positionOld = randomPosition;

        } while (this.positionOld != randomPosition);

        //khoi tao enemy
        enemy.getComponent(EnemyController).setup(this.enemyType[typeEnemy], this.listPositionEnemy[randomPosition], (ship: EnemyController) => {
            let index = this.arrListShip.findIndex(item => item === ship.node);
            this.arrListShip.splice(index, 1);
            ship.node.destroy();
            this.enemyDie();
        }, () => {

            this.setGameOver();
        });
        this.arrListShip.push(enemy);
        this.gamePlay.addChild(enemy);


    }

    createEnemyByType(i: number) {
        // for (let index = 0; index < 10; index++) {
        //     setTimeout(() => {
        //         this.createEnemy(i);
        //     }, i * 1000);

        // }

        this.createEnemy(i);
    }

    private enemyDie() {
        this.score += 10;
        //update lable score
        this.labelScore.string = "Score: " + this.score;
    }

    update(deltaTime: number) {
        if (!this.isGameOver) {
            this.arrListShip.forEach(arr => {
                arr.getComponent(EnemyController).myUpdate();
            });
        }
    }

    setGameOver() {
        this.isGameOver = true;

        //khoi tao gameover
        let gameOverUI = instantiate(this.gameOverUIPre);
        gameOverUI.getComponent(GameOverUIController).setFinalScore(this.score, () => {
            director.loadScene("menu")
        });
        this.gamePlay.addChild(gameOverUI);

        this.labelScore.string = "";
        this.gamePlay.off(Node.EventType.TOUCH_START, this.handleRotateCanon, this);
    }
}
