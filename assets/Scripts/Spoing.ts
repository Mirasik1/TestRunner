import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Spoing')
export default class Spoing extends Component {

    @property
    intensity: number = 0.3;

    @property
    duration: number = 0.5;

    @property
    customScaleX: number = 0;

    @property
    customScaleY: number = 0;

    @property
    ignoreTimeScale: boolean = false;

    private originalScale: Vec3 = new Vec3(1, 1, 1);
    private isPlaying: boolean = false;

    start() {
        if (this.customScaleX !== 0 || this.customScaleY !== 0) {
            const sx = this.customScaleX !== 0 ? this.customScaleX : this.node.scale.x;
            const sy = this.customScaleY !== 0 ? this.customScaleY : this.node.scale.y;
            this.node.setScale(sx, sy, 1);
        }
        this.originalScale = this.node.scale.clone();
    }

    public play() {
        if (this.isPlaying) {
            Tween.stopAllByTarget(this.node);
            this.node.setScale(this.originalScale);
            this.isPlaying = false;
        }

        this.isPlaying = true;
        const s = this.originalScale;
        const i = this.intensity;
        const d = this.duration;

        const t = tween(this.node)
            .to(d * 0.15, { scale: new Vec3(s.x * (1 + i * 0.6), s.y * (1 - i * 0.4), 1) })
            .to(d * 0.15, { scale: new Vec3(s.x * (1 - i * 0.3), s.y * (1 + i * 0.6), 1) })
            .to(d * 0.12, { scale: new Vec3(s.x * (1 + i * 0.2), s.y * (1 - i * 0.15), 1) })
            .to(d * 0.12, { scale: new Vec3(s.x * (1 - i * 0.1), s.y * (1 + i * 0.2), 1) })
            .to(d * 0.10, { scale: new Vec3(s.x * (1 + i * 0.05), s.y * (1 - i * 0.05), 1) })
            .to(d * 0.10, { scale: s.clone() })
            .call(() => { this.isPlaying = false; });

        if (this.ignoreTimeScale) {
            t.start();

            (this.node as any)._tweens?.forEach((tw: any) => {
                if (tw) tw.target = this.node;
            });
        } else {
            t.start();
        }
    }

    public setBaseScale(x: number, y: number) {
        this.originalScale = new Vec3(x, y, 1);
        this.node.setScale(x, y, 1);
    }
    public forcePlay() {

    this.originalScale = this.node.scale.clone();

    this.isPlaying = false;
    this.play();
}
}