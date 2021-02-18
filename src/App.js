import React from 'react';
import './App.css';
import Greeting from './components/greeting';
import Taken from './components/taken';
import Piece from './components/piece';
import Turn from './components/turn';

      /*
        LEGEND for peices below:
        -1 = empty space;
        0 = black pawn;
        1 = black rook;
        2 = black knight;
        3 = black bishop;
        4 = black king;
        5 = black queen;
        6 = white pawn;
        7 = white rook;
        8 = white knight;
        9 = white bishop;
        10 = white king;
        11 = white queen;
        */

        /* I think 
        I may need to overhaul this entire program
        it might be easier is all pieces constantly calculate their own possible paths at every moment. 
        this way, when I come to the rules involving the king/blocking check etc. 
        it will be easier to plot. which moves to allow and not allow are diffuclt to code. For example,
        how do I allow for a block? I can code the possible moves for a king, and then if every single piece has a path I can make it so that the king
        cannot move into the path of an enemy piece. 

      every move must have:
      
      1) king danger check at the top: is the king in the path of another piece?
      if so, 
      2) king danger two... 
      can you move the king to safety, block or capture the offending piece??
      no? CHECKMATE BABY
      if yes then you must make one of those moves

      ^^^ so this means I WILL have to include some code to calculate different possible future moves


      minor bog list (to be fixed at the end):

      1) sometimes, when 'undoing' a bunch of moves/captures, an inaccurate amount of points will be calculated out of nowhere in the score,
      even though no pieces are displayed... perhaps from negative values being calulated in the code somewhere??? find out on the next episode of dbz

      2) when deleting pieces, if you select one and delete a different one, both the piece currently selected and the pieced you meant to delete are 
      deleted, only for white, not for black VERY CURIOUS

      3) CLEAN UP THE RECURIVE FUNCTIONS INVOLVED IN THE CHECK MECHANIC, they are a little sloppy. It takes the queen sometimes almost a full second to calculate all of her moves



        */

                               //  [0, 1, 2, 3, 4, 5, 6, 7,
                               //  8, 9, 10, 11, 12, 13, 14, 15,
                              //  16, 17, 18, 19, 20, 21, 22, 23,
                              //  24, 25, 26, 27, 28, 29, 30, 31,
                              //  32, 33, 34, 35, 36, 37, 38, 39,
                              //  40, 41, 42, 43, 44, 45, 46, 47,
                              //  48, 49, 50, 51, 52, 53, 54, 55,
                              //  56, 57, 58, 59, 60, 61, 62, 63]

                              //NOTES

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWhiteTurn: true,
      board: [1,2,3,5,4,3,2,1,                     
        0,0,0,0,0,0,0,0,                          
        -1,-1,-1,-1,-1,-1,-1,-1,                  
        -1,-1,-1,-1,-1,-1,-1,-1,                  
        -1,-1,-1,-1,-1,-1,-1,-1,                  
        -1,-1,-1,-1,-1,-1,-1,-1,                  
        6,6,6,6,6,6,6,6,                          
        7,8,9,11,10,9,8,7                         
      ],
      history: [],
      redoLib: [],
      boardSquares: Array.from(Array(64).keys()),
      focusPiece: Array.from(Array(64).keys()).map(x => false),
      touchMove: false,
      chosenPiece: '',
      lastIndex: '',
      captured: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      grab: false,
      playmode: false,
      count: 0,
      //all of the direction pieces in state are from white's perspective
      leftEdge: [0, 8, 16, 24, 32, 40, 48, 56],
      rightEdge: [7, 15, 23, 31, 39, 47, 55, 63],
      backEdge: [0, 1, 2, 3, 4, 5, 6, 7],
      frontEdge: [56, 57, 58, 59, 60, 61, 62, 63],
      chosenPath: [],
      canMove: Array.from(Array(64).keys()).map(x => -1),
      color: ['light', 'dark'],
      firstToggle: true,
      blackKingMoved: true,
      blackKingRookMoved: true,
      blackQueenRookMoved: true,
      whiteKingMoved: true,
      whiteKingRookMoved: true,
      whiteQueenRookMoved: true

    }
  this.togglePlay = this.togglePlay.bind(this)
  this.grab = this.grab.bind(this)
  this.counter = this.counter.bind(this)
  this.move = this.move.bind(this)
  this.unhand = this.unhand.bind(this)
  this.queenPawn = this.queenPawn.bind(this)
  this.enpassant = this.enpassant.bind(this)
  this.captured = this.captured.bind(this)
  this.clear = this.clear.bind(this)
  this.reset = this.reset.bind(this)
  this.wPawn = this.wPawn.bind(this)
  this.bPawn = this.bPawn.bind(this)
  this.bishop = this.bishop.bind(this)
  this.knight = this.knight.bind(this)
  this.rook = this.rook.bind(this)
  this.queen = this.queen.bind(this)
  this.king = this.king.bind(this)
  this.undo = this.undo.bind(this)
  this.getCap = this.getCap.bind(this)
  this.capCheck = this.capCheck.bind(this)
  this.redo = this.redo.bind(this)
  this.colorChange = this.colorChange.bind(this)
  this.allPaths = this.allPaths.bind(this)
  this.inCheck = this.inCheck.bind(this)
  this.isCheck = this.isCheck.bind(this)
  this.canCastleKing = this.canCastleKing.bind(this)
  this.canCastleQueen = this.canCastleQueen.bind(this)
  this.castle = this.castle.bind(this)
  this.endGame = this.endGame.bind(this)
  }


  //lifecycle methods

  /*static getDerivedStateFromProps(props, state) { 
    console.log(state.count, state.history)
    return {
       count: state.count++ // figured out how to run all possible moves and put it into state
       //every time state updates... now we need an algo for calclating all possible moves on the 
       //board xP
    }
 }  */


//piece movers

wPawn = (n, layered = false, board = this.state.board) => {
  let path = [];
  if (board[n-8] === -1)
  path.push(n-8);
  if (board[n-7] !== -1 & !(this.state.rightEdge.includes(n)) & (board[n-7] > -1 & board[n-7] < 6)) {
    path.push(n-7)
  }
  if ((board[n-9] !== -1 & !(this.state.leftEdge.includes(n))) & (board[n-9] > -1 & board[n-9] < 6)) {
    path.push(n-9)
  }
  if (n > 47 & n < 56 & board[n-16] === -1) {
    path.push(n-16);
  }
  if (board[n] === 6) {console.log("between the heys is epawn" + path + "HEY");}

  if (!layered) {
    path = this.isCheck(n, path);}

  console.log('this should have nothing in it??' + path)

  return path;
}

bPawn = (n, layered = false, board = this.state.board) => {
  let path = [];
  if (board[n+8] === -1)
  path.push(n+8);
  if (board[n+7] !== -1 & !(this.state.leftEdge.includes(n)) & board[n+7] > 5 & board[n+7] < 12) {
    path.push(n+7)
  }
  if (board[n+9] !== -1 & !(this.state.rightEdge.includes(n)) & board[n+9] > 5 & board[n+9] < 12) {
    path.push(n+9)
  }
  if (n > 7 & n < 16 & board[n+16] === -1) {
    path.push(n+16);
  }
  if (board[n] === 0) {console.log(path);}

  if (!layered) {
    path = this.isCheck(n, path); }

  return path;
}

bishop = (n, w, b, layered = false, board = this.state.board) => {

  let bpath = []; 

  let lineOne = true;
  let p = n;
  let q = n;
  let r = n;
  let s = n;

  if (this.state.frontEdge.includes(n) | this.state.leftEdge.includes(n)) {
    lineOne = false;
  }

while (lineOne === true) {

     p = p + 7;

    if (p<0 | p>63){
      lineOne = false;
    }

    else if ((board[n] === b & ((board[p] >= 0 & board[p] < 6) & board[p] !== 2.5)) | (board[n] === w & ((board[p] >= 6 & board[p] < 12) & board[p] !== 7.5))) {
      lineOne = false
    }

    else if ((board[n] === w & ((board[p] >= 0 & board[p] < 6) & board[p] !== 2.5)) | (board[n] === b & ((board[p] >= 6 & board[p] < 12) & board[p] !== 7.5))) {
      bpath.push(p)
      lineOne = false
    }

    else if (this.state.leftEdge.includes(p) | this.state.rightEdge.includes(p) | this.state.frontEdge.includes(p) | this.state.backEdge.includes(p)) {
      bpath.push(p)
      lineOne = false
    }

    else {
      bpath.push(p)
    }
}

let lineTwo = true;

if (this.state.backEdge.includes(n) | this.state.rightEdge.includes(n)) {
    lineTwo = false;
  }

while (lineTwo === true) {

    q = q - 7;

    if (q<0 | q>63){
      lineTwo = false;
    }

    else if ((board[n] === b & ((board[q] >= 0 & board[q] < 6) & board[q] !== 2.5)) | (board[n] === w & ((board[q] >= 6 & board[q] < 12) & board[q] !== 7.5))) {
      lineTwo = false
    }

    else if ((board[n] === w & ((board[q] >= 0 & board[q] < 6) & board[q] !== 2.5)) | (board[n] === b & ((board[q] >= 6 & board[q] < 12) & board[q] !== 7.5))) {
      bpath.push(q)
      lineTwo = false
    }

    else if (this.state.leftEdge.includes(q) | this.state.rightEdge.includes(q) | this.state.frontEdge.includes(q) | this.state.backEdge.includes(q)) {
      bpath.push(q)
      lineTwo = false
    }

    else {
      bpath.push(q)
    }
}

let lineThree = true;

if (this.state.backEdge.includes(n) | this.state.leftEdge.includes(n)) {
    lineThree = false;
  }

while (lineThree === true) {

    r = r - 9;

    if (r<0 | r>63){
      lineThree = false;
    }

    else if ((board[n] === b & ((board[r] >= 0 & board[r] < 6) & board[r] !== 2.5)) | (board[n] === w & ((board[r] >= 6 & board[r] < 12) & board[r] !== 7.5))) {
      lineThree = false
    }

    else if ((board[n] === w & ((board[r] >= 0 & board[r] < 6) & board[r] !== 2.5)) | (board[n] === b & ((board[r] >= 6 & board[r] < 12) & board[r] !== 7.5))) {
      bpath.push(r)
      lineThree = false
    }

    else if (this.state.leftEdge.includes(r) | this.state.rightEdge.includes(r) | this.state.frontEdge.includes(r) | this.state.backEdge.includes(r)) {
      bpath.push(r)
      lineThree = false
    }

    else {
      bpath.push(r)
    }
}

let lineFour = true;

if (this.state.frontEdge.includes(n) | this.state.rightEdge.includes(n)) {
    lineFour = false;
  }

while (lineFour === true) {

     s = s + 9;

    if (s<0 | s>63){
      lineFour = false;
    }

    else if ((board[n] === b & ((board[s] >= 0 & board[s] < 6) & board[s] !== 2.5)) | (board[n] === w & ((board[s] >= 6 & board[s] < 12) & board[s] !== 7.5))) {
      lineFour = false;
    }

    else if ((board[n] === w & ((board[s] >= 0 & board[s] < 6) & board[s] !== 2.5)) | (board[n] === b & ((board[s] >= 6 & board[s] < 12) & board[s] !== 7.5))) {
      bpath.push(s);
      lineFour = false;
    }

    else if (this.state.leftEdge.includes(s) | this.state.rightEdge.includes(s) | this.state.frontEdge.includes(s) | this.state.backEdge.includes(s)) {
      bpath.push(s);
      lineFour = false;
    }

    else {
      bpath.push(s)
    }
}
if (b === 3) {console.log(bpath)};

if (!layered) {
  bpath = this.isCheck(n, bpath); }

return bpath;

}

knight = (n, layered = false, board = this.state.board) => {

  let isBlack = false;

  if (board[n] === 2) {
    isBlack = true;
  }

  let whitePc = [6, 7, 8, 9, 10, 11]
  let blackPc = [0, 1, 2, 3, 4, 5]

  let protoPath = [];

  let nUp = n-8;
  let nLeft = n-1;
  let nRight = n+1;
  let nDown = n+8;

  let pathOne = () => {
    protoPath.push(nUp-9);
  }
  let pathTwo = () => {
    protoPath.push(nUp-7);
  }
  let pathThree = () => {
    protoPath.push(nLeft-9)
  }
  let pathFour = () => {
    protoPath.push(nLeft+7)
  }
  let pathFive = () => {
    protoPath.push(nRight-7)
  }
  let pathSix = () => {
    protoPath.push(nRight+9)
  }
  let pathSeven = () => {
    protoPath.push(nDown+7)
  }
  let pathEight = () => {
    protoPath.push(nDown+9)
  }

  if (!this.state.backEdge.includes(nUp) & !this.state.backEdge.includes(n) & !this.state.leftEdge.includes(n)) {
    pathOne();
  }
  if (!this.state.backEdge.includes(nUp) & !this.state.backEdge.includes(n) & !this.state.rightEdge.includes(n)) {
    pathTwo();
  }
  if (!this.state.leftEdge.includes(nLeft) & !this.state.leftEdge.includes(n) & !this.state.backEdge.includes(n)) {
    pathThree();
  }
  if (!this.state.leftEdge.includes(nLeft) & !this.state.leftEdge.includes(n) & !this.state.frontEdge.includes(n)) {
    pathFour();
  }
  if (!this.state.rightEdge.includes(nRight) & !this.state.rightEdge.includes(n) & !this.state.backEdge.includes(n)) {
    pathFive();
  }
  if (!this.state.rightEdge.includes(nRight) & !this.state.rightEdge.includes(n) & !this.state.frontEdge.includes(n)) {
    pathSix();
  }
  if (!this.state.frontEdge.includes(nDown) & !this.state.frontEdge.includes(n) & !this.state.leftEdge.includes(n)) {
    pathSeven();
  }
  if (!this.state.frontEdge.includes(nDown) & !this.state.frontEdge.includes(n) & !this.state.rightEdge.includes(n)) {
    pathEight();
  }

  if (isBlack) {
    protoPath = protoPath.filter(i => !blackPc.includes(board[i]) )
  }
  else {
    protoPath = protoPath.filter(i => !whitePc.includes(board[i]) )
  }

  if (board[n] === 2 | board[n] === 8) {console.log(protoPath)};


  if (!layered) {
  protoPath = this.isCheck(n, protoPath); }

  return protoPath;
  
}

rook = (n, w, b, layered = false, board = this.state.board) => {

  let bpath = []; 

  let lineOne = true;
  let p = n;
  let q = n;
  let r = n;
  let s = n;

  if (this.state.backEdge.includes(n)) {
    lineOne = false;
  }

while (lineOne === true) {

     p = p - 8;

    if (p<0 | p>63){
      lineOne = false;
    }

    else if ((board[n] === b & ((board[p] >= 0 & board[p] < 6) & board[p] !== 2.5)) | (board[n] === w & ((board[p] >= 6 & board[p] < 12) & board[p] !== 7.5))) {
      lineOne = false
    }

    else if ((board[n] === w & ((board[p] >= 0 & board[p] < 6) & board[p] !== 2.5)) | (board[n] === b & ((board[p] >= 6 & board[p] < 12) & board[p] !== 7.5))) {
      bpath.push(p)
      lineOne = false
    }

    else if (this.state.backEdge.includes(p)) {
      bpath.push(p)
      lineOne = false
    }

    else {
      bpath.push(p)
    }
}

let lineTwo = true;

if (this.state.leftEdge.includes(n)) {
    lineTwo = false;
    console.log('problem here')
  }

while (lineTwo === true) {

    q = q - 1;

    if (q<0 | q>63){
      lineTwo = false;
    }

    else if ((board[n] === b & ((board[q] >= 0 & board[q] < 6) & board[q] !== 2.5)) | (board[n] === w & ((board[q] >= 6 & board[q] < 12) & board[q] !== 7.5))) {
      lineTwo = false
    }

    else if ((board[n] === w & ((board[q] >= 0 & board[q] < 6) & board[q] !== 2.5)) | (board[n] === b & ((board[q] >= 6 & board[q] < 12) & board[q] !== 7.5))) {
      bpath.push(q)
      lineTwo = false
    }

    else if (this.state.leftEdge.includes(q)) {
      bpath.push(q)
      lineTwo = false
    }

    else {
      bpath.push(q)
    }
}

let lineThree = true;

if (this.state.rightEdge.includes(n)) {
    lineThree = false;
  }

while (lineThree === true) {

    r = r + 1;

    if (r<0 | r>63){
      lineThree = false;
    }

    else if ((board[n] === b & ((board[r] >= 0 & board[r] < 6) & board[r] !== 2.5)) | (board[n] === w & ((board[r] >= 6 & board[r] < 12) & board[r] !== 7.5))) {
      lineThree = false
    }

    else if ((board[n] === w & ((board[r] >= 0 & board[r] < 6) & board[r] !== 2.5)) | (board[n] === b & ((board[r] >= 6 & board[r] < 12) & board[r] !== 7.5))) {
      bpath.push(r)
      lineThree = false
    }

    else if (this.state.rightEdge.includes(r)) {
      bpath.push(r)
      lineThree = false
    }

    else {
      bpath.push(r)
    }
}

let lineFour = true;

if (this.state.frontEdge.includes(n)) {
    lineFour = false;
  }

while (lineFour === true) {

     s = s + 8;

    if (s<0 | s>63){
      lineFour = false;
    }

    else if ((board[n] === b & ((board[s] >= 0 & board[s] < 6) & board[s] !== 2.5)) | (board[n] === w & ((board[s] >= 6 & board[s] < 12) & board[s] !== 7.5))) {
      lineFour = false;
    }

    else if ((board[n] === w & ((board[s] >= 0 & board[s] < 6) & board[s] !== 2.5)) | (board[n] === b & ((board[s] >= 6 & board[s] < 12) & board[s] !== 7.5))) {
      bpath.push(s);
      lineFour = false;
    }

    else if (this.state.frontEdge.includes(s)) {
      bpath.push(s);
      lineFour = false;
    }

    else {
      bpath.push(s)
    }
}
if (b === 1) {console.log(bpath)};

if (!layered) {
  bpath = this.isCheck(n, bpath);}

return bpath;

} 


queen = (n, w, b, layered = false, board = this.state.board) => {
  let bishop = this.bishop(n, w, b, true, board);
  let rook = this.rook(n, w, b, true, board);

  let bpath = bishop.concat(rook);

if (b === 5 | w === 11) {console.log(bpath, "CHECK THIS OUT HEEEEEEY)  ")};

if (!layered) {
bpath = this.isCheck(n, bpath); }

return bpath;

}


king = (n, w, b, layered = false, board = this.state.board, fromCastle = false) => {

  let kingSideCastle;
  let queenSideCastle;

  if (this.state.board[n] === 10) {
    kingSideCastle = 62;
    queenSideCastle = 58;
  }
  if (this.state.board[n] === 4) {
    kingSideCastle = 6;
    queenSideCastle = 2;
  }

  let bpath = [];
  if (!this.state.rightEdge.includes(n)) {
    bpath.push(n+1);
  }
  if (!this.state.leftEdge.includes(n)) {
    bpath.push(n-1);
  }
  if (!this.state.frontEdge.includes(n)) {
    bpath.push(n+8);
  }
  if (!this.state.backEdge.includes(n)) {
    bpath.push(n-8);
  }
  if ((!this.state.backEdge.includes(n)) & (!this.state.rightEdge.includes(n))) {
    bpath.push(n-7);
  }
  if ((!this.state.backEdge.includes(n)) & (!this.state.leftEdge.includes(n))) {
    bpath.push(n-9);
  }
  if ((!this.state.frontEdge.includes(n)) & (!this.state.leftEdge.includes(n))) {
    bpath.push(n+7);
  }
  if ((!this.state.frontEdge.includes(n)) & (!this.state.rightEdge.includes(n))) {
    bpath.push(n+9);
  }
  if (!fromCastle) {
    if (this.canCastleKing(n)) {
      bpath.push(kingSideCastle)
    }
    if (this.canCastleQueen(n)) {
      bpath.push(queenSideCastle)
    }

  }
  if (board[n] === w) {
    bpath = bpath.filter(i => board[i] < 6 & board[i] >= -1 & board[i] !== 2.5 & i > -1 & i < 64)
  }
  if (board[n] === b) {
    bpath = bpath.filter(i => board[i] === -1 | (board[i] < 12 & board[i] > 5 & board[i] !== 7.5 & i > -1 & i < 64))
  }

  if (b === 4 | w === 10) {console.log(bpath)};

  if (!layered) {
  bpath = this.isCheck(n, bpath);}

  return bpath;

}

// king

  // Start of utility functions

  /*
        LEGEND for peices below:
        -1 = empty space;
        0 = black pawn;
        1 = black rook;
        2 = black knight;
        3 = black bishop;
        5 = black queen;
        6 = white pawn;
        7 = white rook;
        8 = white knight;
        9 = white bishop;
        11 = white queen;
        */


        //the 'ischeck' parts of the below function are not working, resolve before moving on

  castle = (n) => {
    let board = [...this.state.board];
    let arr = [...this.state.board];
    let hist = [arr, ...this.state.history];
    if (n === 2) {
      board[0] = -1;
      board[1] = -1;
      board[2] = 4;
      board[3] = 1;
      board[4] = -1;
    }
    if (n === 6) {
      board[4] = -1;
      board[5] = 1;
      board[6] = 4;
      board[7] = -1;
    }
    if (n === 58) {
      board[56] = -1;
      board[57] = -1;
      board[58] = 10;
      board[59] = 7;
      board[60] = -1;
    }
    if (n === 62) {
      board[60] = -1;
      board[61] = 7;
      board[62] = 10;
      board[63] = -1;
    }
    this.setState(state => ({
      board: board,
      isWhiteTurn: !state.isWhiteTurn,
      history: hist
    }))
  }
      

  canCastleKing = (n) => {
    if (this.state.board[n] === 4) {
      if ((this.isCheck(n, [5, 6], true).length === 2) & 
          !(this.inCheck(this.state.board, "black", true)) &
          !(this.state.blackKingMoved) &
          !(this.state.blackKingRookMoved) &
          (this.state.board[5] === -1) &
          (this.state.board[6] === -1)) {
            console.log('true GOT EM' + this.isCheck(n, [4, 5, 6], true))
        return true;}
      else {
            console.log('problem with the function')
        return false;}
    }
    if (this.state.board[n] === 10) {
      if ((this.isCheck(n, [61, 62], true).length === 2) & 
        !(this.inCheck(this.state.board, "white", true)) &
        !(this.state.blackKingMoved) &
        !(this.state.blackKingRookMoved) &
        (this.state.board[61] === -1) &
        (this.state.board[62] === -1)) {
        return true;}
      else {
        return false;}
    }
  }

  canCastleQueen = (n) => {
    if (this.state.board[n] === 4) {
      if ((this.isCheck(n, [1, 2, 3], true).length === 3) & 
          !(this.inCheck(this.state.board, "black", true)) &
          !(this.state.blackKingMoved) &
          !(this.state.blackQueenRookMoved) &
          (this.state.board[1] === -1) &
          (this.state.board[2] === -1) & 
          (this.state.board[3] === -1)) {
            console.log('true GOT EM' + this.isCheck(n, [4, 5, 6], true))
        return true;}
      else {
            console.log('problem with the function')
        return false;}
    }
    if (this.state.board[n] === 10) {
      if ((this.isCheck(n, [57, 58, 59], true).length === 3) & 
        !(this.inCheck(this.state.board, "white", true)) &
        !(this.state.blackKingMoved) &
        !(this.state.blackKingRookMoved) &
        (this.state.board[57] === -1) &
        (this.state.board[58] === -1) &
        (this.state.board[59] === -1)) {
        return true;}
      else {
        return false;}
    }
  }

  allPaths = (board, player, layered = false, fromCastle = false) => {
    let allPath = []
    if (player === 'black') {
      board.map((x, i) => {
        if (x === 0) {
          allPath.push(...this.bPawn(i, layered, board));
          return;
        }
        if (x === 1) {
          allPath.push(...this.rook(i, 7, 1, layered, board));
          return;
        }
        if (x === 2) {
          allPath.push(...this.knight(i, layered, board));
          return;
        }
        if (x === 3) {
          allPath.push(...this.bishop(i, 9, 3, layered, board));
          return;
        }
        if (x === 4) {
          allPath.push(...this.king(i, 10, 4, layered, board));
          return;
        }
        if (x === 5) {
          allPath.push(...this.queen(i, 11, 5, layered, board));
          return;
        }
        else {
          return;}
      })
    }
    if (player === 'white') {
      board.map((x, i) => {
        if (x === 6) {
          allPath.push(...this.wPawn(i, layered, board));
          return;
        }
        if (x === 7) {
          allPath.push(...this.rook(i, 7, 1, layered, board));
          return;
        }
        if (x === 8) {
          allPath.push(...this.knight(i, layered, board));
          return;
        }
        if (x === 9) {
          allPath.push(...this.bishop(i, 9, 3, layered, board));
          return;
        }
        if (x === 10) {
          allPath.push(...this.king(i, 10, 4, layered, board, fromCastle));
          return;
        }
        if (x === 11) {
          allPath.push(...this.queen(i, 11, 5, layered, board));
          return;
        }
        else {
          return;}
      })
    }
    return allPath;
  }

  inCheck = (board, player, fromCastle = false) => {
    let king;
    let opponent;
    if (player === 'black') {
      king = 4;
      opponent = "white";
    }
    if (player === 'white') {
      king = 10;
      opponent = "black";
    }
    let i = board.indexOf(king)
    let danger = this.allPaths(board, opponent, true, fromCastle);
    console.log(danger + "this looks like it doesnt change")
    if (danger.includes(i)){
      return true;
    }
    else {
      return false;
    }
  }

  isCheck = (n, arr, fromCastle = false) => {
    let player;
    if ((this.state.board[n] > -1) & (this.state.board[n] < 6)) {
      player = "black";
    }
    if ((this.state.board[n] < 12) & (this.state.board[n] > 5)) {
      player = "white";
    }
    arr = arr.filter(x => {
      let board = [...this.state.board];
      board[x] = board[n];
      board[n] = -1;
      let result = this.inCheck(board, player, fromCastle);
      console.log(result + "should have a true in here");
      return !result;
    });
    return arr;
  }

  //unfortunately, could not get isCheck to work, it seems, unfortunately, like a problem with the inCheck function
  // I think this because all input have been determined to be accurate, however, the inCheck
  // function is not identifying obvious check positions, unfortunately.
  // the most disturbing thing is that there is no obvious flaws.

  //I think I have discovered the problem... I have called all of the other functions in the program without a 
  //board perameter, and they all call this.state.board inside of them.
  // this will probably require a tedious rewrite of all of the movement funcitons, as well as all 
  //funcitons that call those functions.... oy vey

  colorChange = (n) => {
    if (n === "light") {
      this.setState({
        color: ["light", "dark"]
      }) 
    }
    if (n === "blue") {
      this.setState({
        color: ["white", "blue"]
      }) 
    }
    if (n === "green") {
      this.setState({
        color: ["olive", "emerald"]
      }) 
    }
    if (n === "pink") {
      this.setState({
      color: ["softer", "pink"]
    }) 
  }
}

  getCap = (arr) => {
    arr = arr.filter(x => x !== -1);
    arr.sort(function(a, b) {
      return a - b;
  })
    var product = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < arr.length; ++i){
      switch(arr[i]) {
        case 0:
          product[0]++;
          break;
        case 1:
          product[1]++;
          break;
        case 2:
          product[2]++;
          break;
        case 3:
          product[3]++;
          break;
        case 4:
          product[4]++;
          break;
        case 5:
          product[5]++;
          break;
        case 6:
          product[6]++;
          break;
        case 7:
          product[7]++;
          break;
        case 8:
          product[8]++;
          break;
        case 9:
          product[9]++;
          break;
        case 10:
          product[10]++;
          break;
        case 11:
          product[11]++;
          break;
      }
    }
    return product;
  }

  capCheck = (a, b) => {
    let change = false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        change = i;
      }
    }
    return change;
  }

  undo = () => {
    if (this.state.history.length > 0) {
      let hist = [...this.state.history];
      let poser = [...this.state.board];
      let captureCheck1 = this.getCap(poser);
      let captureCheck2 = this.getCap(hist[0]);
      let newCapture = this.capCheck(captureCheck1, captureCheck2);
      let captured = [...this.state.captured];
      console.log(newCapture +"FIGURE THIS SHIT OUT")
      if (newCapture !== false) {
        captured[newCapture] = captured[newCapture]-1;
      }
      let redoPush = [...this.state.redoLib, poser];
      let current = hist.shift();
      this.setState(state => ({
        redoLib: redoPush,
        board: current,
        history: hist,
        isWhiteTurn: !state.isWhiteTurn,
        captured: captured
      }))
    }
    else {
      alert("This is one doodle that can't be undid, home skillet")
    }
  }

  redo = () => {
    if (this.state.redoLib.length > 0) {
      let redo = [...this.state.redoLib];
      let poser = [...this.state.board];
      let captureCheck1 = this.getCap(poser);
      let captureCheck2 = this.getCap(redo[redo.length-1]);
      let newCapture = this.capCheck(captureCheck1, captureCheck2);
      let captured = [...this.state.captured];
      if (newCapture !== false) {
          captured[newCapture] = captured[newCapture]+1;
      }
      let undoPush = [poser, ...this.state.history];
      let current = redo.pop();
      this.setState(state => ({
        redoLib: redo,
        board: current,
        history: undoPush,
        isWhiteTurn: !state.isWhiteTurn,
        captured: captured
      }))
    }
    else {
      alert("This is one doodle that can't be redid, home skillet")
    }
  }


  toggleTurn = () => {
    this.setState(state => ({
      isWhiteTurn: !state.isWhiteTurn
    }))
  }


  //below in the piece I added, I actually let state know that these peices have not moved, that will become relevant later when I check for this to verify the possibility of castling or not
  //however, I need a way of changing this when they move... 

  
  togglePlay = () => {
    if (this.state.firstToggle) {
      let frontLeft = true;
      let frontRight = true;
      let wKing = true;
      let backLeft = true;
      let backRight = true;
      let bKing = true;

      if (this.state.board[56] === 7) {
        frontLeft = false;
      }
      if (this.state.board[63] === 7) {
        frontRight = false;
      }
      if (this.state.board[60] === 10) {
        wKing = false;
      }
      if (this.state.board[0] === 1) {
        backLeft = false;
      }
      if (this.state.board[7] === 1) {
        backRight = false;
      }
      if (this.state.board[4] === 4) {
        bKing = false;
      }

      this.setState({
        firstToggle: false,
        blackKingMoved: bKing,
        blackKingRookMoved: backRight,
        blackQueenRookMoved: backLeft,
        whiteKingMoved: wKing,
        whiteKingRookMoved: frontRight,
        whiteQueenRookMoved: frontLeft
      })

    }
    this.setState(state => ({
      playmode: !state.playmode,
      canMove: Array.from(Array(64).keys()).map(x => false),
      focusPiece: Array.from(Array(64).keys()).map(x => false),
      touchMove: false
    }))
  }

  reset = () => {
    this.setState({
      board: [1,2,3,5,4,3,2,1,
        0,0,0,0,0,0,0,0,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        6,6,6,6,6,6,6,6,
        7,8,9,11,10,9,8,7],
focusPiece: Array.from(Array(64).keys()).map(x => false),
touchMove: false,
chosenPiece: '',
lastIndex: '',
captured: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
grab: false
    })
  }

  clear = () => {
    this.setState({
      board: [-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,
      ],
focusPiece: Array.from(Array(64).keys()).map(x => false),
touchMove: false,
chosenPiece: '',
lastIndex: '',
captured: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
grab: false
    })
  }  

  grab = (num) => {
  //  this checks if the user has already selected a piece or not
      this.setState(() => ({
        touchMove: true,
        chosenPiece: num,
        grab: true
      }))
  }

  counter = (num, arr) => {
    let count = 0;
    let i = 0; 
    while (i < arr.length) {
        if(arr[i] === num){
            count++;    }
        i++;
    }
    return count;
}

  captured = (arr, refresh, captured, hist) => {
    let updatedCaptured = this.state.captured;
    updatedCaptured[captured] = updatedCaptured[captured]+1;
    this.setState(state => ({     //     that if pawn gets to end it is changed to a queen
      redoLib: [],
      isWhiteTurn: !state.isWhiteTurn,
      touchMove: false,
      board: arr,
      history: hist,
      focusPiece: refresh,
      captured: updatedCaptured,
      canMove: Array.from(Array(64).keys()).map(x => -1)
  }))
  }

  queenPawn = (n, arr) => {
    if (n <= 7 && this.state.chosenPiece === 6) {
      arr[n] = 11;
    }
    else if (n >= 56 && this.state.chosenPiece === 0) {
      arr[n] = 5;
    }
    else {
      arr[n] = this.state.chosenPiece;
    }
    return arr;
  }

  unhand = () => {   //it simply reverses the state back to neutral when you click again on the same exact piece as was originally selected. 
    this.setState({
      touchMove: false,
      focusPiece: Array.from(Array(64).keys()).map(x => false),
      chosenPiece: '',
      lastIndex: '',
      canMove: Array.from(Array(64).keys()).map(x => -1)
    })
  }

  //so I think what we need to do is significantly change the manner in which enpassant is called. I just realized that the enpassant moves are not actually added to the path 
  //of the piece, and therefore, they don't actually 'light up' as viable moves. I cannot have that in my game.
  //It is required that I have enpassant moves added to the viable pathways. What I might even do is no longer have an enpassant like area within the pawn movement, then call 
  //it only within the pawn function, and add the possible moves to the path. This will require some figuring. 

  enpassant = (n) => {
    console.log()
    if (this.state.playmode) {
      if ((this.isCheck(this.state.lastIndex, [n])).length < 1) {
        this.unhand();
        return;
      }
    }
    if (this.state.chosenPiece === 0) {
      if ((this.state.lastIndex >= 32 & this.state.lastIndex <= 39) & ((n === this.state.lastIndex + 7) | (n === this.state.lastIndex + 9)) & (this.state.board[n] === 7.5)) { //actual enpassant capture
        let refresh = Array.from(Array(64).keys()).map(x => false);
        let arr = [...this.state.board];
        let hist = [arr, ...this.state.history];
        let captured = this.state.board[n-8];
        arr[this.state.lastIndex] = -1;
        arr[n-8] = -1;
        arr[n] = this.state.chosenPiece;
        this.captured(arr, refresh, captured, hist); ////KJHKJHSKJHHHHHHHHHHHHHHHHHHHHH
      }
      if ((this.state.lastIndex >= 8 & this.state.lastIndex <= 15) | (n === this.state.lastIndex + 16) & this.state.board[n] === -1) { 
        let arr = [...this.state.board];
        let hist = [arr, ...this.state.history];
        arr = arr.map((x) => {
          if (x%1 === 0) {
            return x
          }
          else {
            return -1
          }
        });
        arr[this.state.lastIndex] = -1;
        if (arr[n-8] === -1) arr[n-8] = 2.5;
        arr[n] = this.state.chosenPiece;
        this.setState(state => ({
          redoLib: [],
          isWhiteTurn: !state.isWhiteTurn,
          touchMove: false,
          history: hist,
          board: arr,
          focusPiece: Array.from(Array(64).keys()).map(x => false),
          canMove: Array.from(Array(64).keys()).map(x => -1)
        }))
      }
      else {
        console.log("error, no if statements in 'enpassat' fired under the black piece")
      }
    }
    if (this.state.chosenPiece === 6) {
      if ((this.state.lastIndex >= 24 & this.state.lastIndex <= 31) && ((n === this.state.lastIndex - 9) | (n === this.state.lastIndex - 7)) & (this.state.board[n] === 2.5)) {
        let refresh = Array.from(Array(64).keys()).map(x => false);
        let arr = [...this.state.board];
        let hist = [arr, ...this.state.history];
        let captured = this.state.board[n+8];
        arr[this.state.lastIndex] = -1;
        arr[n+8] = -1;
        arr[n] = this.state.chosenPiece;
        this.captured(arr, refresh, captured, hist);   ////asdlajshdjkashdkjashdjkahsdads
      }
      if (((this.state.lastIndex >= 46 & this.state.lastIndex <= 55) | (n === this.state.lastIndex - 16)) & this.state.board[n] === -1) {
        let arr = [...this.state.board];
        let hist = [arr, ...this.state.history];
        arr = arr.map((x) => {
          if (x%1 === 0) {
            return x
          }
          else {
            return -1
          }
        });
        arr[this.state.lastIndex] = -1;
        if (arr[n+8] === -1) arr[n+8] = 7.5;
        arr[n] = this.state.chosenPiece;
        this.setState(state => ({
          redoLib: [],
          isWhiteTurn: !state.isWhiteTurn,
          touchMove: false,
          history: hist,
          board: arr,
          focusPiece: Array.from(Array(64).keys()).map(x => false),
          capturedPiece: [],
          canMove: Array.from(Array(64).keys()).map(x => -1)
        }))
      }
      else {
        console.log("error, no if statements in 'enpassat' fired under the white piece")
      }
    }
    else {
      console.log("error, couldn't differentiate black from white")
    }
  }

  endGame = () => {
    let player;
    if (this.state.isWhiteTurn) {
      player = 'white';
    }
    else {
      player = 'black';
    }
    let path = this.allPaths(this.state.board, player);
    let check = this.inCheck(this.state.board, player, true);

    if (check) {
      alert("checkmate");
      return true;
    }
    else if (path.length < 7 & !check) {
      alert("stalemate");
      return true;
    }
    else if (check) {
      alert("check");
      return false;
    } 
    return false;
  }

  // End of utility functions
  
  // Start of the movement functions (there are two, but they are both a little long) 

  playmove = (n) => {

    if (this.endGame()) {
      return;
    }

    if (this.state.touchMove === false) {  //  this checks if the user has already selected a piece or not
      if (this.state.isWhiteTurn & (this.state.board[n] > -1 & this.state.board[n] < 6)) {
        this.unhand();
        console.log('hello')
      }
      else if (!this.state.isWhiteTurn & (this.state.board[n] > 5 & this.state.board[n] < 12)) {
        this.unhand();
      }
      else if (this.state.board[n] !== -1 & this.state.board[n] !== 2.5 & this.state.board[n] !== 7.5) { //     this ensures that the user can select anything that is not an empty square
        let nPath = [];
        if (this.state.board[n] === 6) {nPath.push(...this.wPawn(n))} 
        if (this.state.board[n] === 0) {nPath.push(...this.bPawn(n))}//!KJBNJLH_)!#I_)!I#_+)!#+!#(+(_!#+_)(+_++___________+)+_)+_)+_)+_)+)_+_)+)________________________________JAKE___MELOCHE_______IS____A______XD______FUNNY____LITTLE_____GUY
        if (this.state.board[n] === 3 | this.state.board[n] === 9) {nPath.push(...this.bishop(n, 9, 3))}
        if (this.state.board[n] === 2 | this.state.board[n] === 8) {nPath.push(...this.knight(n))}
        if (this.state.board[n] === 1 | this.state.board[n] === 7) {nPath.push(...this.rook(n, 7, 1))}
        if (this.state.board[n] === 11 | this.state.board[n] === 5) {nPath.push(...this.queen(n, 11, 5))}
        if (this.state.board[n] === 10 | this.state.board[n] === 4) {nPath.push(...this.king(n, 10, 4))}
        let replace = [...this.state.focusPiece];
        replace[n] = true;
        let moveBoard = this.state.canMove.map((x, i) => {
          if (nPath.includes(this.state.boardSquares[i])) {
            if (this.state.board[i] === -1) {
              return 0;
            } 
            else {
              return 2;
            }
          }
          else {
            return x
          }
        });
        this.setState((state) => ({
          redoLib:[],
          focusPiece: replace,
          touchMove: true,
          chosenPiece: state.board[n],
          lastIndex: n,
          chosenPath: nPath,
          canMove: moveBoard
        }))
      }
    }
    else if (n === this.state.lastIndex) {
      this.unhand() // unhand is listed above in the untilies functions, purpose stated with function, I added this for a little bit of abstrction, as the move function is starting to get unwieldy
    }
    else if ((this.state.chosenPiece === 0 & ((this.state.lastIndex >= 32 & this.state.lastIndex <= 39) & ((n === (this.state.lastIndex + 9)) | (n === (this.state.lastIndex + 7))) & (this.state.board[n] === 7.5)) | ((this.state.lastIndex >= 8 & this.state.lastIndex <= 15) & (n === (this.state.lastIndex + 16))))| ((this.state.chosenPiece === 6 & ((this.state.lastIndex >= 24 & this.state.lastIndex <= 31) & ((n === (this.state.lastIndex - 9)) | (n === (this.state.lastIndex - 7))) & (this.state.board[n] === 2.5)) | ((this.state.lastIndex >= 48 & this.state.lastIndex <= 55) & (n === (this.state.lastIndex - 16)))))) {
      this.enpassant(n)
    }
    else if ((this.state.chosenPiece === 4 & (this.state.chosenPath.includes(2) | this.state.chosenPath.includes(6)) & (n === this.state.lastIndex+2 | n === this.state.lastIndex-2)) | (this.state.chosenPiece === 10 &  (this.state.chosenPath.includes(58) | this.state.chosenPath.includes(62)) & (n === this.state.lastIndex+2 | n === this.state.lastIndex-2))) {
      this.castle(n)
      this.unhand();
    }
     else if (this.state.board[n] !== -1 & this.state.grab === false & this.state.chosenPath.includes(n)) {
      let refresh = Array.from(Array(64).keys()).map(x => false);
      let captured = this.state.board[n];
      let arr = [...this.state.board];
      let hist = [arr, ...this.state.history];
      arr = arr.map((x) => {
        if (x%1 === 0) {
          return x
        }
        else {
          return -1
        }
      });
      arr[this.state.lastIndex] = -1;
      arr[n] = this.state.chosenPiece;
      this.queenPawn(n, arr); // returns array of board w pieces, ensuring 
      this.captured(arr, refresh, captured, hist) ////kasjdkjashdkjashdkjahsdkjhasdkjashdkjasdjkashjkd
    } 
    else if (this.state.board[n] === -1 & this.state.chosenPath.includes(n)){
        let arr = [...this.state.board];
        let hist = [arr, ...this.state.history];
        arr = arr.map((x) => {
          if (x%1 === 0) {
            return x
          }
          else {
            return -1
          }
        });
        arr[this.state.lastIndex] = -1;
        arr[n] = this.state.chosenPiece;
        this.queenPawn(n, arr); // returns array of board w pieces, ensuring 
        this.setState(state => ({     //     that if pawn gets to end it is changed to a queen
          redoLib: [],
          isWhiteTurn: !state.isWhiteTurn,
          touchMove: false,
          board: arr,
          history: hist,
          focusPiece:  Array.from(Array(64).keys()).map(x => false),
          canMove:  Array.from(Array(64).keys()).map(x => -1)
      }))
      }
      else {
        this.unhand();
      }
    }
  
  
//see state property above 'canMove', this 
  move = (n) => {
    if (this.state.playmode) {
      this.playmove(n);
    }
    else {
      if (this.state.grab === true) {
            let arr = [...this.state.board];
            let hist = [arr, ...this.state.board];
            arr = arr.map((x) => {
              if (x%1 === 0) {
                return x
              }
              else {
                return -1
              }
            })
            arr[n] = this.state.chosenPiece;
            this.queenPawn(n, arr); // returns array of board w pieces, ensuring ;
            this.setState({     // that if pawn gets to end it is changed to a queen ;
              touchMove: false,
              board: arr,
              history: hist,
              grab: false
      })}
      if (this.state.touchMove === false) {  //  this checks if the user has already selected a piece or not
        if (this.state.board[n] !== -1 & this.state.board[n] !== 2.5 & this.state.board[n] !== 7.5) { //     this ensures that the user can select anything that is not an empty square
          let replace = [...this.state.focusPiece];
          replace[n] = true;
          this.setState((state) => ({
            focusPiece: replace,
            touchMove: true,
            chosenPiece: state.board[n],
            lastIndex: n
          }))
        }
      }
      else if (n === this.state.lastIndex) {
        this.unhand() // unhand is listed above in the untilies functions, purpose stated with function, I added this for a little bit of abstrction, as the move function is starting to get unwieldy
      }
      else {
        if ((this.state.chosenPiece >= 6 & (this.state.board[n] < 6 | this.state.board[n] === 7.5)) | (this.state.chosenPiece < 6 & (this.state.board[n] > 5 | this.state.board[n] === -1 | this.state.board[n] === 2.5))) { // this, rather long expression ensures that the user cannot capture their own pieces
          if ((this.state.chosenPiece === 0 & ((this.state.lastIndex >= 32 & this.state.lastIndex <= 39) & ((n === (this.state.lastIndex + 9)) | (n === (this.state.lastIndex + 7))) & (this.state.board[n] === 7.5)) | ((this.state.lastIndex >= 8 & this.state.lastIndex <= 15) & (n === (this.state.lastIndex + 16))))| ((this.state.chosenPiece === 6 & ((this.state.lastIndex >= 24 & this.state.lastIndex <= 31) & ((n === (this.state.lastIndex - 9)) | (n === (this.state.lastIndex - 7))) & (this.state.board[n] === 2.5)) | ((this.state.lastIndex >= 48 & this.state.lastIndex <= 55) & (n === (this.state.lastIndex - 16)))))) {
            this.enpassant(n)
          } 
          
          else if (this.state.board[n] !== -1 & this.state.grab === false) {
              let refresh = Array.from(Array(64).keys()).map(x => false);
              let captured = this.state.board[n];
              let arr = [...this.state.board];
              let hist = [arr, ...this.state.history];
              arr = arr.map((x) => {
                if (x%1 === 0) {
                  return x
                }
                else {
                  return -1
                }
              });
              arr[this.state.lastIndex] = -1;
              arr[n] = this.state.chosenPiece;
              this.queenPawn(n, arr); // returns array of board w pieces, ensuring 
              this.captured(arr, refresh, captured, hist) ///akjshdkjashdkjashkdjhajskd 
            }
          else {
            let arr = [...this.state.board];
            let hist = [arr, ...this.state.history];
            arr = arr.map((x) => {
              if (x%1 === 0) {
                return x
              }
              else {
                return -1
              }
            });
            arr[this.state.lastIndex] = -1;
            arr[n] = this.state.chosenPiece;
            this.queenPawn(n, arr); // returns array of board w pieces, ensuring 
            this.setState({     //     that if pawn gets to end it is changed to a queen
              touchMove: false,
              board: arr,
              focusPiece:  Array.from(Array(64).keys()).map(x => false),
              history: hist
          })
          }
        }
        else {
          this.unhand()
        }
      } }
  }
  render() {
      let arr = [1,2,3,4,5,6,7,8];
      let rowArr = arr.map((x) => {
        return(
          <div key={x} className={"row-"+x}>
            <span onClick={() => this.move(x*8-8)}><Greeting color={this.state.color} active={this.state.active} value={x*8-7} row={x} path={this.state.canMove[x*8-8]} focusPiece={this.state.focusPiece[x*8-8]} current={this.state.board[x*8-8]}/></span>
            <span onClick={() => this.move(x*8-7)}><Greeting color={this.state.color} active={this.state.active} value={x*8-6} row={x} path={this.state.canMove[x*8-7]} focusPiece={this.state.focusPiece[x*8-7]} current={this.state.board[x*8-7]}/></span>
            <span onClick={() => this.move(x*8-6)}><Greeting color={this.state.color} active={this.state.active} value={x*8-5} row={x} path={this.state.canMove[x*8-6]} focusPiece={this.state.focusPiece[x*8-6]} current={this.state.board[x*8-6]}/></span>
            <span onClick={() => this.move(x*8-5)}><Greeting color={this.state.color} active={this.state.active} value={x*8-4} row={x} path={this.state.canMove[x*8-5]} focusPiece={this.state.focusPiece[x*8-5]} current={this.state.board[x*8-5]}/></span>
            <span onClick={() => this.move(x*8-4)}><Greeting color={this.state.color} active={this.state.active} value={x*8-3} row={x} path={this.state.canMove[x*8-4]} focusPiece={this.state.focusPiece[x*8-4]} current={this.state.board[x*8-4]}/></span>
            <span onClick={() => this.move(x*8-3)}><Greeting color={this.state.color} active={this.state.active} value={x*8-2} row={x} path={this.state.canMove[x*8-3]} focusPiece={this.state.focusPiece[x*8-3]} current={this.state.board[x*8-3]}/></span>
            <span onClick={() => this.move(x*8-2)}><Greeting color={this.state.color} active={this.state.active} value={x*8-1} row={x} path={this.state.canMove[x*8-2]} focusPiece={this.state.focusPiece[x*8-2]} current={this.state.board[x*8-2]}/></span>
            <span onClick={() => this.move(x*8-1)}><Greeting color={this.state.color} active={this.state.active} value={x*8}   row={x} path={this.state.canMove[x*8-1]} focusPiece={this.state.focusPiece[x*8-1]} current={this.state.board[x*8-1]}/></span>
          </div>
        )})
      if (this.state.playmode === false) {
      return (
        <div id="wrapper">
          <button className={'button-' + this.state.playmode} onClick={this.togglePlay}>GAME ON</button>
          <button className='colorButton' onClick={() => this.colorChange('light')}>light</button>
          <button className='colorButton' onClick={() => this.colorChange('green')}>green</button>
          <button className='colorButton' onClick={() => this.colorChange('blue')}>blue</button>
          <button className='colorButton' onClick={() => this.colorChange('pink')}>pink</button>
          <div id="board">
            <Taken color="black" pieces={this.state.captured}/>
            {rowArr}
            <div className="box">
              <span className="boxpiece" onClick={() => this.grab(5)}><Piece greetpiece={false} piece='5'/></span>
              <span className="boxpiece" onClick={() => this.grab(4)}><Piece greetpiece={false} piece='4'/></span>
              <span className="boxpiece" onClick={() => this.grab(3)}><Piece greetpiece={false} piece='3'/></span>
              <span className="boxpiece" onClick={() => this.grab(2)}><Piece greetpiece={false} piece='2'/></span>
              <span className="boxpiece" onClick={() => this.grab(1)}><Piece greetpiece={false} piece='1'/></span>
              <span className="boxpiece" onClick={() => this.grab(0)}><Piece greetpiece={false} piece='0'/></span>
              <span className="boxpiece" onClick={this.clear}><Piece greetpiece={false} piece='clr'/></span>
              <span className="boxpiece" onClick={() => this.grab(-1)}><Piece greetpiece={false} piece='X'/></span>
              <span className="boxpiece" onClick={this.reset}><Piece greetpiece={false} piece='rst'/></span>
              <span className="boxpiece" onClick={() => this.grab(6)}><Piece greetpiece={false} piece='6'/></span>
              <span className="boxpiece" onClick={() => this.grab(7)}><Piece greetpiece={false} piece='7'/></span>
              <span className="boxpiece" onClick={() => this.grab(8)}><Piece greetpiece={false} piece='8'/></span>
              <span className="boxpiece" onClick={() => this.grab(9)}><Piece greetpiece={false} piece='9'/></span>
              <span className="boxpiece" onClick={() => this.grab(10)}><Piece greetpiece={false} piece='10'/></span>
              <span className="boxpiece" onClick={() => this.grab(11)}><Piece greetpiece={false} piece='11'/></span>
            </div>
            <Taken color="white" pieces={this.state.captured}/>
          </div>
        </div>)
      }
      else {
        return (
          <div id="wrapper">
            <button className={'button-' + this.state.playmode} onClick={this.togglePlay}>PAUSE</button>
            <div id="board">
              <Taken color="black" pieces={this.state.captured}/>
              {rowArr}
              <div className="box">
                <span className="boxpiece1"><button className={'undo'} onClick={this.undo}>UNDO</button></span>
                <span className="boxpiece1"><button className={'redo'} onClick={this.redo}>REDO</button></span>
                <span className="boxpiece1"><button className="temp-change" onClick={this.toggleTurn}><Turn turn={this.state.isWhiteTurn}/></button></span>
            </div>
              <Taken color="white" pieces={this.state.captured}/>
            </div>
          </div>)
      }
      }
}

//notes/areas of improvement: we are getting some sort of error when we capture more
//pieces than are usually allowed on the board i.e. in custom games.... figure this one out!


export default App;
