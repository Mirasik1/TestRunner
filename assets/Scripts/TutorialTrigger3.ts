import { _decorator, Component, Node, find, input, Input, EventTouch, EventMouse, tween, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

import BackgroundScroller from './BackgroundScroller';
import PlayerController from './PlayerController';
import { EnemyMove } from './EnemyMove';

@ccclass('TutorialTrigger3')
export default class TutorialTrigger3 extends Component {

    @property
    triggerDistance: number = 300;

    @property(Node)
    bandit: Node = null;


    private playerNode: Node = null;
    private readyUI: Node = null;
    private banditAnim: Animation = null;
    private enemyMove: EnemyMove = null;
    private triggered: boolean = false;
    private inputLocked: boolean = false;
    private uiReady: boolean = false;
    @property
    jumpDelay: number = 0.3;

    start() {
        this.playerNode = find('Canvas/Player');
        this.readyUI = find('Canvas/UI/GetReadyUI');

        if (this.bandit) {
            this.banditAnim = this.bandit.getComponent(Animation);
            this.enemyMove = this.bandit.getComponent(EnemyMove); // 🔥 добавили
        }

        const controller = this.playerNode?.getComponent(PlayerController);
        if (controller) controller.setJumpEnabled(false);
    }

    update(deltaTime: number) {
        if (this.triggered || !this.playerNode) return;

        const distX = this.node.worldPosition.x - this.playerNode.worldPosition.x;

        if (distX > 0 && distX < this.triggerDistance) {
            this.triggered = true;

            this.enemyMove?.pause();
            this.showUI();

            const controller = this.playerNode?.getComponent(PlayerController);
            controller?.playAnim("idle");
        }
    }
    private enableInput() {
        this.inputLocked = false;

        input.on(Input.EventType.TOUCH_START, this.onTap, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onTap, this);
    }

    showUI() {
        this.inputLocked = true; // 🔥 блокируем тап

        const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
        scroller?.setSpeed(0);

        this.banditAnim?.pause();

        if (!this.readyUI) return;

        this.readyUI.active = true;
        this.readyUI.setScale(0, 0, 1);

        const controller = this.playerNode?.getComponent(PlayerController);
        controller?.setJumpEnabled(false);

        tween(this.readyUI)
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .call(() => {
                this.enableInput();
            })
            .start();
    }

    onTap() {
        if (this.inputLocked) return;

        this.inputLocked = true;
        input.off(Input.EventType.TOUCH_START, this.onTap, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onTap, this);
        const controller = this.playerNode?.getComponent(PlayerController);
        this.banditAnim?.resume();
        if (controller) {
            controller.setJumpEnabled(true);
            controller.startRunning();
            controller.jump();
        }
        if (!this.readyUI) return;

        tween(this.readyUI)
            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
            .call(() => {
                this.readyUI.active = false;

                const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
                scroller?.setSpeed(700);
                scroller?.unlockEnemies();

                

                this.scheduleOnce(() => {


                    this.enemyMove?.resume();
                }, this.jumpDelay);

            })
            .start();
    }
}