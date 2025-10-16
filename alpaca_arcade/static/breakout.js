class ExampleScene extends Phaser.Scene {
    ball;
    paddle;
    preload() {
        this.load.image("ball", "/static/images/ball.png");
        this.load.image("paddle", "/static/images/paddle.png");
    }
    create() {
        this.ball = this.add.sprite(
            this.scale.width * 0.5,
            this.scale.height - 25,
            "ball",
        );
        this.physics.add.existing(this.ball);
        this.ball.body.setVelocity(150, -150);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.setBounce(1);
        this.paddle = this.add.sprite(
            this.scale.width * 0.5,
            this.scale.height - 5,
            "paddle",
        );
        this.paddle.setOrigin(0.5, 1);
        this.physics.add.existing(this.paddle);
        this.paddle.body.setImmovable(true);
    }
    update() {
        this.physics.collide(this.ball, this.paddle);
        this.paddle.x = this.input.x || this.scale.width * 0.5;
    }
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
    backgroundColor: 0x000157,
    physics: {
        default: "arcade",
    },
};

const game = new Phaser.Game(config);
