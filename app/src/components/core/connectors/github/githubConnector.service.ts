module app.core.connectors {

    import IHttpService = angular.IHttpService;
    import IIntervalService = angular.IIntervalService;
    import IWindowService = angular.IWindowService;
    import IPromise = angular.IPromise;

    import IQService = angular.IQService;
    import ILocationService = angular.ILocationService;

    export class GithubConnector {

        static $inject = ['$http', '$window', '$q', '$location'];
	
        private repoList;
        private fileList;

        constructor(private $http:IHttpService, private $window:IWindowService, private $q: IQService, private $location: ILocationService) {
        }

        showPopupGithub(): IPromise<any> {
            var left = screen.width / 2 - 200;
            var top = screen.height /2 - 200;
            var popup = this.$window.open('/github/login', '', "top="+top+", left="+left+", width=400, height=500");
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

        getRepoList(): any{
            return this.repoList;
        }

        getBranchList(repoName: string): IPromise<any>{
            return this.$http.get(this.$location.path()+"/getBranchList?repoName="+repoName, {});
        }

        getFilesFromBranch(repoName: string, branchName: string): IPromise<any>{
            return this.$http.get(this.$location.path()+"/getFilesFromBranch?repoName="+repoName+"&branchName="+branchName, {})
                .success((result) => {
                    this.fileList = result;
                });
        }
        getFileList():any {
            return this.fileList;
        }
    }

    angular.module('app.core').service('GithubConnector', GithubConnector);
}