import { _decorator, Component, Node, Label, find, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

import BackgroundScroller from './BackgroundScroller';
import AudioManager from './AudioManager';
import GameManager from './GameManager';
import PlayerController from './PlayerController';
@ccclass('DeathScreen')
export default class DeathScreen extends Component {

    @property(Node)
    failUI: Node = null;      // экран с анимацией спрайта

    @property(Node)
    deathUI: Node = null;     // финальный экран со счётом

    @property(Node)
    failSprite: Node = null;  // спрайт внутри FailUI который увеличивается

    @property(Label)
    scoreLabel: Label = null; // Label в DeathUI

    @property
    animDuration: number = 1.2; // длительность анимации спрайта

    static instance: DeathScreen = null;

    onLoad() {
        DeathScreen.instance = this;
        console.log('[DeathScreen] висит на ноде:', this.node.name, '| путь:', this.node.getPathInHierarchy());
        if (this.failUI) this.failUI.active = false;
        if (this.deathUI) this.deathUI.active = false;
    }

    public show() {
        const scroller = find('Canvas/Background')?.getComponent(BackgroundScroller);
        const player = find('Canvas/Player');
        const controller = player?.getComponent(PlayerController);
        controller?.playAnim("idle")
        if (scroller) scroller.setSpeed(0);


        this.showFailAnimation();
    }

    showFailAnimation() {
        AudioManager.instance?.playFail();
        AudioManager.instance?.stopBGMusic();
        if (!this.failUI || !this.failSprite) {
            this.showDeathUI();
            return;
        }

        this.failUI.active = true;
        this.failSprite.setScale(0, 0, 1);

        // Спрайт увеличивается
        tween(this.failSprite)
            .to(this.animDuration * 0.6, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .to(this.animDuration * 0.2, { scale: new Vec3(0.95, 0.95, 1) }, { easing: 'sineOut' })
            .to(this.animDuration * 0.2, { scale: new Vec3(1.0, 1.0, 1) }, { easing: 'sineIn' })
            .call(() => {
                // Небольшая пауза — потом переключаем на DeathUI
                this.scheduleOnce(() => {
                    tween(this.failUI)
                        .to(0.3, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
                        .call(() => {
                            this.failUI.active = false;
                            this.failUI.setScale(1, 1, 1);
                            this.showDeathUI();
                        })
                        .start();
                }, 0.5);
            })
            .start();
    }


    showDeathUI() {
        if (!this.deathUI) return;

        if (this.scoreLabel) {
            this.scoreLabel.string = '$' + (GameManager.instance?.getScore() ?? 0);
        }

        this.deathUI.active = true;
        this.deathUI.setScale(0, 0, 1);

        tween(this.deathUI)
            .to(0.4, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }
}