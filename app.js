console.log("Start");

const mapDims = 5;

const mapArray = new Array(mapDims);

let score = 0;

let snakePosition = [0, 0];

const snakePrevPos = [[0, 0]];

let snakeTail = 2;

for (let i = 0; i < mapDims; i++) {
  mapArray[i] = new Array(mapDims);
}

const saveHighScore = () => {
  const highScoreItem = Number(window.localStorage.getItem("highScore") ?? 0);
  if (score > highScoreItem) {
    window.localStorage.setItem("highScore", score);
  }
};

const saveSnakePrevPos = (x, y) => {
  for (let i = 0; i < snakePrevPos.length; i++) {
    if (snakePrevPos[i][0] == x && snakePrevPos[i][1] == y) {
      saveHighScore();
      alert("Game Over");
      window.location.reload();
    }
  }

  if (snakePrevPos.length > snakeTail) {
    const removeBg = snakePrevPos.splice(0, 1);
    const revovalElement = document.getElementById(
      `col-${removeBg[0][0]}-${removeBg[0][1]}`
    );
    if (revovalElement) {
      revovalElement.classList.remove("snake-pos");
    }
  }

  snakePrevPos.push([snakePosition[0], snakePosition[1]]);

  snakePrevPos.forEach((e, i) => {
    changeSnakePos(e[0], e[1]);
  });
};

const addNewTreat = () => {
  let x = Math.floor(Math.random() * mapDims);
  let y = Math.floor(Math.random() * mapDims);

  let endFn = false;

  for (let i = 0; i < snakePrevPos.length; i++) {
    if (snakePrevPos[i][0] == x && snakePrevPos[i][1] == y) {
      endFn = true;
      addNewTreat();
      break;
    }
  }

  if (endFn) return;

  mapArray[x][y] = "T";
  const treatBox = document.getElementById(`col-${x}-${y}`);
  treatBox.classList.add("treat");
};

const changeSnakePos = (x, y) => {
  const snakeBox = document.getElementById(`col-${x}-${y}`);
  snakeBox.classList.add("snake-pos");
};

const move = (input) => {
  switch (input) {
    case "ArrowUp":
      {
        snakePosition[0] -= 1;
      }
      break;
    case "ArrowDown":
      {
        snakePosition[0] += 1;
      }
      break;
    case "ArrowLeft":
      {
        snakePosition[1] -= 1;
      }
      break;
    case "ArrowRight":
      {
        snakePosition[1] += 1;
      }
      break;
    default:
      break;
  }

  if (snakePosition[0] > mapDims - 1) snakePosition[0] = 0;
  if (snakePosition[0] < 0) snakePosition[0] = mapDims - 1;

  if (snakePosition[1] > mapDims - 1) snakePosition[1] = 0;
  if (snakePosition[1] < 0) snakePosition[1] = mapDims - 1;

  saveSnakePrevPos(snakePosition[0], snakePosition[1]);
  //changeSnakePos();

  if (mapArray[snakePosition[0]][snakePosition[1]] === "T") {
    document
      .getElementById(`col-${snakePosition[0]}-${snakePosition[1]}`)
      .classList.remove("treat");
    mapArray[snakePosition[0]][snakePosition[1]] = undefined;
    score++;
    snakeTail += 1;
    addNewTreat();
    document.getElementById("score").innerHTML = score;
  }
};

const init = () => {
//   snakePosition = [0, 0];
  const gameBoard = document.getElementById("gameBoard");

  const highScoreItem = window.localStorage.getItem("highScore") ?? 0;

  const highScoreContainer = document.getElementById("highScore");
  highScoreContainer.innerHTML = highScoreItem;

  mapArray.forEach((e, i) => {
    const row = document.createElement("div");
    row.id = `row-${i}`;
    row.classList.add("game-row");

    for (let ci = 0; ci < mapArray[i].length; ci++) {
      mapArray[i][ci] = 0;
      const col = document.createElement("div");
      col.id = `col-${i}-${ci}`;
      col.classList.add("game-cell");
      row.appendChild(col);
    }

    gameBoard.appendChild(row);
  });

  addNewTreat();
  changeSnakePos(snakePosition[0], snakePosition[1]);
};

init();

window.addEventListener("keydown", (e) => {
  move(e.code);
});
