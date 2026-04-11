import { _decorator, Component, Node, UITransform, view, instantiate, Prefab, Label, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroller')
export default class BackgroundScroller extends Component {

    @property(Node)
    bgTemplate1: Node = null;

    @property(Node)
    bgTemplate2: Node = null;

    @property([Prefab])
    tutorialPrefabs: Prefab[] = [];

    @property([Prefab])
    coinPrefabs: Prefab[] = [];

    @property([Prefab])
    enemyPrefabs: Prefab[] = [];

    @property(Prefab)
    finalLocationPrefab: Prefab = null;

    @property
    scrollSpeed: number = 900;

    @property
    preloadCount: number = 2;

    @property
    coinMinDistance: number = 600;

    @property
    coinMaxDistance: number = 1400;

    @property
    enemyMinDistance: number = 1200;

    @property
    enemyMaxDistance: number = 2400;

    @property
    enemySpawnChance: number = 0.3;

    @property
    coinY: number = -200;

    @property
    enemyY: number = -250;

    @property
    winScore: number = 600;
    @property
    tutorialDistance: number = 300;
    @property(Node)
    spawnContainer: Node = null;
    private nextTutorialX: number = 0;

    private bgNodes: Node[] = [];
    private coinNodes: Node[] = [];
    private enemyNodes: Node[] = [];

    private bgWidth: number = 0;
    private frameIndex: number = 0;

    // Порог за правым краем экрана — когда объект пересекает его, спавним
    private spawnEdgeX: number = 0;
    private nextCoinX: number = 0;
    private nextEnemyX: number = 0;

    private tutorialSpawned: number = 0;
    private tutorialDone: boolean = false;

    private spawningStopped: boolean = false;
    private finalSpawned: boolean = false;
    private coinLabel: Label = null;
    private finalNodes: Node[] = [];
    private getContainer(): Node {
        return this.spawnContainer || this.node.parent;
    }
    start() {
        const screenSize = view.getVisibleSize();
        const ui = this.bgTemplate1.getComponent(UITransform);
        this.bgWidth = ui ? ui.contentSize.width : screenSize.width;

        this.bgTemplate1.active = false;
        this.bgTemplate2.active = false;

        // Правый край экрана + запас
        this.spawnEdgeX = screenSize.width / 2 + 300;
        this.nextTutorialX = this.spawnEdgeX + 400;
        // Первые спавны — чуть дальше правого края
        this.nextCoinX = this.spawnEdgeX + 200;
        this.nextEnemyX = this.spawnEdgeX + 800;

        this.coinLabel = find('Canvas/UI/PaypalUI')?.getComponentInChildren(Label);

        for (let i = 0; i < 1 + this.preloadCount; i++) {
            this.spawnNextBG();
        }
    }

    getCurrentScore(): number {
        if (!this.coinLabel) {
            this.coinLabel = find('Canvas/UI/PaypalUI')?.getComponentInChildren(Label);
        }
        if (!this.coinLabel) return 0;
        const raw = this.coinLabel.string.replace('$', '').trim();
        return parseInt(raw) || 0;
    }

    spawnNextBG() {
    const template = this.frameIndex % 2 === 0 ? this.bgTemplate1 : this.bgTemplate2;
    this.frameIndex++;

    const clone = instantiate(template);
    clone.active = true;
    this.node.addChild(clone); // ← BG всегда в Background node

    const lastX = this.bgNodes.length > 0
        ? this.bgNodes[this.bgNodes.length - 1].position.x + this.bgWidth
        : 0;

    clone.setPosition(lastX, 0, 0);
    this.bgNodes.push(clone);
}

    spawnCoin(x: number) {

        if (!this.tutorialDone) {
            if (this.tutorialPrefabs.length === 0) return;
            if (this.nextTutorialX > this.spawnEdgeX) return; // ждём дистанцию

            const idx = Math.min(this.tutorialSpawned, this.tutorialPrefabs.length - 1);
            const node = instantiate(this.tutorialPrefabs[idx]);
            this.getContainer().addChild(node);
            node.setPosition(x, this.coinY, 0);
            this.coinNodes.push(node);
            this.tutorialSpawned++;
            this.nextTutorialX = this.spawnEdgeX + this.tutorialDistance;
            if (this.tutorialSpawned >= 3) this.tutorialDone = true;
            return;
        }

        if (this.coinPrefabs.length === 0) return;
        const idx = Math.floor(Math.random() * this.coinPrefabs.length);
        const node = instantiate(this.coinPrefabs[idx]);
        this.getContainer().addChild(node);
        node.setPosition(x, this.coinY, 0);
        this.coinNodes.push(node);
    }

    spawnEnemy(x: number) {
        if (!this.tutorialDone) return;
        if (this.enemyPrefabs.length === 0) return;
        if (Math.random() > this.enemySpawnChance) return;

        const idx = Math.floor(Math.random() * this.enemyPrefabs.length);
        const node = instantiate(this.enemyPrefabs[idx]);
        this.getContainer().addChild(node);
        node.setPosition(x, this.enemyY, 0);
        this.enemyNodes.push(node);
    }

    spawnFinalLocation() {
    if (this.finalSpawned || !this.finalLocationPrefab) return;
    this.finalSpawned = true;

    const node = instantiate(this.finalLocationPrefab);
    this.getContainer().addChild(node);
    node.setPosition(this.spawnEdgeX + 200, 0, 0);
    this.finalNodes.push(node);
}

update(deltaTime: number) {
    const speed = this.scrollSpeed;
    const halfBG = this.bgWidth / 2;

    // Таймеры двигаем только один раз
    this.nextCoinX -= speed * deltaTime;
    this.nextEnemyX -= speed * deltaTime;
    this.nextTutorialX -= speed * deltaTime;

    if (!this.spawningStopped) {
        if (this.getCurrentScore() >= this.winScore) {
            this.spawningStopped = true;
            const score = this.getCurrentScore();
            console.log(`Score: ${score} / ${this.winScore} | label: "${this.coinLabel?.string}"`);
    
            this.spawnFinalLocation();
        }

        if (this.nextCoinX <= this.spawnEdgeX) {
            this.spawnCoin(this.spawnEdgeX);
            this.nextCoinX = this.spawnEdgeX +
                this.coinMinDistance + Math.random() * (this.coinMaxDistance - this.coinMinDistance);
        }

        if (this.nextEnemyX <= this.spawnEdgeX) {
            this.spawnEnemy(this.spawnEdgeX);
            this.nextEnemyX = this.spawnEdgeX +
                this.enemyMinDistance + Math.random() * (this.enemyMaxDistance - this.enemyMinDistance);
        }
    }

    for (let i = this.bgNodes.length - 1; i >= 0; i--) {
        const bg = this.bgNodes[i];
        const newX = bg.position.x - speed * deltaTime;
        bg.setPosition(newX, 0, 0);
        if (newX + this.bgWidth < -halfBG) {
            bg.destroy();
            this.bgNodes.splice(i, 1);
        }
    }

    this.moveAndClean(this.coinNodes, speed, deltaTime);
    this.moveAndClean(this.enemyNodes, speed, deltaTime);
    this.moveAndClean(this.finalNodes, speed, deltaTime);

    const last = this.bgNodes[this.bgNodes.length - 1];
    if (last && last.position.x < this.bgWidth * this.preloadCount) {
        this.spawnNextBG();
    }
}

    moveAndClean(arr: Node[], speed: number, dt: number) {
        for (let i = arr.length - 1; i >= 0; i--) {
            const obj = arr[i];
            if (!obj || !obj.isValid) { arr.splice(i, 1); continue; }
            const newX = obj.position.x - speed * dt;
            obj.setPosition(newX, obj.position.y, 0);
            if (newX < -this.bgWidth) {
                obj.destroy();
                arr.splice(i, 1);
            }
        }
    }

    public setSpeed(speed: number) {
        this.scrollSpeed = speed;
    }
}