function Turn(props) {

        if (props.turn) {
            return (
                <div class="turnStatement">
                    <p>TO MOVE: <span className="whiteCirc"></span></p>
                </div>
            )
        }
        else {
            return(
                <div class="turnStatement">
                    <p>TO MOVE: <span className="blackCirc"></span></p>
                </div>
            )
        }
}


export default Turn;