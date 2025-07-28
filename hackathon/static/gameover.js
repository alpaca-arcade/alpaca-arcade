export class GameWon extends HTMLElement {
    constructor(score, difficulty, hcaptcha) {
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
            case "custom":
                this.gameDifficulty = 3;
                break;
            default:
                console.error("Something went wrong.");
        }
        this.hcaptcha = hcaptcha;
    }
    connectedCallback() {
        const header = document.createElement("h2");
        header.textContent = "CONGRATS! You Won!"
        this.headerMessage = header;
        this.appendChild(header)
        const scoreDisplay = document.createElement("p");
        scoreDisplay.textContent = `Your time: ${this.gameScore} seconds`;
        this.scoreDisplay = scoreDisplay;
        this.appendChild(scoreDisplay);
        const statusMessage = document.createElement("p");
        this.appendChild(statusMessage);
        this.statusMessage = statusMessage;
        if (this.gameDifficulty == 3) {
            this.addCloseButton("I <3 Bootsweeper!");
        } else {
            this.checkHighScores();
        }
    }
    async checkHighScores() {
        this.statusMessage.textContent = "Checking high scores...";
        const url = `/hackathon/scores/?game=minesweeper&difficulty=${this.gameDifficulty}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const scores = await response.json();
            scores.sort((a, b) => a.time - b.time);
            if (scores.length > 0) {
                const longest = scores.at(-1).time;
                console.log(`longest: ${longest}`);
                console.log(`score: ${this.gameScore}`);
                if (scores.length < 20 || this.gameScore < longest) {
                    this.newHighScore();
                } else {
                    this.notHighScore();
                }
            } else {
                this.newHighScore();
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    newHighScore() {
        this.statusMessage.textContent = "You got a HIGH SCORE!";
        const form = document.createElement("form");
        this.highScoreForm = form;
        const label = document.createElement("label");
        label.textContent = "Enter a 3-letter name";
        label.setAttribute("for", "name");
        form.appendChild(label);
        const input = document.createElement("input");
        input.classList.add("neon-border");
        input.type = "text";
        input.id = "name";
        input.name = "name";
        input.setAttribute("minlength", "3");
        input.setAttribute("maxlength", "3");
        input.setAttribute("placeholder", "AAA");
        form.appendChild(input);
        const hcaptchaDiv = document.createElement("div");
        hcaptchaDiv.setAttribute("id", "hcaptcha");
        form.appendChild(hcaptchaDiv);
        const linebreak = document.createElement("br");
        form.appendChild(linebreak);
        const submit = document.createElement("input");
        submit.classList.add("dialog-button");
        submit.type = "submit";
        submit.value = "Submit";
        form.appendChild(submit);
        const formMessage = document.createElement("p");
        formMessage.classList.add("form-message");
        form.formMessage = formMessage;
        form.appendChild(formMessage);
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
            const hcapResponse = document.querySelector("#hcaptcha > iframe").getAttribute("data-hcaptcha-response");
            if (hcapResponse) {
                new FormData(form);
            } else {
                this.highScoreForm.formMessage.textContent = "Captcha is required.";
            }    
        });
        form.addEventListener("formdata", (event) => {
            const payload = new Object();
            payload["game"] = this.game;
            payload["difficulty"] = this.gameDifficulty;
            payload["score"] = this.gameScore;
            for (const entry of event.formData.entries()) {
                console.log("here");
                payload[entry[0]] = entry[1];
            }
            const validName = /^[A-Za-z]{3}$/.test(payload["name"]);
            if (validName) {
                this.sendScore(payload);
                this.highScoreForm.querySelector('input[type="submit"]').remove();
            }
            else {
                this.highScoreForm.formMessage.textContent = "Name must be three letters.";
            }
        });
    }
    validateName(name) {
        return /^[A-Za-z]{3}$/.test(str);
    }
    async sendScore(payload) {
        const resource = "/hackathon/scores/new";
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
            this.updateDisplay(payload, json);
        }
        catch (error) {
            console.error(`Fetch problem: ${error.message}`);
        }
    }
    updateDisplay(payload, json) {
        this.highScoreForm.remove();
        this.headerMessage.remove();
        if (json.saved) {
            this.statusMessage.textContent = "Your score was saved!";
        } else {
            this.statusMessage.textContent = "An error occurred and your score wasn't saved.";
        }
        this.addCloseButton("Awesome!");
    }
    notHighScore() {
        this.statusMessage.textContent = "You didn't make it onto the leaderboard this time!";
        this.addCloseButton("OK");
    }
    addCloseButton(text) {
        const closeButton = document.createElement("button");
        closeButton.classList.add("dialog-button");
        closeButton.textContent = text;
        closeButton.type = "button";
        closeButton.addEventListener("click", (event) => {
            document.querySelector("#end-game-modal").close();
            this.remove();
        });
        this.appendChild(closeButton);
    }
}
customElements.define("game-won", GameWon);


export class GameOver extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const header = document.createElement("h2");
        header.textContent = "Game Over";
        this.appendChild(header);
        const message = document.createElement("p");
        message.textContent = "You stepped on a mine. WOOPS!";
        this.appendChild(message);
        this.addCloseButton("Oh no!");
    }
    addCloseButton(text) {
        const closeButton = document.createElement("button");
        closeButton.textContent = text;
        closeButton.type = "button";
        closeButton.classList.add("dialog-button");
        closeButton.addEventListener("click", (event) => {
            document.querySelector("#end-game-modal").close();
            this.remove();
        });
        this.appendChild(closeButton);
    }
}
customElements.define("game-over", GameOver);
