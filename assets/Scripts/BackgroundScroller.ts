import { _decorator, Component, Node, UITransform, view, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroller')
export default class BackgroundScroller extends Component {

    @property(Node)
    bgTemplate1: Node = null;

    @property(Node)
    bgTemplate2: Node = null;

    @property([Prefab])
    propPrefabs: Prefab[] = []; // перетащи сюда все 5-6 префабов

    @property
    scrollSpeed: number = 400;

    @property
    preloadCount: number = 2;

    @property
    propSpawnChance: number = 0.4; // шанс спавна пропа на один BG (0.0 - 1.0)

    @property
    propGroundY: number = -300; // Y земли для пропсов, подбери под сцену

    private bgNodes: Node[] = [];
    private bgWidth: number = 0;
    private frameIndex: number = 0;

    start() {
        const screenSize = view.getVisibleSize();

        const ui = this.bgTemplate1.getComponent(UITransform);
        this.bgWidth = ui ? ui.contentSize.width : screenSize.width;

        this.bgTemplate1.active = false;
        this.bgTemplate2.active = false;

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

        // Пробуем заспавнить проп на этом BG
        this.trySpawnProp(lastX);
    }

    trySpawnProp(bgX: number) {
        // Нет префабов или не выпал шанс — выходим
        if (this.propPrefabs.length === 0) return;
        if (Math.random() > this.propSpawnChance) return;

        // Случайный префаб
        const randomIndex = Math.floor(Math.random() * this.propPrefabs.length);
        const prop = instantiate(this.propPrefabs[randomIndex]);

        // Случайная X позиция внутри этого BG
        const randomOffsetX = (Math.random() * 0.6 + 0.2) * this.bgWidth; // от 20% до 80% ширины BG
        const propX = bgX + randomOffsetX - this.bgWidth / 2;

        prop.setPosition(propX, this.propGroundY, 0);
        this.node.addChild(prop);

        // Двигаем проп вместе с фоном — храним его отдельно
        // Привязываем к массиву bgNodes через userData
        this.bgNodes.push(prop);
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

    public setSpeed(speed: number) {
        this.scrollSpeed = speed;
    }
}