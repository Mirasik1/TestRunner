import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import Spoing from './Spoing';

@ccclass('Collectable')
export default class Collectable extends Component {

    @property(Node)
    coinUITarget: Node = null;

    @property
    value: number = 1;

    @property
    flyDuration: number = 0.5;

    @property
    flyStartScale: number = 1.4;  // размер в начале полёта

    @property
    flyEndScale: number = 0.15;   // размер в конце полёта (у UI)

    private isCollected: boolean = false;

    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            console.log(`[Collectable] ✅ Коллайдер найден на ${this.node.name}`);
        } else {
            console.error(`[Collectable] ❌ Коллайдер НЕ найден на ${this.node.name}!`);
        }
    }

    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        console.log(`[Collectable] 💥 Контакт! self: ${selfCollider.node.name} | other: ${otherCollider.node.name}`);

        if (this.isCollected) return;
        if (otherCollider.node.name !== 'Player') {
            console.log(`[Collectable] ⚠️ Столкнулись не с Player, а с: ${otherCollider.node.name}`);
            return;
        }

        console.log(`[Collectable] 🎉 Подобрана монета! +${this.value}`);
        this.isCollected = true;
        selfCollider.enabled = false;
        this.playCollectAnimation();
    }

    playCollectAnimation() {
        if (!this.coinUITarget) {
            console.warn(`[Collectable] ⚠️ coinUITarget не привязан!`);
            this.onCoinReached();
            this.node.destroy();
            return;
        }

        const targetWorldPos = this.coinUITarget.worldPosition.clone();
        const s = this.flyStartScale;
        const e = this.flyEndScale;

        tween(this.node)
            .to(0.08, { scale: new Vec3(s, s, 1) })
            .to(this.flyDuration, {
                worldPosition: new Vec3(targetWorldPos.x, targetWorldPos.y, 0),
                scale: new Vec3(e, e, 1),
                angle: 720
            }, { easing: 'cubicIn' })
            .call(() => {
                this.onCoinReached();
                this.node.destroy();
            })
            .start();
    }

    onCoinReached() {
        const spoing = this.coinUITarget?.getComponent(Spoing);
        if (spoing) {
            spoing.play();
            console.log(`[Collectable] 🌀 Spoing запущен`);
        } else {
            console.warn(`[Collectable] ⚠️ Spoing не найден на coinUITarget!`);
        }
    }
}