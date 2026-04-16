import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import playable from './super_html_playable';

@ccclass('AdButton')
export default class PlayableButtons extends Component {

    @property(Node)
    ctaPanel: Node = null;

    onStartClick() {
        console.log("Game Start");
    }

    onDownloadClick() {
        console.log("Download");
    }

    onEndClick() {
        playable.game_end();
    }

}