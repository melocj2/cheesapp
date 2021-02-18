import Quantity from './quantity';

function Taken(props) {
    /*
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

    if (props.color === "white") {
    return (
    <div>
        <Quantity piece={0} quant={props.pieces[0]}/>
        <Quantity piece={1} quant={props.pieces[1]}/>
        <Quantity piece={2} quant={props.pieces[2]}/>
        <Quantity piece={3} quant={props.pieces[3]}/>
        <Quantity piece={5} quant={props.pieces[5]}/>
        <p class='points'>{((props.pieces[6])+(props.pieces[7]*5)+(props.pieces[8]*3)+(props.pieces[9]*3)+(props.pieces[11]*9)) < ((props.pieces[0])+(props.pieces[1]*5)+(props.pieces[2]*3)+(props.pieces[3]*3)+(props.pieces[5]*9)) ? '+' +  (((props.pieces[0])+(props.pieces[1]*5)+(props.pieces[2]*3)+(props.pieces[3]*3)+(props.pieces[5]*9)) - ((props.pieces[6])+(props.pieces[7]*5)+(props.pieces[8]*3)+(props.pieces[9]*3)+(props.pieces[11]*9))) : ''}</p>
    </div>

    )
    }
    if (props.color === "black") {
        return (
        <div>
            <Quantity piece={6} quant={props.pieces[6]}/>
            <Quantity piece={7} quant={props.pieces[7]}/>
            <Quantity piece={8} quant={props.pieces[8]}/>
            <Quantity piece={9} quant={props.pieces[9]}/>
            <Quantity piece={11} quant={props.pieces[11]}/>
            <p class='points'>{((props.pieces[0])+(props.pieces[1]*5)+(props.pieces[2]*3)+(props.pieces[3]*3)+(props.pieces[5]*9)) < ((props.pieces[6])+(props.pieces[7]*5)+(props.pieces[8]*3)+(props.pieces[9]*3)+(props.pieces[11]*9)) ? '+' + (((props.pieces[6])+(props.pieces[7]*5)+(props.pieces[8]*3)+(props.pieces[9]*3)+(props.pieces[11]*9)) - ((props.pieces[0])+(props.pieces[1]*5)+(props.pieces[2]*3)+(props.pieces[3]*3)+(props.pieces[5]*9))) : ''}</p>
        </div>

        )
        }
}

export default Taken;