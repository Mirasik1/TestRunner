import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3, UITransform, view, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Collectable')
export default class Collectable extends Component {

    @property(Node)
    coinUITarget: Node = null; // UI объект в правом верхнем углу

    @property
    value: number = 1; // сколько монет даёт

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
        this.playCollectAnimation();
    }

    playCollectAnimation() {
        // Находим UI таргет если не привязан вручную
        const target = this.coinUITarget || find('Canvas/CoinUI');
        if (!target) {
            this.node.destroy();
            return;
        }

        // Конвертируем мировую позицию UI таргета в локальную для анимации
        const targetWorldPos = target.worldPosition;

        const startScale = this.node.scale.clone();

        // Анимация: уменьшается + крутится + летит к UI
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.3, 1.3, 1) }) // лёгкий bounce вверх
            .parallel(
                tween(this.node).to(0.5, {
                    worldPosition: new Vec3(targetWorldPos.x, targetWorldPos.y, 0),
                    scale: new Vec3(0.1, 0.1, 1),
                    angle: 360
                }, { easing: 'cubicIn' })
            )
            .call(() => {
                // Анимация пружинки на UI
                this.playSpringAnimation(target);
                // Добавляем монеты
                this.onCoinReached();
                this.node.destroy();
            })
            .start();
    }

    playSpringAnimation(uiNode: Node) {
        // Сохраняем оригинальный масштаб
        const originalScale = uiNode.scale.clone();

        tween(uiNode)
            .to(0.1, { scale: new Vec3(originalScale.x * 1.4, originalScale.y * 0.7, 1) }) // сжатие
            .to(0.1, { scale: new Vec3(originalScale.x * 0.8, originalScale.y * 1.4, 1) }) // растяжение
            .to(0.08, { scale: new Vec3(originalScale.x * 1.2, originalScale.y * 0.9, 1) })
            .to(0.08, { scale: new Vec3(originalScale.x * 0.95, originalScale.y * 1.1, 1) })
            .to(0.06, { scale: new Vec3(originalScale.x, originalScale.y, 1) }) // возврат
            .start();
    }

    onCoinReached() {
        // Найди свой GameManager и добавь монеты
        // GameManager.instance.addCoins(this.value);
        console.log(`+${this.value} монет!`);
    }
}