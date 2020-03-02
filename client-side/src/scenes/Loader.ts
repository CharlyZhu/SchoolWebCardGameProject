import { ICard } from "../card/CardManager";

export class Loader extends Phaser.Scene {

    constructor() {
        super("loader")

    }


 public preload() {
    const loaderPrefix: string = "../../assets/cards/json/0002.json"
    //this.load.json('card0001', require('../../assets/cards/json/000'+ 2 +'.json') );
    this.load.json('card0001', require("../../assets/cards/json/0002.json") );
    
 }

 public create() {
const card: ICard = this.cache.json.get("card0001");



 }


}

