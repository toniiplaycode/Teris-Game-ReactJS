import { useCallback, useState } from "react";
import { TETROMINOS, randomTetromino } from "../components/tetromios";
import { STAGE_WIDTH, checkCollided } from "../components/gameHelpers";
import Stage from "../components/Stage";

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: {x: 0, y: 0},
        tetromino: TETROMINOS[0].shape, // lấy tetromino 0 là mặc định
        collided: false,
    })

    const rotate = (matrix, dir) => {
        const rotatedTetro = matrix.map((_, index) => 
            matrix.map((col,_) => col[index])
        )

        if(dir > 0) {
            return rotatedTetro.map(row => row.reverse());
        }

        return rotatedTetro.reverse();
    }

    const playerRotate = (stage, dir) => {
        const clonePlayer = JSON.parse(JSON.stringify(player));
        clonePlayer.tetromino = rotate(clonePlayer.tetromino, dir);

        const pos = clonePlayer.pos.x;
        let offset = 1;
        while(checkCollided(clonePlayer, stage, {x: 0, y: 0})){
            clonePlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonePlayer.tetromino[0].length) {
              rotate(clonePlayer.tetromino, -dir);
              clonePlayer.pos.x = pos;
              return;
            }
        }
        setPlayer(clonePlayer);
    }

    const updatePlayerPos = ({x, y, collided}) => {
        setPlayer(
            {
                ...player,
                pos: { x: (player.pos.x += x), y: (player.pos.y += y)},
                collided,
            }   
        )
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: {x: STAGE_WIDTH / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        })
    }, []);

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}