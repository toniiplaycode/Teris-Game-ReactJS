import {useState } from 'react';

// assets
import soundTetris from '../assets/SoundTetris.mp3';
import soundGameOver from '../assets/SoundGameOver.mp3';
import soundMerged from '../assets/SoundMerged.mp3';
import soundClearRow from '../assets/SoundClearRow.mp3';

import { createStage, checkCollided } from './gameHelpers';

// styled
import { StyledTetrisWrapper, StyledTetris} from './styles/StyledTetris';
import {StyledAside} from './styles/StyledAside';

// components
import Stage from './Stage'; 
import Display from './Display'; 
import StartButton from './StartButton'; 

// custom hooks 
import { useStage } from '../Hooks/useStage';
import { usePlayer } from '../Hooks/usePlayer';
import { useInterval } from '../Hooks/useInterval';
import { useGameStatus }  from '../Hooks/useGameStatus';

const Tetris = () => { 
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    
    const audioTetrisClearRow = document.querySelector(".audio-tetris-clear-row");
    const audioTetrisMerged = document.querySelector(".audio-tetris-merged");

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsClear] = useStage(player, resetPlayer, audioTetrisClearRow);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsClear/2);
    // rowsClear/2 là do bị re-render nên có double, đây là giải pháp tạm thời

    const startGame = () => {
        console.log('START GAME !!!');
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setDropTime(500);
        setScore(0);
        setRows(0);
        setLevel(1);
        if(!gameOver) {
            const audioTetris = document.querySelector(".audio-tetris");
            audioTetris.play();
        }
    }

    const movePlayer = (dir) => {
        if(!checkCollided(player, stage, {x: dir, y: 0})){
            updatePlayerPos({ x: dir, y: 0});
        }
    }

    const drop = () => {
        // khi level lên 5 sẽ giảm dropTime
        if (rows > level * 5) {
            setLevel(prev => prev + 1);
            setDropTime((400 / level) + 100);
          }

        if(!checkCollided(player, stage, {x: 0, y: 1})){
            updatePlayerPos({ x: 0, y: 1, collided: false});
        } else {
            if(player.pos.y < 1){ // game over
                console.log('GAME OVER !!!');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
            audioTetrisMerged.play();
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if( keyCode === 40 ) {
                console.log('Interval on');
                setDropTime((400 / level) + 100);
            }
        }
    }

    if(gameOver) {
        const audioTetrisGameOver = document.querySelector(".audio-tetris-game-over");
        audioTetrisGameOver.play();
    }

    const dropPlayer = () => {
        console.log("interval off") 
        setDropTime(null);
        drop();
    }

    const dropPlayerMobile = () => {
        drop();
    }

    const move = ({keyCode}, click) => {
        if (!gameOver) {
            if (keyCode === 37 || click == 37 ) {
              movePlayer(-1);
            } else if (keyCode === 39 || click == 39) {
              movePlayer(1);
            } else if (keyCode === 40) {
              dropPlayer();
            } else if (click === 40) {
                dropPlayerMobile();
            } else if (keyCode === 38 || click == 38) { 
                playerRotate(stage, 1);
            }
        }
    }

    // phải dùng hàm interval cusom vì react dùng interval thuần không được 
    useInterval(() => {
        if(!gameOver) {
            drop();
        }
    }, dropTime);
     
    return(
        // thêm role="button" tabIndex="0" để nó không bị lỗi không nhận e.keycode
        <StyledTetrisWrapper
        role="button" 
        tabIndex="0" 
        onKeyDown={e => move(e, 0)}
        onKeyUp={keyUp}
        >
            <StyledTetris>
                <div className='btn-move-mobile'>
                    <div className='btn-top mt-2'>
                        <button onTouchStart={e => move(e, 38)}>
                            <i class="fa-solid fa-chevron-up"></i>
                        </button>
                    </div>
                    <div className='btn-middle'>
                        <button onTouchStart={e => move(e, 37)}>
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button onTouchStart={e => move(e, 39)}>
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                    <div className='btn-bottom'>
                        <button onTouchStart={e => move(e, 40)}>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
                <main>
                    <h3 className='title'>TETRIS GAME</h3>
                    <Stage stage = {stage}/>
                </main>
                <StyledAside>
                    {gameOver ? (
                        <div>
                            <Display gameOver={gameOver} text={"Game Over"}/>
                        </div>
                    )
                    :
                    (
                        <div className='status'>
                            <audio className="audio-tetris">
                                <source src={soundTetris}></source>
                            </audio>
                            <audio className="audio-tetris-merged">
                                <source src={soundMerged}></source>
                            </audio>
                            <audio className="audio-tetris-clear-row">
                                <source src={soundClearRow}></source>
                            </audio>
                            <Display text={`score: ${score}`}/>
                            <Display text={`rows: ${rows}`}/>
                            <Display text={`level: ${level}`}/>
                        </div>
                    )   
                    }
                    <audio className="audio-tetris-game-over">
                        <source src={soundGameOver}></source>
                    </audio>
                    <StartButton callback={startGame} />
                </StyledAside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
    
}
export default Tetris;