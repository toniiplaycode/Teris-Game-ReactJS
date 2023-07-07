const StartButton = ({callback}) => {
    return(
        <div className="btn-start">
            <button onClick={callback}>Start Game</button>
        </div>
    )
}

export default StartButton;