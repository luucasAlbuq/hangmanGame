angular.module('app').service('service',['$http',function($http){

	var playerId = "lucas.ufcg@gmail.com";
	var RESQUEST_URL = "https://strikingly-hangman.herokuapp.com/game/on";

	var config = {headers:{"Content-Type": "application/json","playerId":playerId}};

	/* Start the Game */
	this.startGame = function(){
		var data  = {"playerId":playerId, "action":"startGame"};
		return $http.post(RESQUEST_URL, data, config).then(function(response){
			console.log("--------- START GAME",response.data);
			return response.data;
		});
	};

	this.nextWord = function(sessionId){
		var data = {"sessionId":sessionId, "action":"nextWord"};
		return $http.post(RESQUEST_URL, data, config).then(function(response){
			console.log("--------- GIVE ME A WORD",response.data);
			return response.data;
		});
	};

	this.guess = function(sessionId,letter){
		var data = {"sessionId":sessionId, "action":"guessWord","guess":letter};
		return $http.post(RESQUEST_URL, data, config).then(function(response){
			console.log("--------- MAKE A GUESS",response.data);
			return response.data;
		});
	};

	this.getResult = function(sessionId){
		var data = {"sessionId":sessionId, "action":"getResult"};
		return $http.post(RESQUEST_URL, data, config).then(function(response){
			console.log("--------- GET RESULT",response.data);
			return response.data;
		});
	};

	this.submit = function(sessionId){
		var data = {"sessionId":sessionId, "action":"submitResult"};
		return $http.post(RESQUEST_URL, data, config).then(function(response){
			console.log("--------- SUBMIT RESULT",response.data);
			return response.data;
		});
	};

}]);
