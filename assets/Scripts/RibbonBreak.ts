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

        if (this.rightPart) {
            const startPos = this.rightPart.position.clone();
            const startAngle = this.rightPart.angle;

            tween(this.rightPart)
                .to(this.fallDuration * 0.3, {
                    position: new Vec3(startPos.x + 30, startPos.y + 20, 0),
                    angle: startAngle + 10
                }, { easing: 'sineOut' })
                .to(this.fallDuration * 0.7, {
                    position: new Vec3(startPos.x + 60, startPos.y - this.fallDistance, 0),
                    angle: startAngle + this.rotationAngle
                }, { easing: 'cubicIn' })
                .call(() => {
                    if (this.rightPart) this.rightPart.active = false;
                    WinScreen.instance?.show();
                })
                .start();
        } else {
            WinScreen.instance?.show();
        }
    }

    public triggerBreak() {
        this.breakRibbon();
    }
}