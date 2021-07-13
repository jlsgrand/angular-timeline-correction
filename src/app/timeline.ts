import {Card} from "./card";

export interface Timeline {
  id: number;
  name: string;
  category: string;
  creationDate: Date;
  updateDate: Date;
  cardList: Card[];
}
