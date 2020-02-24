/// <reference path=”phaser.d.ts”/>
class Game {
    constructor() {
        this.game = new Phaser.Game(1200, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    game: Phaser.Game;
    preload() {
        this.game.load.image('logo', 'phaser2.png');
    }
    create() {
        let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
}

window.onload = () => {
    let game = new Game();
};