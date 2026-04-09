import { _decorator, Component, Node, UITransform, view, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroller')
export default class BackgroundScroller extends Component {

    @property(Node)
    bgTemplate1: Node = null;

    @property(Node)
    bgTemplate2: Node = null;

    @property
    scrollSpeed: number = 400;

    @property
    preloadCount: number = 2;

    private bgNodes: Node[] = [];
    private bgWidth: number = 0;
    private frameIndex: number = 0;

    start() {
        const screenSize = view.getVisibleSize();

        // Берём ширину с шаблона
        const ui = this.bgTemplate1.getComponent(UITransform);
        this.bgWidth = ui ? ui.contentSize.width : screenSize.width;

        // Прячем шаблоны
        this.bgTemplate1.active = false;
        this.bgTemplate2.active = false;

        // Спавним начальные фоны
        for (let i = 0; i < 1 + this.preloadCount; i++) {
            this.spawnNext();
        }
    }

    spawnNext() {
        const template = this.frameIndex % 2 === 0
            ? this.bgTemplate1
            : this.bgTemplate2;

        this.frameIndex++;

        const clone = instantiate(template);
        clone.active = true;
        this.node.addChild(clone);

        const lastX = this.bgNodes.length > 0
            ? this.bgNodes[this.bgNodes.length - 1].position.x + this.bgWidth
            : 0;

        clone.setPosition(lastX, 0, 0);
        this.bgNodes.push(clone);
    }

    update(deltaTime: number) {
        for (let i = this.bgNodes.length - 1; i >= 0; i--) {
            const bg = this.bgNodes[i];
            const newX = bg.position.x - this.scrollSpeed * deltaTime;
            bg.setPosition(newX, bg.position.y, 0);

            if (newX + this.bgWidth < -this.bgWidth / 2) {
                bg.destroy();
                this.bgNodes.splice(i, 1);
            }
        }

        const last = this.bgNodes[this.bgNodes.length - 1];
        if (last && last.position.x < this.bgWidth * this.preloadCount) {
            this.spawnNext();
        }
    }
}