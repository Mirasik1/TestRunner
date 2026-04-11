import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Animation, find } from 'cc';
const { ccclass, property } = _decorator;

import HeartUI from './HeartUI';
import EnemyMarker from './EnemyMarker';
import DeathScreen from './DeathScreen';
import BackgroundScroller from './BackgroundScroller';
@ccclass('HealthSystem')
export default class HealthSystem extends Component {

    @property
    maxHP: number = 3;

    @property(Node)
    heartUI: Node = null;

    private currentHP: number = 3;
    private isDamaged: boolean = false;
    private isDead: boolean = false;
    private animator: Animation = null;

    start() {
        this.currentHP = this.maxHP;
        this.animator = this.getComponent(Animation);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.updateHeartUI();
    }

    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (this.isDamaged || this.isDead) return;
        const isEnemy = otherCollider.node.getComponent(EnemyMarker);
        if (!isEnemy) return;
        this.takeDamage();
    }

    takeDamage() {
        if (this.isDamaged || this.isDead) return;
        this.isDamaged = true;
        this.currentHP--;

        this.updateHeartUI();

        if (this.currentHP <= 0) {
            this.die();
            return;
        }

        if (this.animator) {
            this.animator.play('damage');
            this.animator.once(Animation.EventType.FINISHED, () => {
                this.isDamaged = false;
                this.animator.play('run');
            }, this);
        } else {
            this.isDamaged = false;
        }
    }

    updateHeartUI() {
        if (!this.heartUI) return;
        const ui = this.heartUI.getComponent(HeartUI);
        if (ui) ui.setHP(this.currentHP);
    }

    die() {
        this.isDead = true;
        this.onDeath();
    }

    onDeath() {
    DeathScreen.instance?.show();
}

    public getCurrentHP(): number { return this.currentHP; }
    public getIsDead(): boolean { return this.isDead; }
}