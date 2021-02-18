
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

function Piece(props) {
        const images = [blackpawn, blackrook, blackknight, blackbishop, blackking, blackqueen, whitepawn, whiterook, whiteknight, whitebishop, whiteking, whitequeen]
        if (props.greetpiece === false) {
            if (props.piece > -1 & props.piece !== 2.5 & props.piece !== 7.5) {
                return(
                    <div>
                    <img className="boxpiece" src={images[props.piece]} alt='piece'/>
                    </div>
                )}
            else if (props.piece === 'X') {
                return(
                    <div>
                        <button className="boxpiece" id="xbutton">X</button>
                    </div>
                ) }
            else if (props.piece === 'clr') {
                return(
                    <div>
                        <button className="boxpiece" id="clrbutton">CLR</button>
                    </div>
                )
            }
            else if (props.piece === 'rst') {
                return(
                    <div>
                        <button className="boxpiece" id="rstbutton">RST</button>
                    </div>
                )
            }
        }
        else {
        if (props.piece > -1 & props.piece !== 2.5 & props.piece !== 7.5)
            return(
                <div>
                <img className="piece" src={images[props.piece]} alt='piece'/>
                </div>
            )
        else
            return(<span></span>)
        }
    
}

export default Piece;

