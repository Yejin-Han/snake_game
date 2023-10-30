let snake,
  apple,
  squareSize,
  score,
  speed,
  updateDelay,
  direction,
  new_direction,
  addNew,
  cursors,
  scoreTextValue,
  speedTextValue,
  textStyle_Key,
  textStyle_Value;

const Game = {
  preload: function () {
    this.load.image("snake", "./assets/images/snake.png");
    this.load.image("apple", "./assets/images/apple.png");
  },

  create: function () {
    snake = []; // snake.png를 얼마나 표시할지를 나타낼 변수
    apple = {}; // 사과
    squareSize = 15; // 사과/뱀의 1블럭 사이즈
    score = 0; // 점수
    speed = 0; // 속도
    updateDelay = 0; // 키 입력시 얼마큼의 delay 후 방향을 변경할 지
    direction = "right"; // 시작시 뱀의 방향
    new_direction = null; // 키 입력시 변경될 뱀의 방향
    addNew = false; // 뱀이 사과를 먹었을 때, 새로운 사과를 놓을지 여부

    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = "#061f27";

    /** add.sprite의 parameters
     * @param x x coordinate
     * @param y y coordinate
     * @param image key name
     */
    for (var i = 0; i < 10; i++) {
      snake[i] = game.add.sprite(150 + i * squareSize, 150, "snake");
    }

    // 첫 사과 배치
    this.generateApple();

    // 상단의 텍스트(점수, 속도)
    textStyle_Key = {
      font: "bold 14px sans-serif",
      fill: "#46c0f9",
      align: "center",
    };
    textStyle_Value = {
      font: "bold 18px sans-serif",
      fill: "#fff",
      align: "center",
    };

    // 점수
    game.add.text(30, 20, "SCORE", textStyle_Key);
    scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);

    // 속도
    game.add.text(500, 20, "SPEED", textStyle_Key);
    speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
  },

  update: function () {
    // 키 입력 처리
    if (cursors.left.isDown && direction != "right") {
      new_direction = "left";
    } else if (cursors.right.isDown && direction != "left") {
      new_direction = "right";
    } else if (cursors.up.isDown && direction != "down") {
      new_direction = "up";
    } else if (cursors.down.isDown && direction != "up") {
      new_direction = "down";
    }

    // 점수에 따른 게임 속도 결정
    speed = Math.min(10, Math.floor(score / 5));
    speedTextValue.text = "" + speed;

    // Phaser의 기본 update rate는 약 60 FPS이므로 게임 플레이를 위해 FPS 감소
    // counter 증가
    updateDelay++;

    // counter이 (10 - 속도)로 정확히 나눠지면 게임 진행
    // 속도가 높을수록, 위 조건이 더 자주 충족될수록 뱀은 빨리 움직임.
    if (updateDelay % (10 - speed) == 0) {
      let firstCell = snake[snake.length - 1],
        lastCell = snake.shift(),
        oldLastCellx = lastCell.x,
        oldLastCelly = lastCell.y;

      // 키 입력으로 새로운 direction이 정해지면 현재 뱀의 direction으로 결정
      if (new_direction) {
        direction = new_direction;
        new_direction = null;
      }

      // 뱀 머리를 향해 last cell의 direction 변경
      if (direction == "left") {
        lastCell.x = firstCell.x - 15;
        lastCell.y = firstCell.y;
      } else if (direction == "right") {
        lastCell.x = firstCell.x + 15;
        lastCell.y = firstCell.y;
      } else if (direction == "up") {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y - 15;
      } else if (direction == "down") {
        lastCell.x = firstCell.x;
        lastCell.y = firstCell.y + 15;
      }

      // lastCell과 firstCell이 이어지게
      snake.push(lastCell);
      firstCell = lastCell;

      if (addNew) {
        snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, "snake"));
        addNew = false;
      }

      // 사과와 충돌 함수 - 득점
      this.appleCollision();
      // 뱀 스스로에게 충돌
      this.selfCollision(firstCell);
      // 벽에 충돌
      this.wallCollision(firstCell);
    }
  },

  generateApple: function () {
    // 랜덤 위치에 배치
    const randomX = Math.floor(Math.random() * 40) * squareSize,
      randomY = Math.floor(Math.random() * 30) * squareSize;

    // 사과 추가
    apple = game.add.sprite(randomX, randomY, "apple");
  },

  appleCollision: function () {
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x == apple.x && snake[i].y == apple.y) {
        // 이 다음에 뱀이 움직이면 새 block이 추가됨
        addNew = true;
        apple.destroy();
        this.generateApple();
        score++;
        scoreTextValue.text = score.toString();
      }
    }
  },

  selfCollision: function (head) {
    // 뱀의 머리가 뱀의 다른 block 어딘가에 닿는지 체크
    for (let i = 0; i < snake.length - 1; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) {
        // 게임오버
        game.state.start("Game_Over");
      }
    }
  },

  wallCollision: function (head) {
    // 뱀의 머리가 게임 필드 안에 있는지 확인
    if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0) {
      // 게임오버
      game.state.start("Game_Over");
    }
  },
};
