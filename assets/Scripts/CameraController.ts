import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export default class CameraController extends Component {

    @property(Node)
    target: Node = null;

    @property
    offsetX: number = -200;

    @property
    smoothSpeed: number = 5;

    private fixedY: number = 0;

    start() {

        this.fixedY = this.node.position.y;
    }

    update(deltaTime: number) {
        if (!this.target) return;

        const targetX = this.target.position.x + this.offsetX;

        if (this.smoothSpeed <= 0) {
            this.node.setPosition(targetX, this.fixedY, this.node.position.z);
        } else {
            const newX = this.node.position.x + (targetX - this.node.position.x) * this.smoothSpeed * deltaTime;
            this.node.setPosition(newX, this.fixedY, this.node.position.z);
        }
    }
}