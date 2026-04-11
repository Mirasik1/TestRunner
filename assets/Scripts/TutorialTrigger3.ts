import { _decorator, Component, Node, find, input, Input, EventTouch, EventMouse, tween, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

import BackgroundScroller from './BackgroundScroller';
import PlayerController from './PlayerController';

@ccclass('TutorialTrigger3')
export default class TutorialTrigger3 extends Component {

    @property
    triggerDistance: number = 300;

    @property(Node)
    bandit: Node = null;

    private triggered: boolean = false;
    private playerNode: Node = null;
    private readyUI: Node = null;
    private banditAnim: Animation = null;

    start() {
        this.playerNode = find('Canvas/Player');
        this.readyUI = find('Canvas/UI/GetReadyUI');

        if (this.bandit) {
            this.banditAnim = this.bandit.getComponent(Animation);
        }

        const controller = this.playerNode?.getComponent(PlayerController);

        if (controller) controller.setJumpEnabled(false);
    }

    update(deltaTime: number) {
        if (this.triggered || !this.playerNode) return;

        const distX = this.node.worldPosition.x - this.playerNode.worldPosition.x;
        if (distX > 0 && distX < this.triggerDistance) {
            this.triggered = true;
            this.showUI();
            const controller = this.playerNode?.getComponent(PlayerController);
            controller.playAnim("idle")
        }
    }

    showUI() {
        const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
        if (scroller) scroller.setSpeed(0);

        if (this.banditAnim) {
            this.banditAnim.pause();
        }

        if (!this.readyUI) return;

        this.readyUI.active = true;
        this.readyUI.setScale(0, 0, 1);

        tween(this.readyUI)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .call(() => {
                input.on(Input.EventType.TOUCH_START, this.onTap, this);
                input.on(Input.EventType.MOUSE_DOWN, this.onTap, this);
            })
            .start();
    }

    onTap() {
        input.off(Input.EventType.TOUCH_START, this.onTap, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onTap, this);

        if (!this.readyUI) return;

        tween(this.readyUI)
            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
            .call(() => {
                this.readyUI.active = false;

                const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
                if (scroller) {
                    scroller.setSpeed(700);
                    scroller.unlockEnemies(); // ← добавь
                }

                if (this.banditAnim) this.banditAnim.resume();

                const controller = this.playerNode?.getComponent(PlayerController);
                if (controller) {
                    controller.setJumpEnabled(true);
                    controller.startRunning();
                    controller.jump();
                }
            })
            .start();
    }
}