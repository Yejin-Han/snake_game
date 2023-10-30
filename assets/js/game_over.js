const Game_Over = {
  preload: function () {
    game.load.image("gameOver", "./assets/images/gameover.png");
  },

  create: function () {
    // 클릭하면 새 게임 시작되도록 화면 전체를 버튼으로 설정 (gameOver image 삽입)
    this.add.button(0, 0, "gameOver", this.startGame, this);

    // 죽을 당시 게임 정보 출력
    game.add.text(235, 350, "LAST SCORE", {
      font: "bold 16px sans-serif",
      fill: "#46c0f9",
      align: "center",
    });
    game.add.text(350, 348, score.toString(), {
      font: "bold 20px sans-serif",
      fill: "#fff",
      align: "center",
    });
  },

  startGame: function () {
    this.state.start("Game");
  },
};
