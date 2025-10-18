class ExampleScene extends Phaser.Scene {
    ball;
    paddle;
    bricks;
    preload() {
        this.load.image("ball", "/static/images/ball.png");
        this.load.image("paddle", "/static/images/paddle.png");
        this.load.image("brick", "/static/images/brick.png");
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
        this.physics.world.checkCollision.down = false;
        this.initBricks();
    }
    update() {
        this.physics.collide(this.ball, this.paddle);
        this.paddle.x = this.input.x || this.scale.width * 0.5;
        const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
            this.physics.world.bounds,
            this.ball.getBounds(),
        );
        if (ballIsOutOfBounds) {
            alert("Game Over!");
            location.reload();
        }
    }
    initBricks() {
        const bricksLayout = {
            width: 50,
            height: 20,
            count: {
                row: 3,
                col: 12,
            },
            offset: {
                top: 50,
                left: 60,
            },
            padding: 10,
        }
        this.bricks = this.add.group();
        for (let c = 0; c < bricksLayout.count.col; c++) {
            for (let r = 0; r < bricksLayout.count.row; r++) {
                const brickX = c * (bricksLayout.width + bricksLayout.padding) + bricksLayout.offset.left;
                const brickY = r * (bricksLayout.height + bricksLayout.padding) + bricksLayout.offset.top;
                const newBrick = this.add.sprite(brickX, brickY, "brick");
                this.physics.add.existing(newBrick);
                newBrick.body.setImmovable(true);
                this.bricks.add(newBrick);
            }
        }
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
