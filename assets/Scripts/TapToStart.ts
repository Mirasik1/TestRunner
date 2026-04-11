import { _decorator, Component, Node, Label, input, Input, EventTouch, EventMouse, tween, Tween, Vec3, find } from 'cc';
const { ccclass, property } = _decorator;

import Spoing from './Spoing';
import BackgroundScroller from './BackgroundScroller';
import PlayerController from './PlayerController';

@ccclass('TapToStart')
export default class TapToStart extends Component {

    @property(Node)
    tapUI: Node = null;

    @property(Node)
    cursorNode: Node = null;

    @property(Label)
    label: Label = null;

    @property
    labelText: string = 'Tap To Start Earning';

    @property
    isTutorialMode: boolean = false;

    private isWaiting: boolean = false;
    private onComplete: (() => void) | null = null;
    private playerNode: Node = null;

    static instance: TapToStart = null;

    onLoad() {
    TapToStart.instance = this;
    this.playerNode = find('Canvas/Player'); // ← добавь это

    if (!this.isTutorialMode) {
        // Сразу запрещаем прыжок
        const controller = this.playerNode?.getComponent(PlayerController);
        if (controller) controller.setJumpEnabled(false);

        const bg = find('Canvas/Background');
        const scroller = bg?.getComponent(BackgroundScroller);
        if (scroller) scroller.setSpeed(0);

        this.show('Tap To Start Earning', () => {
            this.startGame();
        });
    } else {
        this.tapUI.active = false;
    }
}

    public show(text: string, callback: () => void) {
        this.onComplete = callback;
        this.isWaiting = true;

        if (this.label) this.label.string = text;

        this.tapUI.active = true;
        this.tapUI.setScale(0, 0, 1);

        tween(this.tapUI)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();

        input.on(Input.EventType.TOUCH_START, this.onTap, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onTap, this);
    }

    onTap() {
        if (!this.isWaiting) return;
        this.isWaiting = false;

        input.off(Input.EventType.TOUCH_START, this.onTap, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onTap, this);

        tween(this.tapUI)
            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
            .call(() => {
                this.tapUI.active = false;
                if (this.onComplete) {
                    this.onComplete();
                    this.onComplete = null;
                }
                const player = find('Canvas/Player');
                const controller = player?.getComponent(PlayerController);
                controller.setJumpEnabled(true)
            })
            .start();
    }

    startGame() {
    const bg = find('Canvas/Background');
    const scroller = bg?.getComponent(BackgroundScroller);
    if (scroller) scroller.setSpeed(700);

    const controller = this.playerNode?.getComponent(PlayerController);
    if (controller) {
        controller.setJumpEnabled(true);
        controller.startRunning();
    }
}
}