import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyMove')
export class EnemyMove extends Component {

    @property
    speed: number = 200; // скорость (пиксели в секунду)

    update(deltaTime: number) {
        const pos = this.node.position;

        // движение в -X
        this.node.setPosition(
            pos.x - this.speed * deltaTime,
            pos.y,
            pos.z
        );
    }
}