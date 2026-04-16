import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

import playable from './super_html_playable';

@ccclass('AdButton')
export default class PlayableButtons extends Component {

    // 🎮 просто старт (без ссылок)
    onStartClick() {
        console.log("Game Start");
    }

    // ⬇️ Кнопка DOWNLOAD
    onDownloadClick() {
        playable.download();
    }

    // 🏁 Кнопка END / FINISH
    onEndClick() {
        playable.game_end();
    }
}