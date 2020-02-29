config = {
    width: 1200,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: 0x304050,
    scene: [MenuScene, GamePlayScene, DeathScene, StoryScene, CreditScene]
};

window.onload = function() {
    let game = new Phaser.Game(config);
};