export class VeilPlayer {
  public id: string;
  public goal: number;
  public cards: string[] = [];
  
  public constructor(id: string, goal: number) {
    this.id = id;
    this.goal = goal;
  }
};
