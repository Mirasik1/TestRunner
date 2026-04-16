import { _decorator, Component, Node, instantiate, find, Label, Vec3, tween, UITransform } from 'cc';
import { view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {

    static instance: GameManager = null;

    @property(Label)
    scoreLabel: Label = null;

    @property(Node)
    coinUITarget: Node = null;  // ← перетащи Paypal ноду сюда в Inspector
    @property(Node)
    popupPrefab: Node = null;
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
    showPopupText() {
    // 🎲 шанс появления 20%
    if (Math.random() > 0.1) return;

    if (!this.popupPrefab) return;

    const canvas = find('Canvas');
    if (!canvas) return;

    const popup = instantiate(this.popupPrefab);
    canvas.addChild(popup);

    popup.setPosition(0, 0, 0);
    popup.setScale(0, 0, 1);

    // 🎲 равный шанс слов
    const texts = ['Fantastic', 'Great', 'Awesome'];
    const text = texts[Math.floor(Math.random() * texts.length)];

    const label = popup.getComponentInChildren(Label);
    if (label) {
        label.string = text;

        // 📱 ориентация экрана
        const viewSize = view.getVisibleSize();
        if (viewSize.width > viewSize.height) {
            label.fontSize = 80; // landscape
        } else {
            label.fontSize = 40; // portrait
        }
    }

    // 💥 spoing
    const spoing = popup.getComponentInChildren('Spoing') as any;

    tween(popup)
        // ⚡ быстрее появление
        .to(0.12, {
            scale: new Vec3(1.2, 1.2, 1),
            position: new Vec3(0, 40, 0)
        }, { easing: 'backOut' })

        .to(0.08, {
            scale: new Vec3(1, 1, 1)
        })

        .call(() => {
            spoing?.play?.();
        })

        // ⏱ быстрее исчезает
        .delay(0.5)

        .to(0.18, {
            scale: new Vec3(0, 0, 1),
            position: new Vec3(0, 100, 0)
        }, { easing: 'backIn' })

        .call(() => popup.destroy())
        .start();
}
}