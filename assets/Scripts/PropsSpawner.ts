import { _decorator, Component, Node, Prefab, instantiate, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PropsSpawner')
export default class PropsSpawner extends Component {

    @property([Prefab])
    propPrefabs: Prefab[] = []; // перетащи сюда все prefab-ы (дерево, куст, фонарь)

    @property
    scrollSpeed: number = 400; // должна совпадать со скоростью фона

    @property
    minInterval: number = 200; // минимальное расстояние между объектами

    @property
    maxInterval: number = 500; // максимальное расстояние между объектами

    @property
    groundY: number = -300; // Y земли — подбери под свою сцену

    @property
    randomYRange: number = 20; // небольшой разброс по Y для хаоса

    private props: Node[] = [];
    private nextSpawnX: number = 0;

    start() {
        const screenWidth = view.getVisibleSize().width;
        // Первый спавн за правым краем экрана
        this.nextSpawnX = screenWidth / 2 + 200;
    }

    update(deltaTime: number) {
        // Двигаем все пропсы влево
        for (let i = this.props.length - 1; i >= 0; i--) {
            const prop = this.props[i];
            const newX = prop.position.x - this.scrollSpeed * deltaTime;
            prop.setPosition(newX, prop.position.y, 0);

            // Удаляем если ушли за левый край
            if (newX < -view.getVisibleSize().width / 2 - 200) {
                prop.destroy();
                this.props.splice(i, 1);
            }
        }

        // Двигаем точку следующего спавна влево тоже
        this.nextSpawnX -= this.scrollSpeed * deltaTime;

        // Спавним когда точка вошла в зону экрана + запас
        if (this.nextSpawnX < view.getVisibleSize().width / 2 + 100) {
            this.spawnProp();
        }
    }

    spawnProp() {
        if (this.propPrefabs.length === 0) return;

        // Случайный prefab из списка
        const randomIndex = Math.floor(Math.random() * this.propPrefabs.length);
        const prop = instantiate(this.propPrefabs[randomIndex]);

        // Небольшой разброс по Y
        const randomY = this.groundY + (Math.random() * this.randomYRange * 2 - this.randomYRange);

        prop.setPosition(view.getVisibleSize().width / 2 + 200, randomY, 0);
        this.node.addChild(prop);
        this.props.push(prop);

        // Следующий спавн через случайное расстояние
        this.nextSpawnX = view.getVisibleSize().width / 2 + 200 +
            this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
    }

    public setSpeed(speed: number) {
        this.scrollSpeed = speed;
    }
}