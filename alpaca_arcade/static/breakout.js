class ExampleScene extends Phaser.Scene {
    ball;
    paddle;
    bricks;
    scoreText;
    score = 0;
    lives = 3;
    livesText;
    lifeLostText;
    preload() {
        this.load.image("ball", "/static/images/ball.png");
        this.load.image("paddle", "/static/images/paddle.png");
        this.load.image("brick", "/static/images/brick.png");
        this.load.spritesheet("wobble", "/static/images/wobble.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
    }
    create() {
        this.ball = this.add.sprite(
            this.scale.width * 0.5,
            this.scale.height - 25,
            "ball",
        );
        this.ball.anims.create({
            key: "wobble",
            frameRate: 24,
            frames: this.anims.generateFrameNumbers("wobble", {
                frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
            })
        });
        this.physics.add.existing(this.ball);
        this.ball.body.setVelocity(250, -250);
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
        const textStyle = { font: "18px Arial", fill: "#0095dd" };
        this.scoreText = this.add.text(5, 5, "Points: 0", textStyle);
        this.livesText = this.add.text(
            this.scale.width - 5,
            5,
            `Lives: ${this.lives}`,
            textStyle,
        );
        this.livesText.setOrigin(1, 0);
        this.lifeLostText = this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.5,
            "Life lost, click to continue",
            textStyle,
        );
        this.lifeLostText.setOrigin(0.5, 0.5);
        this.lifeLostText.visible = false;
    }
    update() {
        this.physics.collide(this.ball, this.paddle, (ball, paddle) => 
            this.hitPaddle(ball, paddle),
        );
        this.physics.collide(this.ball, this.bricks, (ball, brick) => 
            this.hitBrick(ball, brick),
        );
        this.paddle.x = this.input.x || this.scale.width * 0.5;
        const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
            this.physics.world.bounds,
            this.ball.getBounds(),
        );
        if (ballIsOutOfBounds) {
            this.ballLeaveScreen();
        }
        if (this.bricks.countActive() === 0) {
            alert("You won the game, congratulations!");
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
    hitPaddle(ball, paddle) {
        this.ball.anims.play("wobble");
    }
    hitBrick(ball, brick) {
        this.ball.anims.play("wobble");
        const destroyTween = this.tweens.add({
            targets: brick,
            ease: "Linear",
            repeat: 0,
            duration: 200,
            props: {
                scaleX: 0,
                scaleY: 0,
            },
            onComplete() {
                brick.destroy();
            },
        });
        destroyTween.play();
        this.score += 10;
        this.scoreText.setText(`Points: ${this.score}`);
    }
    ballLeaveScreen() {
        this.lives--;
        if (this.lives > 0) {
            this.livesText.setText(`Lives: ${this.lives}`);
            this.lifeLostText.visible = true;
            this.ball.body.reset(this.scale.width * 0.5, this.scale.height - 25);
            this.input.once(
                "pointerdown",
                () => {
                    this.lifeLostText.visible = false;
                    this.ball.body.setVelocity(250, -250);
                },
                this,
            );
        } else {
            location.reload();
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
