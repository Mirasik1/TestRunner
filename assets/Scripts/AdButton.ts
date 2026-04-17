import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('AdButton')
export default class AdButton extends Component {

    private androidUrl: string = "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&pcampaignid=web_share";
    private iosUrl: string = "https://apps.apple.com/ua/app/minecraft/id479516143?l=ru";
    static instance: AdButton = null;

    onLoad() {
        AdButton.instance = this;
    }
    // просто сохраняет ссылки (если тебе надо менять динамически)
    public onStartClick() {
        const win: any = window;

        if (win.super_html) {
            win.super_html.google_play_url = this.androidUrl;
            win.super_html.appstore_url = this.iosUrl;
        }
    }

    // 👇 ВОТ ЭТО РЕАЛЬНОЕ НАЖАТИЕ
    public onDownloadClick() {
        const win: any = window;

        // SuperHTML / playable ads
        if (win.super_html) {
            win.super_html.download?.();
            return;
        }

        // обычный браузер (GitHub Pages)
        const ua = navigator.userAgent.toLowerCase();
        const url = ua.includes("android") ? this.androidUrl : this.iosUrl;

        window.open(url, "_blank", "noopener,noreferrer");
    }

    public onEndClick() {
        const win: any = window;
        win.super_html?.game_end?.();
    }
}