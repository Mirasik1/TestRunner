import { _decorator, Component, Label, Node, screen } from 'cc';
const { ccclass, property } = _decorator;

import Spoing from './Spoing';

@ccclass('StartGameScaler')
export default class StartGameScaler extends Component {

    @property(Label)
    label: Label = null;

    @property(Node)
    cursor: Node = null;

    @property
    portraitFontSize: number = 40;

    @property
    landscapeFontSize: number = 60;

    @property
    portraitCursorScale: number = 0.3;

    @property
    landscapeCursorScale: number = 0.5;

    start() {
        this.updateScale();
        screen.on('orientation-change', this.onOrientationChange, this);
    }

    onDestroy() {
        screen.off('orientation-change', this.onOrientationChange, this);
    }

    onOrientationChange() {
        this.scheduleOnce(() => this.updateScale(), 0.1);
    }

    updateScale() {
        const size = screen.windowSize;
        const isPortrait = size.height >= size.width;

        if (this.label) {
            this.label.fontSize = isPortrait
                ? this.portraitFontSize
                : this.landscapeFontSize;
        }

        if (this.cursor) {
            const s = isPortrait
                ? this.portraitCursorScale
                : this.landscapeCursorScale;

            this.cursor.setScale(s, s, 1);
            const spoing = this.cursor.getComponent(Spoing);
            if (spoing) spoing.setBaseScale(s, s);
        }
    }
}