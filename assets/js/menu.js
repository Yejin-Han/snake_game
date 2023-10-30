const Menu = {
  preload: function () {
    game.load.image("menu", "./assets/images/menu.png");
  },

  create: function () {
    this.add.sprite(0, 0, "menu");
    this.add.button(0, 0, "menu", this.startGame, this); //화면 전체를 button으로 만들어 startGame이라는 함수 연결
  },

  startGame: function () {
    this.state.start("Game"); //'Game'이라는 state로 연결
  },
};
