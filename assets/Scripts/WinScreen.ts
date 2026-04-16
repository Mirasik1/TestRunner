import { _decorator, Component, Node, tween, Vec3, Label, find, ParticleSystem2D } from 'cc';
const { ccclass, property } = _decorator;

import BackgroundScroller from './BackgroundScroller';
import AudioManager from './AudioManager';
import GameManager from './GameManager';
@ccclass('WinScreen')
export default class WinScreen extends Component {

    @property(Node)
    winUI: Node = null;

    @property(Node)
    confettiLeft: Node = null;

    @property(Node)
    confettiRight: Node = null;
    @property(Node)
    background: Node = null;

    @property(Label)
    scoreLabel: Label = null;

    @property
    confettiDuration: number = 2.5;

    static instance: WinScreen = null;



    onLoad() {
        WinScreen.instance = this;
        if (this.winUI) this.winUI.active = false;
        if (this.confettiLeft) this.confettiLeft.active = false;
        if (this.confettiRight) this.confettiRight.active = false;
        if (this.background) this.background.active = false;
    }

    public show() {
        const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
        if (scroller) scroller.setSpeed(0);

        if (this.scoreLabel) {
            this.scoreLabel.string = '$' + (GameManager.instance?.getScore() ?? 0);
        }

        this.startConfetti();
    }

    startConfetti() {
        AudioManager.instance?.playConfetti();
        AudioManager.instance?.stopBGMusic();
        this.background.active = true;
        if (this.confettiLeft) {
            this.confettiLeft.active = true;
            this.confettiLeft.getComponent(ParticleSystem2D)?.resetSystem();
        }
        if (this.confettiRight) {
            this.confettiRight.active = true;
            this.confettiRight.getComponent(ParticleSystem2D)?.resetSystem();
        }

        this.scheduleOnce(() => {
            if (this.confettiLeft) this.confettiLeft.getComponent(ParticleSystem2D)?.stopSystem();
            if (this.confettiRight) this.confettiRight.getComponent(ParticleSystem2D)?.stopSystem();
            this.showWinUI();
        }, this.confettiDuration);
    }

    showWinUI() {
        if (!this.winUI) return;
        this.background.active = false;
        this.winUI.active = true;
        this.winUI.setScale(0, 0, 1);
        tween(this.winUI)
            .to(0.4, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }
}