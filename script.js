// Since jQuery CDN is used inside the head section, we're waiting for the whole document to load before executing JS(jQuery)

const defaultMaxScore = 50;

class Player {
    constructor() {
        this.score = 0;
        this.rollsPassed = 0;
    }
}

class Game {
    constructor(player1, player2, maxScore, maxRolls) {
        this.player1 = player1;
        this.player2 = player2;
        this.maxScore = maxScore;
        this.maxRolls = maxRolls;
        this.currentPlayer = player1;
        this.rollsPassed = 0;

        if(maxScore==="") 
            this.maxScore = defaultMaxScore;
    }

    static isGameStarted = false;
}

$(document).ready(() => {
    /* Toggling Theme */
    const btnToggleTheme = $("#btnToggleTheme");

    const toggleTheme = () => {
        const theme = $('body').hasClass('dark-theme') ? 'dark-theme' : 'light-theme';
        $(':root').css('--color-bottom', `var(--${theme}-color-bottom)`);
        $(':root').css('--color-middle', `var(--${theme}-color-middle)`);
        $(':root').css('--color-top', `var(--${theme}-color-top)`);
        $(':root').css('--color-text', `var(--${theme}-color-text)`);
    };

    btnToggleTheme.on("click", () => {
        $("body").toggleClass("dark-theme");
        toggleTheme();

        // Toggle button text 
        const buttonText = $("body").hasClass("dark-theme") ? "Light Theme" : "Dark Theme";
        btnToggleTheme.text(buttonText);
    });


    /***********     ACTUAL GAME LOGIC BEGINS HERE      ************/

    let game, player1, player2;

    addScore = (currentPlayer, diceScore) => {
        currentPlayer.score += diceScore;
    }

    updateUi = (currentPlayer, diceScore, currentPlayerScore) => {
        if(currentPlayer === player1) {
            $("#player1DiceScore").text(diceScore);
            $("#player1TotalScore").text(currentPlayerScore);
        } else {
            $("#player2DiceScore").text(diceScore);
            $("#player2TotalScore").text(currentPlayerScore);
        }
    }

    hasPlayerWonTheGame = (currentPlayer) => {
        if(currentPlayer.score >= game.maxScore) {
            // change the winner name to player1 or player2, depending on the current player
            if(currentPlayer === player1)
                $("#winner-name").text("Player1");
            else
                $("#winner-name").text("Player2");

            setTimeout(() => {
                // change the modal-container display to flex
                $(".modal-container").css({"display": "flex"});
            }, 1000);
        }
    }

    switchCurrentPlayer = (currentPlayer) => {
        const currPlayerId = currentPlayer === player1 ? "#player1Div" : "#player2Div";
        const nextPlayerId = currPlayerId === "#player1Div" ? "#player2Div" : "#player1Div";

        $(currPlayerId).removeClass("current-player");  
        $(nextPlayerId).addClass("current-player");

        if(currentPlayer === player1)
            game.currentPlayer = player2;
        else
            game.currentPlayer = player1;

    }

    updateCurrentPlayerRolls = (currentPlayer) => {
        currentPlayer.rollsPassed += 1;
    }

    updateGameRolls = () => {
        $("#rollsPassed").text(game.rollsPassed);
    }

    areMaxRollsOver = () => {
        // THERE IS COMMON FUNCTIONALITY BETWEEN THIS METHOD AND HASPLAYERWON METHOD
        if(game.rollsPassed >= game.maxRolls) {
            // change the winner name to player1 or player2, depending on the current player
            if(player1.score > player2.score) {
                $("#winner-name").text("Player1");
            } else if(player2.score > player1.score) {
                $("#winner-name").text("Player2");
            } else {
                $("#winner-name").text("None");
            }

            setTimeout(() => {
                // change the modal-container display to flex
                $(".modal-container").css({"display": "flex"});
            }, 1000);
        }
    }

    // when "Roll Dice" button is clicked
    $(".btnRollDice").on("click", () => {
        // capture the set values and create objects for only once
        if(!Game.isGameStarted) {
            maxScore = $("#maxScoreInput").val();
            maxRolls = $("#maxRollsInput").val();

            player1 = new Player();
            player2 = new Player();
            game = new Game(player1, player2, maxScore, maxRolls);

            Game.isGameStarted = true;
            
            if($("#maxScoreInput").val() === "")
                $("#maxScoreInput").val(defaultMaxScore);
        }
        // generate a random dice value from 1-6 and update the UI
        const diceResult = Math.floor(Math.random() * 6) + 1;
        $("#diceAudio")[0].play();

        // manually causing 1 second delay
        setTimeout(() => {
            $("#rolledDice").html(`<img  src="./assets/dice-${diceResult}.svg" alt="dice image" />`);
        }, 1000);

        // // check the current player
        if (game.currentPlayer === player1) {
            // add the score to the total score of current player
            addScore(game.currentPlayer, diceResult);

            // Get the current player's name
            const currentPlayerName = game.currentPlayer === player1 ? "player1" : "player2";

            // update the UI with updated scores
            updateUi(game.currentPlayer, diceResult, game.currentPlayer.score);

            // check current player has won the game
            hasPlayerWonTheGame(game.currentPlayer);

            // update current player's rolls and check
            updateCurrentPlayerRolls(game.currentPlayer);

            // // toggle current player
            switchCurrentPlayer(game.currentPlayer);
        } else if(game.currentPlayer === player2) {
            // add the score to the total score of current player
            addScore(game.currentPlayer, diceResult);

            // Get the current player's name
            const currentPlayerName = game.currentPlayer === player1 ? "player1" : "player2";

            // update the UI with updated scores
            updateUi(game.currentPlayer, diceResult, game.currentPlayer.score);

            // check current player has won the game
            hasPlayerWonTheGame(game.currentPlayer);

            // update current player's rolls and check
            updateCurrentPlayerRolls(game.currentPlayer);

            // // toggle current player
            switchCurrentPlayer(game.currentPlayer);

            // update rolls passed - this is done here since always player1 starts the game
            game.rollsPassed += 1;
            updateGameRolls();
        }

        // check whether maximum rolls over or not
        if(game.maxRolls !== "")
            areMaxRollsOver();
    });

    $(".btnNewGame").on("click", () => {
        location.reload();
    });
});