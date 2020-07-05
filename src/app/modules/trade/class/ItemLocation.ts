import { NumericDictionary } from "lodash";

export default class ItemLocation {
    public left: number;
    public top: number;
    public stashTabName: string;

    constructor(stashTabName: string = "", left: number = -1, top: number = -1) {
        this.left = left;
        this.top = top;
        this.stashTabName = stashTabName;
    }
}