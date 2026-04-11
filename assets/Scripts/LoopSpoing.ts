import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import Spoing from './Spoing';

@ccclass('LoopSpoing')
export default class LoopSpoing extends Component {

    @property
    interval: number = 0.7;

    private spoing: Spoing = null;
    private timer: number = 0;
    private nextTick: number = 0;

    start() {
        this.spoing = this.getComponent(Spoing);
        this.nextTick = 0.3;
    }

    update(deltaTime: number) {
        if (!this.spoing) return;
        this.timer += deltaTime;

        if (this.timer >= this.nextTick) {

            this.spoing.forcePlay();
            this.nextTick = this.timer + this.interval + this.spoing.duration;
        }
    }

    public stop() {
        this.enabled = false;
    }
}