import { _decorator, Component, director, instantiate, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUIController')
export class GameOverUIController extends Component {
    @property(Label)
    labelScoreFinal: Label;

    callback
    start() {

    }

    setFinalScore(score: number, callback) {
        console.log(score)
        this.labelScoreFinal.string = "Điểm của bạn là: " + score;
        this.callback = callback;
    }

    backToMenu() {
        this.callback();
    }

    update(deltaTime: number) {

    }
}


