let scale = {
  parent: 'game',
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 1000,
  height:600
}

var config = {
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    },
  },
  scene: Abacus,
  scale
};

var game = new Phaser.Game(config);
