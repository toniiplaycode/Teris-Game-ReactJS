export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () =>
  Array.from(new Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  ) 

// mỗi lần di chuyển thì hàm checkCollided này sẽ được gọi
export const checkCollided = (player, stage, {x: moveX, y: moveY}) => {
  for(let y = 0; y < player.tetromino.length; y++) {
    for(let x = 0; x < player.tetromino[y].length; x++) {
      if(player.tetromino[y][x] !== 0) {
        
        // console.log("x, y: ", player.pos.x, player.pos.y)
        // console.log(`hight: stage[${y + player.pos.y + moveY}]`);
        // console.log(`width: stage[${y + player.pos.y + moveY}][${x + player.pos.x + moveX}]`);

        if(
          // check theo chiều hight
          !stage[y + player.pos.y + moveY] ||
          // check theo chiều width
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // check đã merged
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ){
          return true;
        } 
      }
    }
  }
 }