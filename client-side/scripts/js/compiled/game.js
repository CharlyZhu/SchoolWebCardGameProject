/// <reference path=”phaser.d.ts”/>
var Game = /** @class */ (function () {
    function Game() {
        this.game = new Phaser.Game(1200, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    Game.prototype.preload = function () {
        this.game.load.image('logo', 'phaser2.png');
    };
    Game.prototype.create = function () {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
};
