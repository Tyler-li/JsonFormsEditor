module app.core.connectors {

    import IHttpService = angular.IHttpService;
    import IIntervalService = angular.IIntervalService;
    import IWindowService = angular.IWindowService;
    import IPromise = angular.IPromise;
    import IQService = angular.IQService;
    import ILocationService = angular.ILocationService;

    export class GithubConnector {

        static $inject = ['$http', '$window', '$q', '$location'];

        private url;

        private repoList;
        private fileLevel:GithubFile[];
        private loadedFileContents;

        constructor(private $http:IHttpService, private $window:IWindowService, private $q:IQService, private $location:ILocationService) {
            this.url = $location.protocol() + "://" + $location.host() + ":" + $location.port();
        }

        showPopupGithub():IPromise<any> {
            var left = screen.width / 2 - 200;
            var top = screen.height / 2 - 200;
            var popup = this.$window.open('/github/login', '', "top=" + top + ", left=" + left + ", width=400, height=500");
            var deferred = this.$q.defer();

            window.onmessage = (event) => {
                //TODO detect only pertinent message
                popup.close();
                var data = event.data;
                this.repoList = JSON.parse(data.body);
                deferred.resolve();
            };
            return deferred.promise;

        }

        getRepoList():any {
            return this.repoList;
        }

        getBranchList(repoName:string):IPromise<any> {
            return this.$http.get(this.url + "/github/getBranchList?repoName=" + repoName, {});
        }

        getFilesFromBranch(repoName:string, branchName:string):IPromise<any> {
            return this.$http.get(this.url + "/github/getFilesFromBranch?repoName=" + repoName + "&branchName=" + branchName, {})
                .success((result) => {
                    this.fileLevel = result.map(function (obj) {
                        return new GithubFile(obj);
                    });
                });
        }

        getFileLevel():GithubFile[] {
            return this.fileLevel;
        }

        goIntoFolder(file: GithubFile):IPromise<any>{
            if(file.getType()!=='tree'){
                throw new Error('Calling method "goIntoFolder" with a regular file instead of a folder!');
            }
            return this.$http.get(this.url + "/github/getFileLevel?url="+file.getUrl())
                .success((result) => {
                    this.fileLevel = result.map(function(obj){
                        return new GithubFile(obj);
                    })
                });
        }

        loadFile(file:GithubFile):IPromise<any> {
            return this.$http.get(this.url + "/github/loadFile?url=" + file.getUrl())
                .success((result) => {
                    console.log('this is the loaded file contents, directly stored in the connector');
                    console.log(result);
                    this.loadedFileContents = result;
                });
        }
    }

    angular.module('app.core').service('GithubConnector', GithubConnector);
}