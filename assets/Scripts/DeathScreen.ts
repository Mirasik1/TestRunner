import { _decorator, Component, Node, Label, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeathScreen')
export default class DeathScreen extends Component {

    @property(Node)
    deathUI: Node = null;

    @property(Label)
    scoreLabel: Label = null;

    static instance: DeathScreen = null;

    onLoad() {
        DeathScreen.instance = this;
        if (this.deathUI) this.deathUI.active = false;
    }

    public show() {
        // Берём счёт из PaypalUI
        const paypalLabel = find('Canvas/UI/PaypalUI')?.getComponentInChildren(Label);
        if (paypalLabel && this.scoreLabel) {
            this.scoreLabel.string = paypalLabel.string;
        }

        if (this.deathUI) this.deathUI.active = true;
    }
}