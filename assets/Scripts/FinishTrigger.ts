import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FinishTrigger')
export default class FinishTrigger extends Component {

    private triggered: boolean = false;

    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    onContact(self: Collider2D, other: Collider2D) {
        if (this.triggered) return;
        if (other.node.name !== 'Player') return;
        this.triggered = true;

    }


}