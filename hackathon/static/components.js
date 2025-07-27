export class GameWon extends HTMLElement {
    constructor(score, difficulty, hcaptcha) {
        console.log(`hcaptcha: ${hcaptcha}`);
        super()
        this.game = "minesweeper";
        this.gameScore = score;
		switch (difficulty) {
			case "easy":
			    this.gameDifficulty =  0;
                break;
            case "medium":
                this.gameDifficulty =  1;
                break;
            case "hard":
                this.gameDifficulty =  2;
                break;
            default:
                console.error("Something went wrong.");
        }
        this.hcaptcha = hcaptcha;
    }
    connectedCallback() {
        const header = document.createElement("h2");
        header.textContent = "CONGRATS! You Won!"
        this.appendChild(header)
        const scoreDisplay = document.createElement("p");
        scoreDisplay.textContent = `Your time: ${this.gameScore} seconds`;
        this.appendChild(scoreDisplay);
        const statusMessage = document.createElement("p");
        statusMessage.textContent = "Checking high scores...";
        this.appendChild(statusMessage);
        this.statusMessage = statusMessage;
        this.checkHighScores();
    }
    async checkHighScores() {
        const url = `/scores/?game=minesweeper&difficulty=${this.gameDifficulty}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const scores = await response.json();
            scores.sort((a, b) => a.value - b.value);
            const longest = scores.at(-1).time;
            console.log(`longest: ${longest}`);
            console.log(`score: ${this.gameScore}`);
            if (this.gameScore < longest) {
                this.statusMessage.textContent = "NEW HIGH SCORE";
                this.newHighScore();
            } else {
                this.gameOver();
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    newHighScore() {
        const form = document.createElement("form");
        this.highScoreForm = form;
        const label = document.createElement("label");
        label.textContent = "Enter a 3-letter name:";
        label.setAttribute("for", "name");
        form.appendChild(label);
        const input = document.createElement("input");
        input.type = "text";
        input.id = "name";
        input.name = "name";
        form.appendChild(input);
        const hcaptchaDiv = document.createElement("div");
        hcaptchaDiv.setAttribute("id", "hcaptcha");
        form.appendChild(hcaptchaDiv);
        const linebreak = document.createElement("br");
        form.appendChild(linebreak);
        const submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "submit";
        form.appendChild(submit);
        this.appendChild(form);
        this.hcaptcha.render(
            "hcaptcha",
            {
                sitekey: "ce7c55e8-26d2-4b54-a2d6-17acaf588408",
                theme: "dark",
            }
        );
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            new FormData(form);
        });
        form.addEventListener("formdata", (event) => {
            const payload = new Object();
            payload["game"] = this.game;
            payload["difficulty"] = this.gameDifficulty;
            payload["score"] = this.gameScore;
            for (const entry of event.formData.entries()) {
                payload[entry[0]] = entry[1];
            }
            // validName = validateName(payload["name"]) 
            const validName = true;
            if (validName) {
                this.sendScore(payload);
            }
            else {
                this.statusMessage.textContent = "Name must be three letters."
            }
        });
    }
    async sendScore(payload) {
        const resource = "/scores/new";
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }
        console.log(options);
        try {
            const response = await fetch(resource, options);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const json = await response.json();
            console.log(json);
            // this.updateDisplay(payload, json);
        }
        catch (error) {
            console.error(`Fetch problem: ${error.message}`);
        }
    }
    gameOver() {
        console.log("game over");
    }
}
customElements.define("game-won", GameWon);


export class GameOver extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.textContent = "game over";
    }
}
customElements.define("game-over", GameOver);
