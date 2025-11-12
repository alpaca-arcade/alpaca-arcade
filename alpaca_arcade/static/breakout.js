import { GameWon, GameOver } from "/static/gameover.js"

class BreakoutScene extends Phaser.Scene {
    ball;
    paddle;
    bricks;
    scoreText;
    score;
    lives;
    livesText;
    lifeLostText;
    aiming;
    playingfalse;
    startButton;
    startText;
    preload() {
        this.load.image("ball", "/static/images/breakout_ball_15x15.svg");
        this.load.image("paddle", "/static/images/breakout_paddle_80x10.png");
        this.load.image("brick", "/static/images/breakout_brick_50x20.png");
        this.load.spritesheet("button", "/static/images/spritesheet_startbutton_120x120.png", {
            frameWidth: 120,
            frameHeight: 40,
        });
    }
    create() {
        this.aiming = false;
        this.playing = false;
        this.score = 0;
        this.lives = 3;
        this.ball = this.add.sprite(
            this.scale.width * 0.5,
            this.scale.height - 25,
            "ball",
        );
        this.physics.add.existing(this.ball);
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
        const textStyle = { font: "24px Bitcount", fill: "#54B435" };
        this.scoreText = document.querySelector(".game-metric.game-metric__points > .game-metric__value");
        this.scoreText.textContent = "0";
        this.livesText = document.querySelector(".game-metric.game-metric__lives > .game-metric__value");
        this.livesText.textContent = this.lives;
        this.lifeLostText = this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.5,
            "Life lost, click to continue",
            textStyle,
        );
        this.lifeLostText.setOrigin(0.5, 0.5);
        this.lifeLostText.visible = false;
        this.startButton = this.add.sprite(
            this.scale.width * 0.5,
            this.scale.height * 0.5,
            "button",
            0,
        );
        this.startButton.setInteractive();
        this.startButton.on(
            "pointerover",
            () => {
                this.startButton.setFrame(1);
            },
            this,
        );
        this.startButton.on(
            "pointerdown",
            () => {
                this.startButton.setFrame(2);
            },
            this,
        );
        this.startButton.on(
            "pointerout",
            () => {
                this.startButton.setFrame(0);
            },
            this,
        );
        this.startButton.on(
            "pointerup",
            () => {
                this.aimBall();
            },
            this,
        );
        this.startText = this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.5,
            "Click anywhere to start",
            textStyle,
        );
        this.startText.setOrigin(0.5, 0.5);
        this.startText.visible = false;
        this.input.keyboard.on("keydown-W", (event) => {
            this.bricks.clear(true);
        });
    }
    update() {
        this.physics.collide(this.ball, this.paddle, (ball, paddle) => 
            this.hitPaddle(ball, paddle),
        );
        this.physics.collide(this.ball, this.bricks, (ball, brick) => 
            this.hitBrick(ball, brick),
        );
        if (this.aiming) {
            this.paddle.x = this.input.x || this.scale.width * 0.5;
            this.ball.x = this.input.x || this.scale.width * 0.5;
        }
        if (this.playing) {
            this.paddle.x = this.input.x || this.scale.width * 0.5;
        }
        const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
            this.physics.world.bounds,
            this.ball.getBounds(),
        );
        if (ballIsOutOfBounds) {
            this.ballLeaveScreen();
        }
        if (this.bricks.countActive() === 0) {
            const modal = document.getElementById("end-game-modal");
            modal.classList.add("breakout-modal");
            modal.innerHTML = "";
            modal.show();
            modal.appendChild(new GameWon(this.score, null, hcaptcha, this));
            this.scene.pause();
        }
    }
    initBricks() {
        const bricksLayout = {
            width: 50,
            height: 20,
            count: {
                row: 3,
                col: 15,
            },
            offset: {
                top: 40,
                left: 50,
            },
            padding: 0,
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
        if (ball.x < paddle.x - paddle.displayWidth / 10 || ball.x > paddle.x + paddle.displayWidth / 10) {
            this.ball.body.velocity.x = -5 * (paddle.x - ball.x);
        }
    }
    hitBrick(ball, brick) {
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
        this.scoreText.textContent = `${this.score}`
    }
    ballLeaveScreen() {
        this.lives--;
        if (this.lives > 0) {
            this.livesText.textContent = this.lives;
            this.lifeLostText.visible = true;
            this.aiming = true;
            this.ball.body.reset(this.scale.width * 0.5, this.scale.height - 25);
            this.input.once(
                "pointerdown",
                () => {
                    this.lifeLostText.visible = false;
                    this.aiming = false;
                    this.ball.body.setVelocity(0, -250);
                },
                this,
            );
        } else {
            const modal = document.getElementById("end-game-modal");
            modal.classList.add("breakout-modal");
            modal.innerHTML = "";
            modal.show();
            modal.appendChild(new GameOver(this));
            this.scene.pause();
        }
    }
    aimBall() {
        this.startButton.destroy();
        this.startText.visible = true;
        this.aiming = true;
        this.input.once(
            "pointerdown",
            () => {
                this.startText.visible = false;
                this.startGame()
            },
            this,
        );
    }
    startGame() {
        this.aiming = false;
        this.ball.body.setVelocity(0, -250);
        this.playing = true;
    }
}

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: BreakoutScene,
	parent: document.querySelector(".game-container__phaser-breakout"),
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: 0x000517,
    physics: {
        default: "arcade",
    },
};


const game = new Phaser.Game(config);


// TODO
// - Game won flow
// - Leaderboard
// - Fix status message position for breakout high score error form (e.g. captcha failed)
