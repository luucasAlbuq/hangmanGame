angular.module('app').controller('controller',['$scope','$rootScope','service',function($scope,$rootScope,service){

	var self = this;
	/**
	 * This commands represents the hangaman commands:
	 * 1 - startGame / 2 - nextWord / 3 - nextWord / 4 - getResult / 5 - submitResult
	 */
	self.command = undefined;
	
	$scope.sessionID = undefined;
	$scope.serverOut;

	$scope.startGame = function(){
		service.startGame().then(function(sucess){
			$scope.serverOut = sucess;
		});
	};

	/* Give a word for the player */
	$scope.nextWord = function(){
		if($scope.serverOut.sessionId === undefined){
			alert("Ops! sessionId invalid!");
			return;
		}
		service.nextWord($scope.serverOut.sessionId).then(function(sucess){
			$scope.serverOut = sucess;	
		});
	};

	$scope.guess = function(){
		if($scope.serverOut.sessionId === undefined){
			alert("Ops! sessionId invalid!");
			return;
		}
		service.guess($scope.serverOut.sessionId, "P").then(function(sucess){
			$scope.serverOut = sucess;	
		});
	};

	$scope.getResult = function(){
		if($scope.serverOut.sessionId === undefined){
			alert("Ops! sessionId invalid!");
			return;
		}

		service.getResult($scope.serverOut.sessionId).then(function(sucess){
			$scope.serverOut = sucess;	
		});
	};

}]);
