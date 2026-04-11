import { _decorator, Component, AudioClip, AudioSource, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export default class AudioManager extends Component {

    @property(AudioClip)
    bgMusic: AudioClip = null;

    @property(AudioClip)
    jumpSound: AudioClip = null;

    @property(AudioClip)
    hitSound: AudioClip = null;

    @property(AudioClip)
    collectSound: AudioClip = null;

    @property(AudioClip)
    failSound: AudioClip = null;

    @property(AudioClip)
    confettiSound: AudioClip = null;

    @property
    bgVolume: number = 0.5;

    @property
    sfxVolume: number = 1.0;

    static instance: AudioManager = null;

    private bgSource: AudioSource = null;
    private sfxSource: AudioSource = null;

    onLoad() {
        AudioManager.instance = this;

        // Два AudioSource — один для музыки, один для sfx
        const sources = this.getComponents(AudioSource);
        this.bgSource = sources[0];
        this.sfxSource = sources[1];

        this.playBGMusic();
    }

    playBGMusic() {
        if (!this.bgSource || !this.bgMusic) return;
        this.bgSource.clip = this.bgMusic;
        this.bgSource.loop = true;
        this.bgSource.volume = this.bgVolume;
        this.bgSource.play();
    }

    private playSFX(clip: AudioClip) {
        if (!this.sfxSource || !clip) return;
        this.sfxSource.volume = this.sfxVolume;
        this.sfxSource.playOneShot(clip, this.sfxVolume);
    }

    public playJump()     { this.playSFX(this.jumpSound); }
    public playHit()      { this.playSFX(this.hitSound); }
    public playCollect()  { this.playSFX(this.collectSound); }
    public playFail()     { this.playSFX(this.failSound); }
    public playConfetti() { this.playSFX(this.confettiSound); }

    public stopBGMusic()  { this.bgSource?.stop(); }
    public pauseBGMusic() { this.bgSource?.pause(); }
    public resumeBGMusic(){ this.bgSource?.play(); }
}