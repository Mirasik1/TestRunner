import { _decorator, Component, Node, input, Input, EventTouch, EventMouse, screen, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export default class PlayerController extends Component {

    @property
    jumpForce: number = 1200;

    @property
    gravity: number = -2400;

    @property(Animation)
    animator: Animation = null;

    @property
    idleAnim: string = 'idle';

    @property
    runAnim: string = 'run';

    @property
    jumpAnim: string = 'jump';

    @property
    damageAnim: string = 'damage';

    private groundY: number = 0;
    private velocity: number = 0;
    private isGrounded: boolean = true;
    private isDead: boolean = false;
    private isRunning: boolean = false;
    private isDamaged: boolean = false;
    private isJumping: boolean = false;
    private jumpEnabled: boolean = true;

    public setJumpEnabled(enabled: boolean) {
        this.jumpEnabled = enabled;
    }

    start() {
        this.groundY = this.node.position.y;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        screen.on('orientation-change', this.onOrientationChange, this);

        this.playAnim(this.idleAnim);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        screen.off('orientation-change', this.onOrientationChange, this);
    }

    onOrientationChange() {
        this.node.setPosition(this.node.position.x, this.groundY, 0);
        this.velocity = 0;
        this.isGrounded = true;
        this.isJumping = false;
    }

    onTouchStart(event: EventTouch) { this.jump(); }
    onMouseDown(event: EventMouse) { this.jump(); }

    public startRunning() {
        this.isRunning = true;
        // Не перебиваем если сейчас прыжок
        if (!this.isJumping) {
            this.playAnim(this.runAnim);
        }
    }

    public jump() {
        if (!this.jumpEnabled) return;
        if (this.isGrounded && !this.isDead && !this.isDamaged) {
            this.velocity = this.jumpForce;
            this.isGrounded = false;
            this.isJumping = true;
            this.playAnim(this.jumpAnim);
        }
    }

    public takeDamage() {
        if (this.isDead || this.isDamaged) return;
        this.isDamaged = true;
        this.playAnim(this.damageAnim);

        this.animator.once(Animation.EventType.FINISHED, () => {
            this.isDamaged = false;
            this.updateAnim();
        }, this);
    }

    private updateAnim() {
        if (this.isDamaged || this.isDead) return;

        if (this.isJumping) return;

        if (this.isRunning) {
            this.playAnim(this.runAnim);
        } else {
            this.playAnim(this.idleAnim);
        }
    }

    public playAnim(name: string) {
        if (!this.animator) return;
        this.animator.play(name);
    }

    update(deltaTime: number) {
        if (this.isDead) return;

        this.velocity += this.gravity * deltaTime;
        const newY = this.node.position.y + this.velocity * deltaTime;
        this.node.setPosition(this.node.position.x, newY, 0);

        if (this.node.position.y <= this.groundY) {
            this.node.setPosition(this.node.position.x, this.groundY, 0);

            if (!this.isGrounded) {
                this.isGrounded = true;
                this.isJumping = false;
                this.velocity = 0;
                this.updateAnim();
            }
        }
    }

    public die() {
        this.isDead = true;
    }
}