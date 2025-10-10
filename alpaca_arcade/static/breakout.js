class ExampleScene extends Phaser.Scene {
    ball;
    preload() {}
    create() {}
    update() {}
}

const config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 320,
    scene: ExampleScene,
	parent: document.querySelector(".breakout-container"),
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);
