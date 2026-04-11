import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinUI')
export default class CoinUI extends Component {

    @property(Label)
    coinLabel: Label = null;

    @property(Node)
    iconNode: Node = null;

    private coins: number = 0;

    static instance: CoinUI = null;

    onLoad() {
        CoinUI.instance = this;
    }

    public addCoins(amount: number) {
        this.coins += amount;
        this.coinLabel.string = `$${this.coins}`;
    }

    public getCoins(): number {
        return this.coins;
    }
}