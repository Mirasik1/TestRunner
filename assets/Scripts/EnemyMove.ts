import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyMove')
export class EnemyMove extends Component {

    private baseSpeed: number = 200;
    private isPaused: boolean = false;
    private anim: Animation = null;

    pause() {
        this.isPaused = true;
        if (this.anim) {
            this.anim.pause();
        }
    }

    resume() {
        this.isPaused = false;
        if (this.anim) {
            this.anim.play();
        }
    }
    update(deltaTime: number) {
        if (this.isPaused) return;

        const pos = this.node.position;

        this.node.setPosition(
            pos.x - this.baseSpeed * deltaTime,
            pos.y,
            pos.z
        );
    }

}