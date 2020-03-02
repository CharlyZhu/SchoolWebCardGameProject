import { Card } from "./card";
import "resources"

export interface ICard {

  name: string;
  uid: string;
  manaCost: number;
  effects: {};
  imageURL: string;

}

export class CardManager {

  public arrCard: Card[] = [];


  
    public constructor() {

      for (let i = 1; i < 6; i++ ) 
      {

      

      }

    }




  }
  