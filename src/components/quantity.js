import blackrook from '../images/blackrook.png'
import blackbishop from '../images/blackbishop.png'
import blackqueen from '../images/blackqueen.png'
import blackking from '../images/blackking.png'
import blackknight from '../images/blackknight.png'
import blackpawn from '../images/blackpawn.png'
import whiterook from '../images/whiterook.png'
import whitebishop from '../images/whitebishop.png'
import whitequeen from '../images/whitequeen.png'
import whiteking from '../images/whiteking.png'
import whiteknight from '../images/whiteknight.png'
import whitepawn from '../images/whitepawn.png'
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

function Quantity(props) {

    let images = [blackpawn, blackrook, blackknight, blackbishop, blackking, blackqueen, whitepawn, whiterook, whiteknight, whitebishop, whiteking, whitequeen];

        if (props.quant > 0) {
            return (
                <div class="capturedPieces">
                    <img className="CapPiece" src={images[props.piece]} alt='piece'/>
                    {Array(props.quant-1).fill(<img className="CapPiece cappawn" src={images[props.piece]} alt='piece'/>)}
                </div>
            )
        }
        else {
            return(
                <div class="capturedPieces">
                </div>
            )
        }
}


export default Quantity;