import { obtainCardList } from "../card/CardManager";

export class Loader extends Phaser.Scene {
  constructor() {
    super("loader");
  }

  public preload() {
    // const loaderPrefix: string = "assets/cards/json/";
    // this.load.json("card0002", loaderPrefix + "000" + 2 + ".json");
    // this.load.json("card0003", loaderPrefix + "000" + 3 + ".json");
    // this.load.json("card0004", loaderPrefix + "000" + 4 + ".json");
    // this.load.json("card0005", loaderPrefix + "000" + 5 + ".json");
    // this.load.json("card0006", loaderPrefix + "000" + 6 + ".json");
    // // this.load.json('card0001', require("../../assets/cards/json/0002.json") );
  }

  public create() {
    const card: ICard = this.cache.json.get("card0002");
    console.log(card);
    console.log("main loading");

    obtainCardList().then(() => {
      this.scene.start("mainscene");
    });
  }
}
