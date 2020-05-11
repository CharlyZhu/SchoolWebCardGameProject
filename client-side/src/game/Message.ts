export default class Message extends Phaser.GameObjects.Text {
    public constructor(scene: Phaser.Scene, x: number, y: number, text: string, fontSize: number = 18, bold: boolean = false, fontType: string = "Arial", fontColour: string = 'black', rectWidth: number = 600) {
        let style: {} = {font: bold ? 'bold ' : '' + fontSize + 'px ' + fontType, fill: fontColour, wordWrap: { width: rectWidth }};
        super(scene, x, y, text, style);
    }
}
