module app.tree {

    export enum TreeElementType {
        HorizontalLayout, VerticalLayout, Control
    }

    export class TreeElement {
        public title : string;

        constructor(public id: number, private type: TreeElementType, public nodes: TreeElement[]){
            this.title = TreeElementType[type];
        }

    }
}