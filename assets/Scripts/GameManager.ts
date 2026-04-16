import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {

    static instance: GameManager = null;

    @property(Label)
    scoreLabel: Label = null;

    @property(Node)
    coinUITarget: Node = null;  // ← перетащи Paypal ноду сюда в Inspector

    private score: number = 0;

    onLoad() {
        GameManager.instance = this;
    }

    public addScore(amount: number) {
        this.score += amount;
        this.updateScoreUI();
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore() {
        this.score = 0;
        this.updateScoreUI();
    }

    private updateScoreUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = '$' + this.score;
        }
    }
}