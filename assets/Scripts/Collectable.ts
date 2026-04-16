import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3, Label, find, Enum } from 'cc';
import { instantiate, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

import Spoing from './Spoing';
import AudioManager from './AudioManager';
import GameManager from './GameManager';
@ccclass('Collectable')
export default class Collectable extends Component {

    @property(Node)
    coinUITarget: Node = null;

    @property
    value: number = 1;

    @property
    flyDuration: number = 0.5;

    @property
    flyStartScale: number = 1.4;

    @property
    flyEndScale: number = 0.15;


    @property({ type: Enum({ HALF: 180, ONE: 360, TWO: 720 }) })
    rotations: number = 360;

    private isCollected: boolean = false;



    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (this.isCollected) return;
        if (otherCollider.node.name !== 'Player') return;

        this.isCollected = true;
        selfCollider.enabled = false;
        this.playCollectAnimation();
    }

    playCollectAnimation() {
        const target = GameManager.instance?.coinUITarget;

        if (!target) {
            this.onCoinReached();
            this.node.destroy();
            return;
        }

        const targetWorldPos = target.worldPosition.clone();
        const startAngle = this.node.angle;

        tween(this.node)
            .to(0.08, { scale: new Vec3(this.flyStartScale, this.flyStartScale, 1) })
            .to(this.flyDuration, {
                worldPosition: new Vec3(targetWorldPos.x, targetWorldPos.y, 0),
                scale: new Vec3(this.flyEndScale, this.flyEndScale, 1),
                angle: startAngle + this.rotations
            }, { easing: 'cubicIn' })
            .call(() => {
                this.onCoinReached();
                this.node.destroy();
            })
            .start();
    }

    onCoinReached() {
        AudioManager.instance?.playCollect();

        const target = GameManager.instance?.coinUITarget;
        const spoing = target?.getComponent(Spoing) ?? target?.getComponentInChildren(Spoing);
        if (spoing) spoing.play();

        GameManager.instance?.addScore(this.value);
        GameManager.instance?.showPopupText();
    }

}