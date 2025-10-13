class ExampleScene extends Phaser.Scene {
    ball;
    preload() {
        this.load.image("ball", "/static/images/ball.png");
    }
    create() {
        this.ball = this.add.sprite(50, 50, "ball");
        this.physics.add.existing(this.ball);
        this.ball.body.setVelocity(150, 150);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
    }
    update() {}
}

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: ExampleScene,
	parent: document.querySelector(".breakout-container"),
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: "#eeeeee",
    physics: {
        default: "arcade",
    },
};

const game = new Phaser.Game(config);
