import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyMove')
export class EnemyMove extends Component {

    @property
    speed: number = 200;

    update(deltaTime: number) {
        const pos = this.node.position;


        this.node.setPosition(
            pos.x - this.speed * deltaTime,
            pos.y,
            pos.z
        );
    }
}