export class Card {
  public name: string;
  public uid: number;
  public manaCost: number;
  public effects: {};
  public imageURL: string;

  public constructor(JSONString: string) {
    let cardJSON = JSON.parse(JSONString);

    this.name = cardJSON.name;

    this.uid = cardJSON.uid;

    this.manaCost = cardJSON.manaCost;

    this.effects = cardJSON.effects;

    this.imageURL = cardJSON.imageURL;
  }


  public toString(): string {
    
    return ("Name: " + this.name +
    "\nUID: " + this.uid.toString() +
    "\nMana Cost: " + this.manaCost.toString() +
    "\nEffects: " + JSON.stringify(this.effects) +
    "\nImage Url: " + this.imageURL
    )

  }


}
