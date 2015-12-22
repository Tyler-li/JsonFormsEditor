module app.tree {

    import GeneralToolboxElement = app.core.GeneralToolboxElement;

    import TreeElement = app.core.TreeElement;
    import ToolboxService = app.toolbox.ToolboxService;
    export class TreeService {

        static $inject = ['ToolboxService'];

        public elements : TreeElement[] = [];


        constructor(private toolboxService: ToolboxService){

            var rootElement: TreeElement = toolboxService.getExpertElementOfType("VerticalLayout").insertIntoTree(TreeElement.getNewId());
            rootElement['root'] = 'root';
            this.elements.push(rootElement);
        }

        exportUISchemaAsJSON() : string {

            console.log(this.elements);

            return JSON.stringify(this.elements[0], function(key, value){

                if(value==""){
                    return undefined;
                }

                if(key=="scope") {
                    return { "$ref": "#/properties/" + value };
                }

                switch(key){

                    case "id":
                    case "$$hashKey":
                    case 'root':
                    case "metaData":
                        return undefined;
                        break;

                }

                return value;
            }, 2 /* two spaces as indentation */);
        }

    }

    angular.module('app.tree')
        .service('TreeService', TreeService);

}