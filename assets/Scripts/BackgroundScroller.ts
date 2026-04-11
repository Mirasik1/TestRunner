import { _decorator, Component, Node, UITransform, view, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundScroller')
export default class BackgroundScroller extends Component {

    @property(Node)
    bgTemplate1: Node = null;

    @property(Node)
    bgTemplate2: Node = null;

    @property([Prefab])
    propPrefabs: Prefab[] = [];

    @property([Prefab])
    coinPrefabs: Prefab[] = [];

    @property([Prefab])
    tutorialProbes: Prefab[] = [];

    @property([Prefab])
    gameProbes: Prefab[] = [];

    @property
    scrollSpeed: number = 900;

    @property
    preloadCount: number = 2;

    @property
    propMinDistance: number = 400;

    @property
    propMaxDistance: number = 900;

    @property
    coinMinDistance: number = 600;

    @property
    coinMaxDistance: number = 1400;

    @property
    probeMinDistance: number = 800;

    @property
    probeMaxDistance: number = 1600;

    @property
    propGroundY: number = -300;

    @property
    coinY: number = -200;

    @property
    probeY: number = -250;

    private bgNodes: Node[] = [];

    private propNodes: Node[] = [];
    private coinNodes: Node[] = [];
    private probeNodes: Node[] = [];

    private bgWidth: number = 0;
    private frameIndex: number = 0;

    private nextPropX: number = 0;
    private nextCoinX: number = 0;
    private nextProbeX: number = 0;

    private tutorialSpawned: number = 0;
    private tutorialDone: boolean = false;

    private lastPropRand: number = 0;
    private lastCoinRand: number = 0;
    private lastProbeRand: number = 0;

    start() {
        this.scrollSpeed = 0
        const screenSize = view.getVisibleSize();
        const ui = this.bgTemplate1.getComponent(UITransform);
        this.bgWidth = ui ? ui.contentSize.width : screenSize.width;

        this.bgTemplate1.active = false;
        this.bgTemplate2.active = false;

        this.nextPropX = this.bgWidth * 0.8;
        this.nextCoinX = this.bgWidth * 1.2;
        this.nextProbeX = this.bgWidth * 1.5;

        for (let i = 0; i < 1 + this.preloadCount; i++) {
            this.spawnNextBG();
        }
    }


    spawnNextBG() {
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

        const right = lastX + this.bgWidth;
        this.checkSpawnInRange(lastX, right);
    }

    checkSpawnInRange(from: number, to: number) {
        console.log(`[BG] range: ${from} → ${to} | nextProbeX: ${this.nextProbeX}`);

        while (this.nextPropX >= from && this.nextPropX < to) {
            this.spawnProp(this.nextPropX);
            this.nextPropX += this.pseudoRandom(this.propMinDistance, this.propMaxDistance, 'prop');
        }


        while (this.nextCoinX >= from && this.nextCoinX < to) {
            this.spawnCoin(this.nextCoinX);
            this.nextCoinX += this.pseudoRandom(this.coinMinDistance, this.coinMaxDistance, 'coin');
        }


        while (this.nextProbeX >= from && this.nextProbeX < to) {
            this.spawnProbe(this.nextProbeX);
            this.nextProbeX += this.pseudoRandom(this.probeMinDistance, this.probeMaxDistance, 'probe');
        }
    }


    spawnProp(x: number) {
        if (this.propPrefabs.length === 0) return;
        const container = this.spawnContainer();
        const idx = Math.floor(Math.random() * this.propPrefabs.length);
        const node = instantiate(this.propPrefabs[idx]);
        container.addChild(node);
        node.setPosition(x, this.propGroundY, 0);
        this.propNodes.push(node);
    }

    spawnCoin(x: number) {
        if (this.coinPrefabs.length === 0) return;
        const container = this.spawnContainer();
        const idx = Math.floor(Math.random() * this.coinPrefabs.length);
        const node = instantiate(this.coinPrefabs[idx]);
        container.addChild(node);
        node.setPosition(x, this.coinY, 0);
        this.coinNodes.push(node);
    }

    spawnProbe(x: number) {
        console.log(`[Probe] tutorialDone: ${this.tutorialDone}, tutorialSpawned: ${this.tutorialSpawned}, tutorialProbes.length: ${this.tutorialProbes.length}`);

        if (!this.tutorialDone) {
            if (this.tutorialProbes.length === 0) {
                console.warn('[Probe] tutorialProbes пустой!');
                return;
            }
            const idx = Math.min(this.tutorialSpawned, this.tutorialProbes.length - 1);
            console.log(`[Probe] Спавним tutorial[${idx}] на X: ${x}`);
            const node = instantiate(this.tutorialProbes[idx]);
            this.spawnContainer().addChild(node);
            node.setPosition(x, this.probeY, 0);
            this.probeNodes.push(node);

            this.tutorialSpawned++;
            if (this.tutorialSpawned >= this.tutorialProbes.length) {
                this.tutorialDone = true;
                console.log('[Probe] Туториал завершён!');
            }
            return;
        }

        if (this.gameProbes.length === 0) {
            console.warn('[Probe] gameProbes пустой!');
            return;
        }
        const idx = Math.floor(Math.random() * this.gameProbes.length);
        const node = instantiate(this.gameProbes[idx]);
        this.spawnContainer().addChild(node);
        node.setPosition(x, this.probeY, 0);
        this.probeNodes.push(node);
    }

    spawnContainer(): Node {
        return this.node.parent;
    }

    pseudoRandom(min: number, max: number, key: 'prop' | 'coin' | 'probe'): number {
        const last = key === 'prop' ? this.lastPropRand
            : key === 'coin' ? this.lastCoinRand
                : this.lastProbeRand;

        const range = max - min;
        const zone = Math.floor(last / (range / 3));
        let newZone = zone;
        while (newZone === zone) newZone = Math.floor(Math.random() * 3);

        const result = min + newZone * (range / 3) + Math.random() * (range / 3);
        const val = result - min;

        if (key === 'prop') this.lastPropRand = val;
        if (key === 'coin') this.lastCoinRand = val;
        if (key === 'probe') this.lastProbeRand = val;

        return result;
    }


    update(deltaTime: number) {
        const speed = this.scrollSpeed;
        const halfBG = this.bgWidth / 2;

        for (let i = this.bgNodes.length - 1; i >= 0; i--) {
            const bg = this.bgNodes[i];
            const newX = bg.position.x - speed * deltaTime;
            bg.setPosition(newX, 0, 0);
            if (newX + this.bgWidth < -halfBG) {
                bg.destroy();
                this.bgNodes.splice(i, 1);
            }
        }

        this.moveAndClean(this.propNodes, speed, deltaTime);

        this.moveAndClean(this.coinNodes, speed, deltaTime);

        this.moveAndClean(this.probeNodes, speed, deltaTime);

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