import { _decorator, Component, Node, tween, Vec3, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

import WinScreen from './WinScreen';
import PlayerController from './PlayerController';
import { find } from 'cc';

@ccclass('RibbonBreak')
export default class RibbonBreak extends Component {

    @property(Node)
    leftPart: Node = null;

    @property(Node)
    rightPart: Node = null;

    @property
    fallDuration: number = 0.8;

    @property
    fallDistance: number = 400;

    @property
    rotationAngle: number = -60;

    private broken: boolean = false;

    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    onContact(self: Collider2D, other: Collider2D) {
        if (this.broken) return;
        if (other.node.name !== 'Player') return;
        this.breakRibbon();
    }

    breakRibbon() {
    if (this.broken) return;
    this.broken = true;

    const player = find('Canvas/Player');
    const controller = player?.getComponent(PlayerController);
    if (controller) controller.setJumpEnabled(false);

    // 🟥 Левая часть (крутится вокруг левого края)
    if (this.leftPart) {
        tween(this.leftPart)
            .to(this.fallDuration, {
                angle: -80 // вправо
            }, { easing: 'cubicIn' })
            .start();
    }

    // 🟦 Правая часть (крутится вокруг правого края)
    if (this.rightPart) {
        tween(this.rightPart)
            .to(this.fallDuration, {
                angle: 80 // влево
            }, { easing: 'cubicIn' })
            .call(() => {
                WinScreen.instance?.show();
            })
            .start();
    }
}


    public triggerBreak() {
        this.breakRibbon();
    }
}