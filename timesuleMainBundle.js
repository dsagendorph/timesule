(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// all configs specific to Timesule is here

"use strict";


 const timesuleConfig = {

     height : 768,
     width :768,
     avatar : {

         turnleft : [
             {
                 imageFile : "character-l1.png"
             },
             {
                 imageFile : "character-l2.png"
             }
         ]

         ,
         turnRight : [
             {
                 imageFile : "character-r1.png"
             },
             {
                 imageFile : "character-r2.png"
             }
         ]

     },
     tile : {
         length : 96,
         width  : 96,
         specifics : [
                        {
                            imageFile : "tile-1.png"
                        },
                        {
                            imageFile : "tile-2.png"
                        },
                        {
                            imageFile : "tile-3.png"
                        },
                        {
                            imageFile : "tile-4.png"
                        },
                        {
                            imageFile : "tile-5.png"
                        },
                        {
                            imageFile : "tile-6.png"
                        },
                        {
                            imageFile : "tile-7.png"
                        },
                        {
                            imageFile : "tile-8.png"
                        }
                    ]
        },
     row : {
         minPosition : 0,
         maxPosition : 6
     },
     level : [
         {
             rowSize : 4,
             rows : 3,
             interval: 1,
             clock : {
                 maxTime : 15,
                 fillStyle : "#435a6b",
                 font : "italic 40pt Calibri"
             }
         },
         {
             rowSize : 6,
             rows : 5,
             interval : 1,
             clock : {
                 maxTime : 20,
                 fillStyle : "#435a6b",
                 font : "italic 40pt Calibri"
             }
         },
         {
             rowSize : 8,
             rows : 7,
             interval : 1,
             clock : {
                 maxTime : 45,
                 fillStyle : "#435a6b",
                 font : "italic 40pt Calibri"
             }
         }
     ]
 };


// Export the Objects from this Module
module.exports.timesuleConfig = timesuleConfig;

},{}],2:[function(require,module,exports){
/**
 * The Board object contains Rows that contain Tiles
 * Only one Board can exist.
 *
 */

'use strict';

let config = require('./../config/config.js');
let rowObj = require('./Row.js');
let utilsObj = require('./Utils.js');

/**
 * The Board Object that is called from various levels
 *
 * @param ContextObj
 * @param gameLevel
 * @constructor
 */
function Board(ContextObj, gameLevel ) {

    //private attributes
    let level = null;          // game level that the row is under.
    let avatarPosition = {
        row : null,
        tile : null,
        imageFile : null
    };

    //public attributes
    this.rowArr = [];           // Rows on the board.. 0th element is the bottom of the board.
    this.timer = null;          // timer for the board
    this.score = null;          // score for the board in this gameLevel

    //private functions
    // set the rows on the board starting from the bottom to the top.
    let setRows = function() {

        let rowArr = [];

        // iterate through the rows
        for ( let i = 0 ; i < config.timesuleConfig.level[level].rows; i++) {

            rowArr.push(new rowObj.Row(ContextObj,i,level));
        }

        // set the avatar on a random tile on the first row from the bottom
        let randomIndex = Math.floor(Math.random() * config.timesuleConfig.level[level].rowSize );
        rowArr[config.timesuleConfig.level[level].rows-1].tileArr[randomIndex].hasAvatar = true;

        //set the avatar position.
        avatarPosition.row =  config.timesuleConfig.level[level].rows-1;
        avatarPosition.tile = randomIndex;
        avatarPosition.imageFile = config.timesuleConfig.avatar.turnleft[1].imageFile;

        // render avatar, default turning towards left
        utilsObj.Utils.draw(
            ContextObj,
            avatarPosition.imageFile,
            avatarPosition.tile*config.timesuleConfig.tile.length,
            avatarPosition.row*config.timesuleConfig.tile.length
        );

        return rowArr;

    }; // End of setRows

    //validate level
    if ( typeof gameLevel === 'number' && gameLevel >= 0 && gameLevel < config.timesuleConfig.level.length ) {

        level = gameLevel;
        this.timer = config.timesuleConfig.level[level].clock.maxTime;
        this.score = 0;

    } else {

        throw new BoardException('Invalid gameLevel', 'gameLevel ' + gameLevel );
    }

    this.rowArr = setRows();

    //public functions
    // return the level of this board.
    this.getLevel = function() {

        return level;
    };

    //rotate the board, odd rows rotate left and even rows rotate right
    this.rotate = function() {

      for ( let row = 0; row < this.rowArr.length; row++) {

          // even row
          if ( (row % 2) === 0 ) {

              this.rowArr[row].rotateRight();

          } else {
          // odd row

              this.rowArr[row].rotateLeft();
          }

      }

        // render avatar
        utilsObj.Utils.draw(
            ContextObj,
            avatarPosition.imageFile,
            avatarPosition.tile*config.timesuleConfig.tile.length,
            avatarPosition.row*config.timesuleConfig.tile.width
        );
    };

    // return current avatar position, useful to overlay the art on the tile art.
    this.getAvatarPosition = function() {

        return avatarPosition;
    };

    this.avatarTurnLeft = function() {

        // tile position starts at 0. Only move left if it is 1 or greater.
        if(avatarPosition.tile > 0) {

            //set previous tile without avatar
            utilsObj.Utils.draw(
                ContextObj,
                this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].fill,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );

            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = false;
            avatarPosition.tile -= 1;
            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = true;

            // render avatar
            avatarPosition.imageFile = config.timesuleConfig.avatar.turnleft[1].imageFile;
            utilsObj.Utils.draw(
                ContextObj,
                avatarPosition.imageFile,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );
        }

    };

    this.avatarTurnRight = function() {

        // tile position starts at 0. Only move right if it is not on the last tile.
        if(avatarPosition.tile < this.rowArr[avatarPosition.row].tileArr.length-1) {

            //set previous tile without avatar
            utilsObj.Utils.draw(
                ContextObj,
                this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].fill,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );

            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = false;
            avatarPosition.tile += 1;
            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = true;

            // render avatar
            avatarPosition.imageFile = config.timesuleConfig.avatar.turnRight[1].imageFile;
            utilsObj.Utils.draw(
                ContextObj,
                avatarPosition.imageFile,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );
        }
    };

    this.avatarGoUp = function() {

        // make sure that the tiles align as well as tha the avatar is not on the top row.
        if(avatarPosition.row > 0 && avatarPosition.row < this.rowArr.length &&
           this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].fill ===
           this.rowArr[avatarPosition.row-1].tileArr[avatarPosition.tile].fill
        )
        {

            //set previous tile without avatar
            utilsObj.Utils.draw(
                ContextObj,
                this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].fill,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );

            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = false;
            avatarPosition.row -=1;
            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = true;

            utilsObj.Utils.draw(
                ContextObj,
                avatarPosition.imageFile,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );
        }
    };

    this.avatarGoDown = function() {

        // allow to go one row down only if the avatar is not on the last row and the first row
        // game is done if at the last row
        if(avatarPosition.row > 0 && avatarPosition.row < this.rowArr.length -1 )
        {

            //set previous tile without avatar
            utilsObj.Utils.draw(
                ContextObj,
                this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].fill,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );

            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = false;
            avatarPosition.row +=1;
            this.rowArr[avatarPosition.row].tileArr[avatarPosition.tile].hasAvatar = true;

            utilsObj.Utils.draw(
                ContextObj,
                avatarPosition.imageFile,
                avatarPosition.tile*config.timesuleConfig.tile.length,
                avatarPosition.row*config.timesuleConfig.tile.width
            );
        }
    };

} // End of Board Object

// Board exception Object
function BoardException ( value, message ) {

    let v = value;
    let m = message;
    this.toString = function() {
        return v +" "+ m;
    };

}  // End of BoardException Object

// test cases for Board Object, only valid within the block
{
    let ContextObj = null;

    // Row Test function
    let boardTester = function (ContextObj,gameLevel, supposedToPass) {

        var passed = false;

        try {
            let testBoard = new Board(ContextObj, gameLevel );
             // console.log(testBoard);
             // console.log(JSON.stringify(testBoard,null,2));
             testBoard.rotate();
             // console.log(testBoard);
             // console.log(JSON.stringify(testBoard,null,2));
             // console.log(testBoard.getAvatarPosition());
             testBoard.avatarTurnLeft();
             // console.log('Left ' + JSON.stringify(testBoard.getAvatarPosition()));
             // console.log(testBoard.getAvatarPosition());
             testBoard.avatarTurnRight();
             // console.log('Right ' + JSON.stringify(testBoard.getAvatarPosition()));
             // console.log(JSON.stringify(testBoard.getAvatarPosition()) + ' top row image -> ' + testBoard.rowArr[testBoard.getAvatarPosition().row+1].tileArr[testBoard.getAvatarPosition().tile].fill);
             testBoard.avatarGoUp();
             // console.log('Up ' + JSON.stringify(testBoard.getAvatarPosition()) + ' ' + testBoard.rowArr[testBoard.getAvatarPosition().row].tileArr[testBoard.getAvatarPosition().tile].fill);
             // console.log(testBoard.getAvatarPosition());
             testBoard.avatarGoDown();
             // console.log('Down ' + JSON.stringify(testBoard.getAvatarPosition()));

             passed = true;
        } catch (e) {

            if (e instanceof BoardException) {
                passed = false;
            } else {
                passed = false;
            }
        }

        if ( passed !== supposedToPass ) {
            throw new BoardException('Board Test Failed', 'gameLevel ' + gameLevel);
        }

    };

    // Test Cases , normal and abnormal
    boardTester(ContextObj,0,true);                                         // normal use case
    boardTester(ContextObj,config.timesuleConfig.level.length-1 ,true);     // normal use case
    boardTester(ContextObj,-1,false);                                       // abnormal use case
    boardTester(ContextObj,config.timesuleConfig.level.length ,false);      // abnormal use case




} // End of anonymous block

// Export the Objects from this Module
module.exports.Board = Board;
module.exports.BoardException = BoardException;

},{"./../config/config.js":1,"./Row.js":6,"./Utils.js":8}],3:[function(require,module,exports){
/**
 * Level1Controller object contains the Board that contains Rows that contain Tiles
 * Only one Board can exist.
 *
 *
 */

'use strict';

let config = require('./../config/config.js');
let boardObj = require('./Board.js');

/**
 * confines to level1
 *
 * @param ContextObj
 * @constructor
 */
function Level1Controller(ContextObj) {

    // public attributes
    this.board = new boardObj.Board(ContextObj,0);     // create the board



} // End Of Level1Controller


// Export the Objects from this Module
module.exports.Level1Controller = Level1Controller;
},{"./../config/config.js":1,"./Board.js":2}],4:[function(require,module,exports){
/**
 * Level2Controller object contains the Board that contains Rows that contain Tiles
 * Only one Board can exist.
 *
 *
 */

'use strict';

let config = require('./../config/config.js');
let boardObj = require('./Board.js');


function Level2Controller(ContextObj) {

    // public attributes
    this.board = new boardObj.Board(ContextObj,1);     // create the board



} // End Of Level2Controller


// Export the Objects from this Module
module.exports.Level2Controller = Level2Controller;
},{"./../config/config.js":1,"./Board.js":2}],5:[function(require,module,exports){
/**
 * Level3Controller object contains the Board that contains Rows that contain Tiles
 * Only one Board can exist.
 *
 *
 */

'use strict';

let config = require('./../config/config.js');
let boardObj = require('./Board.js');

/**
 * Confines to Level3
 *
 * @param ContextObj
 * @constructor
 */
function Level3Controller(ContextObj) {

    // public attributes
    this.board = new boardObj.Board(ContextObj,2);     // create the board



} // End Of Level3Controller


// Export the Objects from this Module
module.exports.Level3Controller = Level3Controller;
},{"./../config/config.js":1,"./Board.js":2}],6:[function(require,module,exports){
/**
 * The Row object is supposed to allocate tiles based on the
 * number of tiles allowed for the level
 *
 */

'use strict';


let config = require('./../config/config.js');
let tileObj = require('./Tile.js');
let utilsObj = require('./Utils.js');

/**
 * Creates a Row and handles Tiles on the Roa
 * @param ContextObj
 * @param rowPosition
 * @param gameLevel
 * @constructor
 */
function Row (ContextObj, rowPosition, gameLevel ) {

    //private attributes
    let position = null;       // position of this row on the board from bottom to top order.
    let level = null;          // game level that the row is under.


    //public attributes
    this.tileArr = [];         // Tiles in this row


    //private functions
    //shuffle an array . based on https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    let shuffleArray = function (array) {

        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
    // setting the tiles for the row and level.
    // returns a shuffled array of tiles.
    let setTiles = function() {

        let tileArr = [];

        for ( let i = 0; i < config.timesuleConfig.level[level].rowSize; i++ ) {

            tileArr.push(new tileObj.Tile(config.timesuleConfig.tile.length,config.timesuleConfig.tile.width));
            tileArr[i].hasAvatar = false;

            // create a high probability that a tile will align with the row above
            // so.. use the same second last tile as the last tile too
            if ( i >= config.timesuleConfig.level[level].rowSize -3 ) {

                tileArr[i].fill = config.timesuleConfig.tile.specifics[i].imageFile;
                i++;
                tileArr.push(new tileObj.Tile(config.timesuleConfig.tile.length,config.timesuleConfig.tile.width));
                tileArr[i].hasAvatar = false;
                tileArr[i].fill = config.timesuleConfig.tile.specifics[i-1].imageFile;
                i++;
                tileArr.push(new tileObj.Tile(config.timesuleConfig.tile.length,config.timesuleConfig.tile.width));
                tileArr[i].hasAvatar = false;
                tileArr[i].fill = config.timesuleConfig.tile.specifics[i-2].imageFile;
                i++;

            } else {

                tileArr[i].fill = config.timesuleConfig.tile.specifics[i].imageFile;

            }
        }

        return shuffleArray(tileArr);

    };

    // attribute validation
    //validate level
    if ( typeof gameLevel === 'number' && gameLevel >= 0 && gameLevel < config.timesuleConfig.level.length ) {

        level = gameLevel;
    } else {

        throw new RowException('Invalid gameLevel', 'gameLevel ' + gameLevel );
    }

    // rowPosition should be a number and within position range from config
    if ( typeof rowPosition === 'number' &&
        rowPosition >= config.timesuleConfig.row.minPosition &&
        rowPosition <= config.timesuleConfig.row.maxPosition &&
        rowPosition < config.timesuleConfig.level[level].rows
    ) {

        position = rowPosition;


    } else {

        throw new RowException('Invalid rowPosition', 'rowPosition ' + rowPosition );
    }

    // set the random tiles for this row in this level
    this.tileArr = setTiles();

    // Render it
    utilsObj.Utils.drawRowTiles(
        ContextObj,this.tileArr,
        position,
        config.timesuleConfig.tile.length,
        config.timesuleConfig.tile.width
    );

    //public functions
    // return the position of this row.
    this.getPosition = function() {

        return position;
    };

    // rotate the tiles to the left with a wrap around
    this.rotateLeft = function () {

        let index, newIndex = 0;

        // for each tile in the array, check if it has an avatar
        // if true, the current tile changes to false
        // and as long as this row rotates to the LEFT <--
        // the Avatar location will always be to the RIGHT -->
        for (index = 0; index < this.tileArr.length; index++) {
            if (this.tileArr[index].hasAvatar === true) {
                this.tileArr[index].hasAvatar = false;

                // if the avatar is NOT at the last tile of the row
                if (index !== this.tileArr.length -1 ) {
                    newIndex = index + 1;
                }
                // the avatar is at the last tile of the row
                // preventing avatar from going out of bounds
                // index = tileArr.length -- forLoop will stop iterating
                else {
                    newIndex = 0;
                }
                this.tileArr[newIndex].hasAvatar = true;
                index = this.tileArr.length;   // break out from the loop
            }
        }

        // tile rotates to the LEFT
        this.tileArr.push(this.tileArr.shift());

        // Render it
        utilsObj.Utils.drawRowTiles(
            ContextObj,this.tileArr,
            position,
            config.timesuleConfig.tile.length,
            config.timesuleConfig.tile.width
        );

    };//end of rotateLeft


    // rotate the tiles to the right with a wrap around
    this.rotateRight = function () {

        let index, newIndex;

        // for each tile in the array, check if it has an avatar
        // if true, the current tile changes to false
        // and as long as this row rotates to the RIGHT -->
        // the Avatar location will always be to the LEFT <--
        for (index = 0; index < this.tileArr.length; index++) {

            if (this.tileArr[index].hasAvatar === true) {
                this.tileArr[index].hasAvatar = false;

                // if the avatar is NOT at the first tile of the row
                if (index !== 0) {
                    newIndex = index - 1;
                }
                // the avatar is at the first tile of the row
                // preventing avatar from going out of bounds
                // index = 0 -- forLoop will stop iterating
                else {
                    newIndex = this.tileArr.length -1;
                }
                this.tileArr[newIndex].hasAvatar = true;
                index = this.tileArr.length;   // break out from the loop
            }
        }

        //rotate tile to the right
        this.tileArr.unshift(this.tileArr.pop());

        // Render it
        utilsObj.Utils.drawRowTiles(
            ContextObj,this.tileArr,
            position,
            config.timesuleConfig.tile.length,
            config.timesuleConfig.tile.width
        );

     };//end of rotateRight

} // end of Row Object

// Row exception Object
function RowException ( value, message ) {

    let v = value;
    let m = message;
    this.toString = function() {
        return v +" "+ m;
    };

}  // End of RowException Object

// test cases for Row Object, only valid within the block
{

    let ContextObj = null;

    // Row Test function
    let rowTester = function (ContextObj, rowPosition, gameLevel, supposedToPass) {

        var passed = false;

        try {
            let testRow = new Row( ContextObj, rowPosition, gameLevel );
            // console.log(testRow);
            passed = true;
        } catch (e) {
            if (e instanceof RowException) {
                passed = false;
            } else {
                passed = false;
            }
        }

        if ( passed !== supposedToPass ) {
            throw new RowException('Row Test Failed', 'rowPosition ' + rowPosition);
        }

    };

    let rotateTester = function ( rowTesterObj , currentAvatarPosition, rotateDirectionLeftOrRight,supposedToPass ) {

        var passed = false;

        try {

            if ( typeof currentAvatarPosition !== 'undefined' ) {

                rowTesterObj.tileArr[currentAvatarPosition].hasAvatar = true;   // set the current avatar position
            }

            // console.log(rowTesterObj);
            if ( rotateDirectionLeftOrRight === 'Left') {

                rowTesterObj.rotateLeft();

            } else if ( rotateDirectionLeftOrRight === 'Right') {

                rowTesterObj.rotateRight();
            }

            // check if the resulting avatar position is the same prior to the rotate
            if ( typeof currentAvatarPosition !== 'undefined' ) {

                if ( rowTesterObj.tileArr[currentAvatarPosition].hasAvatar === true ) {

                    passed = true;
                    // console.log(rowTesterObj);

                } else {

                    passed = false;
                    // console.log(rowTesterObj);
                }
            }  else {

                passed = true;
                // console.log(rowTesterObj);
            }



        } catch (e) {
            if (e instanceof RowException) {
                passed = false;
            } else {
                passed = false;
            }
        }

        if ( passed !== supposedToPass ) {
            throw new RowException('Rotate Test Failed', 'avatarPosition ' + currentAvatarPosition + ' '+ rotateDirectionLeftOrRight);
        }
    };

    rowTester(ContextObj, config.timesuleConfig.row.minPosition , 0, true);        // normal use case
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),-1,'Left',false); // abnormal use case , out of bounds , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),0,'Left',true); // normal use case , left end , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),1,'Left',true); // normal use case , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),2,'Left',true); // normal use case , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),3,'Left',true); // normal use case , right end , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),4,'Left',false); // abnormal use case , out of bounds , left rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),-1,'Right',false); // abnormal use case , out of bounds , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),0,'Right',true); // normal use case , left end , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),1,'Right',true); // normal use case , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),2,'Right',true); // normal use case , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),3,'Right',true); // normal use case , right end , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),4,'Right',false); // abnormal use case , out of bounds , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),undefined,'Left',true); // normal use case , unset , Right rotate
    rotateTester(new Row(ContextObj,config.timesuleConfig.row.minPosition , 0),undefined,'Right',true); // normal use case , unset , Right rotate
    rowTester(ContextObj,config.timesuleConfig.level[1].rows-1 , 1, true);        // normal use case
    rowTester(ContextObj,config.timesuleConfig.row.minPosition + 1 , 2, true);    // normal use case
    rowTester(ContextObj,config.timesuleConfig.level[0].rows-1 -1 , 0, true);     // normal use case
    rowTester(ContextObj,config.timesuleConfig.row.minPosition - 1 , 0 ,false);    // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.level[1].rows-1 + 1,  1, false);   // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.minPosition , -1, false);        // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.maxPosition , -1, false);        // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.minPosition + 1 , -2, false);    // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.maxPosition -1 , config.timesuleConfig.level.length+1, false);     // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.minPosition - 1 ,  config.timesuleConfig.level.length, false);    // abnormal use case
    rowTester(ContextObj,config.timesuleConfig.row.maxPosition + 1,  config.timesuleConfig.level.length, false);   // abnormal use case


} // End of anonymous block

// Export the Objects from this Module
module.exports.Row = Row;
module.exports.RowException = RowException;

},{"./../config/config.js":1,"./Tile.js":7,"./Utils.js":8}],7:[function(require,module,exports){
/**
 *  The Tile object is a fundamental object of the game
 *  The game board is made up of
 *  Rows that are made up of Tiles.
 */

"use strict";

/**
 * Basic tile object
 *
 * @param length
 * @param width
 * @constructor
 */
function Tile ( length, width ) {

    // private attributes
    // dimension is immutable after the object is instantiated.
    let dimension = {
        length : null, // length of the tile
        width : null  // width of the tile
    };

    // public attributes
    this.fill = null;      // the color attribute associated with the tile
    this.hasAvatar = false; // is the avatar on this tile


    // dimension should be number type and cannot be negative or zero
    if ( typeof length === 'number' && typeof width === 'number' && ( length * width ) > 0 && length > 0 ) {

        dimension.length = length;
        dimension.width = width;
    } else {

        throw new TileException('Invalid Dimension', 'Length ' + length + ' and Width ' + width);
    }

    // public function
    // return the size of the Tile.
    this.getSize = function() {

        return dimension
    };

} // End of Tile Object

// Tile exception Object
function TileException(value, message) {

    let v = value;
    let m = message;
    this.toString = function() {
        return v +" "+ m;
    };
}  // End of TileException Object

// test cases for Tile Object, only valid within the block
{

    // Tile Test function
    let tileTester = function (length, width, supposedToPass) {

        let passed = false;

        try {
            let testTile = new Tile(length, width);
            passed = true;
        } catch (e) {
            if (e instanceof TileException) {
                passed = false;
            } else {
                passed = false;
            }
        }

        if ( passed !== supposedToPass ) {
            throw new TileException('Tile Test Failed', 'Length ' + length + ' and Width ' + width);
        }

    };

    tileTester(150, 150, true);        // normal use case
    tileTester(0, 150, false);         // abnormal use case
    tileTester(150, 0, false);         // abnormal use case
    tileTester(0, 0, false);           // abnormal use case
    tileTester(-150, 150, false);      // abnormal use case
    tileTester(150, -150, false);      // abnormal use case
    tileTester(-150, -150, false);     // abnormal use case
    tileTester('a', 150, false);       // abnormal use case
    tileTester('a', -150, false);      // abnormal use case
    tileTester( -150, 'b', false);     // abnormal use case
    tileTester( 150, 'b', false);      // abnormal use case
    tileTester('a', 'b', false);       // abnormal use case

} // End of anonymous block

// Export the Objects from this Module
module.exports.Tile = Tile;
module.exports.TileException = TileException;

},{}],8:[function(require,module,exports){
/**
 * Utils is a static class and is a collection of utility functions that are used
 * throughout the app
 *
 */

'use strict';

function Utils() {}

/**
 * Draws the image on through the ContextObj which is from a Canvas
 * @param ContextObj
 * @param imageFileName
 * @param xpos
 * @param ypos
 */
Utils.draw = function ( ContextObj , imageFileName , xpos, ypos ) {

    if ( ContextObj !== null ) {

        ContextObj.drawImage(document.getElementById(imageFileName), xpos, ypos );
    }

};

Utils.drawRowTiles = function ( ContextObj , tileArr , rowPosition, tileLength, tileWidth) {

    // Render it
    for ( let i = 0; i < tileArr.length; i++ ) {

        Utils.draw(ContextObj,tileArr[i].fill, i*tileLength, rowPosition*tileWidth );

    }
};

module.exports.Utils = Utils;
},{}],9:[function(require,module,exports){
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

},{"./app/config/config.js":1,"./app/js/Level1Controller":3,"./app/js/Level2Controller":4,"./app/js/Level3Controller":5}]},{},[9]);
