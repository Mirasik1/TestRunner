import { _decorator, Component, Node, input, Input, EventTouch, EventMouse, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export default class PlayerController extends Component {

    @property
    jumpForce: number = 1200;

    @property
    gravity: number = -2400;

    private groundY: number = 0;
    private velocity: number = 0;
    private isGrounded: boolean = true;
    private isDead: boolean = false;

    start() {
        this.groundY = this.node.position.y;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        screen.on('orientation-change', this.onOrientationChange, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        screen.off('orientation-change', this.onOrientationChange, this);
    }

    onOrientationChange() {
        // При смене ориентации — возвращаем игрока на землю
        this.node.setPosition(this.node.position.x, this.groundY, 0);
        this.velocity = 0;
        this.isGrounded = true;
    }

    onTouchStart(event: EventTouch) { this.jump(); }
    onMouseDown(event: EventMouse) { this.jump(); }

    jump() {
        if (this.isGrounded && !this.isDead) {
            this.velocity = this.jumpForce;
            this.isGrounded = false;
        }
    }

    update(deltaTime: number) {
        if (this.isDead) return;

        this.velocity += this.gravity * deltaTime;
        const newY = this.node.position.y + this.velocity * deltaTime;
        this.node.setPosition(this.node.position.x, newY, 0);

        if (this.node.position.y <= this.groundY) {
            this.node.setPosition(this.node.position.x, this.groundY, 0);
            this.velocity = 0;
            this.isGrounded = true;
        }
    }

    public die() { this.isDead = true; }
}