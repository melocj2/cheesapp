import React from 'react';
import Piece from './piece.js'

function Greeting(props) {
/*
ok now that I have a bit of a better understanding:
each component gets it's own name for a peice from props in App
in the component it is clarified that the name of the piece
is preferentially defined in state, and as soon as that has a 
defintion, it replaces the default one assigned.

*/
        /*
        LEGEND for peices above:
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
//<Piece piece={this.props.current}/>
    if (props.focusPiece) {
        return (
            <span className="colored-green"><Piece greetpiece={true} piece={props.current}/></span>
            )
    }

    else if (props.path === 0) {
        return (
            <span className="colored-grey"><Piece greetpiece={true} piece={props.current}/></span>
        )
    }
    else if (props.path === 2) {
        return (
            <span className="colored-red"><Piece greetpiece={true} piece={props.current}/></span>
        )
    }
        if (props.row%2 === 0) {
            if (props.value%2 === 0) {
                return (
                <span className={"colored-"+props.color[0]}><Piece greetpiece={true}  piece={props.current}/></span>
                )
            } 
            else {
                return (
                <span className={"colored-"+props.color[1]}><Piece greetpiece={true}  piece={props.current}/></span>
                )
            }
        }
        else
            if (props.value%2 === 0) {
                return (
                <span className={"colored-"+props.color[1]}><Piece greetpiece={true} piece={props.current}/></span>
                )
            } 
            else {
                return (
                <span className={"colored-"+props.color[0]}><Piece greetpiece={true} piece={props.current}/></span>
                )
            }
        
    }

export default Greeting