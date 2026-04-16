import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeartUI')
export default class HeartUI extends Component {

    @property(Node)
    heart3: Node = null;

    @property(Node)
    heart2: Node = null;

    @property(Node)
    heart1: Node = null;

    @property(Node)
    heart3empty: Node = null;

    start() {
        this.setHP(3);
    }

    public setHP(hp: number) {
        this.heart3.active = false;
        this.heart2.active = false;
        this.heart1.active = false;
        this.heart3empty.active = false;

        if (hp >= 3) {
            this.heart3.active = true;
        } else if (hp === 2) {
            this.heart2.active = true;
            this.heart3empty.active = true;
        } else if (hp === 1) {
            this.heart1.active = true;
            this.heart3empty.active = true;
        } else {
            this.heart3empty.active = true;
        }
    }
}