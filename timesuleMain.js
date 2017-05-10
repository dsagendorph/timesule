/**
 * Main class timesuleMain.js
 *
 * Game Controller
 *
 */

let config = require('./app/config/config.js');
let level1Obj = require('./app/js/Level1Controller');
let level2Obj = require('./app/js/Level2Controller');
let level3Obj = require('./app/js/Level3Controller');

// set the canvas
let canvas = document.getElementById("gameboard");
let context = canvas.getContext("2d");
let timer = 0;


canvas.height = 96*3+100;
canvas.width = 96*4;

// total score of the user playing all the three levels
let totalScore = 0;

// levels
let level = null;
let levelNum = 0;
let gamePlay = null;

// sounds
let step = document.getElementById("step.wav");
let move = document.getElementById("tick.mp3");
let levelWin = document.getElementById("level-win.wav");
let gameover = document.getElementById("gameover.wav");

// listen for the left , right, up , down key strokes
window.onkeydown = function(event) {
    if(event.keyCode === 37){
        level.board.avatarTurnLeft();
        move.play();
    }
    if(event.keyCode === 39){
        level.board.avatarTurnRight();
        move.play();
    }
    if(event.keyCode === 38){
        level.board.avatarGoUp();
        step.play();
    }
    if(event.keyCode === 40){
        level.board.avatarGoDown();
        step.play();
    }
};

// game levels
let setGameLevel = function(gameLevel) {

    switch ( gameLevel ) {
        case 1 :
		    document.getElementById("levelTitle").innerHTML = "TIMESULE LEVEL 1";
            levelNum = 1;
			canvas.height = 96*3;
			canvas.width = 96*4;
            level = new level1Obj.Level1Controller(context);
            context.fillStyle = config.timesuleConfig.level[levelNum-1].clock.fillStyle;
            context.font = config.timesuleConfig.level[levelNum-1].clock.font;
			document.getElementById("score").innerHTML = "Score:" + totalScore;
		    document.getElementById("timer").innerHTML = "Level Timer:" + timer;
		    levelWin.play();
		    alert("Welcome to LEVEL 1");
            break;
        case 2 :
		    document.getElementById("levelTitle").innerHTML = "TIMESULE LEVEL 2";
		    canvas.height = 96*5;
			canvas.width = 96*6;
            level = new level2Obj.Level2Controller(context);
            levelNum = 2;
            context.fillStyle = config.timesuleConfig.level[levelNum-1].clock.fillStyle;
            context.font = config.timesuleConfig.level[levelNum-1].clock.font;
			document.getElementById("score").innerHTML = "Score:" + totalScore;
		    document.getElementById("timer").innerHTML = "Level Timer:" + timer;
            levelWin.play();
            alert("Welcome to LEVEL 2");
            break;
        case 3 :
		    document.getElementById("levelTitle").innerHTML = "TIMESULE LEVEL 3";
		    canvas.height = 96*7;
			canvas.width = 96*8;
            level = new level3Obj.Level3Controller(context);
            levelNum = 3;
            context.fillStyle = config.timesuleConfig.level[levelNum-1].clock.fillStyle;
            context.font = config.timesuleConfig.level[levelNum-1].clock.font;
			document.getElementById("score").innerHTML = "Score:" + totalScore;
		    document.getElementById("timer").innerHTML = "Level Timer:" + timer;
            levelWin.play();
            alert("Welcome to LEVEL 3");
            break;
    }

};

// loop over the board
let gameLoop = function() {

    if ( level.board.timer >= 0 && level.board.getAvatarPosition().row !== 0 ) {

        // draw the Timer, only done here, so no need to refactor yet.
		document.getElementById("timer").innerHTML = "Level Timer:" + level.board.timer;

        //rotate the board
        level.board.rotate();
        // countdown to zero
        level.board.timer--;

    } else {


        level.board.timer++;
        level.board.score = level.board.timer;

        totalScore += level.board.score;
		document.getElementById("score").innerHTML = "Score:" + totalScore;
		document.getElementById("timer").innerHTML = "Level Timer:" + level.board.timer;

        clearInterval(gamePlay);
        if ( levelNum < config.timesuleConfig.level.length ) {
            levelNum++;
            setGameLevel(levelNum);
            gamePlay = setInterval(gameLoop,config.timesuleConfig.level[levelNum-1].interval*1000);
        } else {
            // Game over
            document.getElementById("score").innerHTML = "Score:" + totalScore;
            document.getElementById("timer").innerHTML = "Level Timer:" + level.board.timer;
            gameover.play();
            alert('Game Over!! Your score is '+totalScore +' !!');
        }
    }
};


// start with level 1
levelNum = 1;
level = new level1Obj.Level1Controller(context);
document.getElementById("levelTitle").innerHTML = "TIMESULE LEVEL 1";
context.fillStyle = config.timesuleConfig.level[levelNum-1].clock.fillStyle;
context.font = config.timesuleConfig.level[levelNum-1].clock.font;
document.getElementById("timer").innerHTML = "Level Timer:" + timer;
gamePlay = setInterval(gameLoop,config.timesuleConfig.level[levelNum-1].interval*1000);
