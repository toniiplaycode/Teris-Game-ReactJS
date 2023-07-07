import { useCallback, useEffect, useState } from "react";
import { createStage } from "../components/gameHelpers";

export const useStage = (player, resetPlayer, audioTetrisClearRow) => {
    // console.log("file useStage player: ", player);
    
    const [stage, setStage] = useState(createStage()); 
    const [rowsClear, setRowsClear] = useState(0);

    useEffect(() => {
      setRowsClear(0);

      const sweepRows = (newStage) => {
          return (newStage.reduce((ack, row) => {
            if (row.findIndex(cell => cell[0] === 0) === -1) {
              setRowsClear(prev => prev + 1);
              ack.unshift(new Array(newStage[0].length).fill([0, 'clear'])); // thêm 1 dòng "0" mới vào đầu hàng
              audioTetrisClearRow.play();
              return ack;
            }
            ack.push(row);
            return ack;
          }, []))
        }


      const updateStage = (prevStage) => {
          // dùng để xoá đi cell cũ khi nó di chuyển và check merged
          const newStage = prevStage.map(row =>
              row.map(cell => {
                return (cell[1] === 'clear' ? [0, 'clear'] : cell)
              })
            );  

          player.tetromino.forEach((row, y) => {
              row.forEach((cell, x) => {
                  if(cell !== 0) {
                      newStage[y + player.pos.y][x + player.pos.x] = [cell, `${player.collided ? 'merged' : 'clear'}`]
                  }
              })
          });
                      
          // nếu va chạm thì resetPlayer
          if (player.collided) {
              resetPlayer();
              return sweepRows(newStage);
          }

          return newStage;
        };  

        setStage((prevStage) => {
            return updateStage(prevStage);
        })
    }, [player.collided, player.pos.x, player.pos.y, player.tetromino, resetPlayer]);

    return [stage, setStage, rowsClear];
}