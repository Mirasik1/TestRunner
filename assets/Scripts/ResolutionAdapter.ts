import { _decorator, Component, view, ResolutionPolicy, screen } from 'cc';
const { ccclass } = _decorator;

@ccclass('ResolutionAdapter')
export default class ResolutionAdapter extends Component {

    start() {
        this.updateResolution();

        // Слушаем смену ориентации
        screen.on('orientation-change', this.updateResolution, this);
    }

    onDestroy() {
        screen.off('orientation-change', this.updateResolution, this);
    }

    updateResolution() {
        const screenSize = screen.windowSize;
        const isPortrait = screenSize.height >= screenSize.width;

        if (isPortrait) {
            // Вертикально — 720x1280
            view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_WIDTH);
        } else {
            // Горизонтально — 1280x720
            view.setDesignResolutionSize(1280, 720, ResolutionPolicy.FIXED_HEIGHT);
        }
    }
}