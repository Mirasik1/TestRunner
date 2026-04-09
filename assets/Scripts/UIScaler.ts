import { _decorator, Component, screen, view, ResolutionPolicy } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIScaler')
export default class UIScaler extends Component {

    private lastWidth: number = 0;
    private lastHeight: number = 0;

    start() {
        this.updateScale();
        screen.on('orientation-change', this.onOrientationChange, this);
    }

    onDestroy() {
        screen.off('orientation-change', this.onOrientationChange, this);
    }

    onOrientationChange() {
        // Ждём один кадр — браузер не сразу обновляет windowSize
        this.scheduleOnce(() => {
            this.updateScale();
        }, 0.1);
    }

    updateScale() {
        const size = screen.windowSize;

        // Защита от повторного вызова с теми же размерами
        if (size.width === this.lastWidth && size.height === this.lastHeight) return;
        this.lastWidth = size.width;
        this.lastHeight = size.height;

        const isPortrait = size.height >= size.width;

        if (isPortrait) {
            view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_WIDTH);
        } else {
            view.setDesignResolutionSize(1280, 720, ResolutionPolicy.FIXED_HEIGHT);
        }

        // Сбрасываем scale в 1 — никогда не накапливаем
        this.node.setScale(1, 1, 1);
    }
}