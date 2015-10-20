
/*
*The main idea of the algorithm is to try a guess based on a matrix of possibilities. 
*This matrix is ordered according to the word size and frequency that the letter appears in word length X.
*Every round of guesses the algorithm stores the word to serve as base for the next attempt similar words. 
*In this way the algortimo should learn from your hunches.
*/
angular.module('app').controller('controller',['$scope','$rootScope','service',function($scope,$rootScope,service){

	var controller = $scope;
	/**
	 * This commands represents the hangaman commands:
	 * 1 - startGame / 2 - nextWord / 3 - nextWord / 4 - getResult / 5 - submitResult
	 */
	self.command = undefined;
	var chartUsed = '';
	/* English letter frequencies, sorted by frequency */
	var letters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D', 'L', 'C', 'U', 'M', 'W', 'F','G','Y','P','B','V','K','J','X','Q','Z' ];

	var matrix = [['A','I','E','S','R','N','T','O','L','C','D','U','P','M','G','H','B','Y','F','V','K','W','Z','X','Q','J'],
				 ['A','O','E','I','U','M','B','H','S','R','N','T','L','C','D','P','G','Y','F','V','K','W','Z','X','Q','J'],
				 ['A','E','O','I','U','Y','H','B','C','K','R','N','T','L','D','P','M','G','H','F','V','W','Z','X','Q','J'],
				 ['A','E','O','I','U','Y','S','B','F','R','N','T','L','C','D','P','M','G','H','V','K','W','Z','X','Q','J'],
				 ['S','E','A','O','I','U','Y','H','R','N','T','L','C','D','P','M','G','B','F','V','K','W','Z','X','Q','J'],
				 ['E','A','I','O','U','S','Y','T', 'N', 'H', 'R', 'D', 'L', 'C', 'M', 'W', 'F','G','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','A','O','U','S','T', 'N', 'H', 'R', 'D', 'L', 'C', 'M', 'W', 'F','G','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','A','O','U','T', 'N', 'H', 'R', 'D', 'L', 'C', 'M', 'W', 'F','G','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','A','O','U','T', 'N', 'H', 'R', 'D', 'L', 'C', 'M', 'W', 'F','G','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','O','A','U','T', 'N', 'H', 'R', 'D', 'L', 'C', 'M', 'W', 'F','G','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','O','A','D','T', 'N', 'S', 'H', 'R', 'L', 'C', 'U', 'M', 'W', 'F','G','Y','P','B','V','K','J','X','Q','Z' ],
				 ['E','I','O','A','F','T','O','N', 'S', 'H', 'R', 'D', 'L', 'C', 'U', 'M', 'W','G','Y','P','B','V','K','J','X','Q','Z' ]];

	var words = [];
	$scope.serverOut;

	function validateWord(word){
		return word.indexOf("*") > -1;
	};

	function validate(){
		if($scope.serverOut.sessionId === undefined){
			alert("Ops! sessionId invalid!");
			return;
		}if($scope.serverOut.data === undefined){
			alert("Ops! date invalid");
			return;
		}
	};

	controller.startGame = function(){
		/* START THE GAME*/
		service.startGame().then(function(sucess){
			$scope.serverOut = sucess;
			/* GIVE ME A WORD */
			service.nextWord($scope.serverOut.sessionId).then(function(sucess){
				$scope.serverOut = sucess;
				/* MAKE A GUESS */
				$scope.newGuess();
			});

		});
	};

	function chooseAChartOfList(){
		var index = Math.floor((Math.random() * letters.length));
		var guess = letters[index];
		
		var listOfGuess = matrix[$scope.serverOut.data.word.length-1];

		if($scope.indexLetters > listOfGuess.length){
			$scope.indexLetters = 0;
		}

		/* The first guess should be the chart of listOfGuess */
		if($scope.indexLetters === 0 || words.length === 0){
			/*Inicialize the indexLetters*/
			if(	$scope.indexLetters === undefined){
					$scope.indexLetters = 0;
			}
			/*The first guess it will be a chart from listOfGuess*/
			var char = listOfGuess[$scope.indexLetters];
			if(chartUsed.search(char) === -1){
				return listOfGuess[$scope.indexLetters];
			}else{
				$scope.indexLetters += 1;
				chooseAChartOfList();
			}
		}else{
			var char = listOfGuess[$scope.indexLetters];
			if(chartUsed.search(char) === -1){
				return listOfGuess[$scope.indexLetters];
			}
		}
	};

	function makeNewGuess(){
		var guess = chooseAChartOfList();
		var listOfGuess = matrix[$scope.serverOut.data.word.length-1];

		/* Verify if there´s a word in the historic for choose a best guess */
		for (i = 0; i < words.length; i++) {
			var word = words[i];
			/*Now Verify if there´s a word with the same length to the guess word*/
			if(word.length === $scope.serverOut.data.word.length){
				for(j = 0; j < word.length; j++){
					/*Verify if there's a chart at the same position, if it's true we make a guess*/
					if(word.charAt(j) === $scope.serverOut.data.word.charAt(j)){
						/*Guess it will be the next chart of word*/
						if(j+1 < word.length && $scope.serverOut.data.word.charAt(j+1) === '*' && word.charAt(j+1) != '*'){
							var char =  word.charAt(j+1);
							if(chartUsed.search(char) === -1){
								guess = word.charAt(j+1);
							}else{
								guess = chooseAChartOfList();
							}

						}
						/*Guess it will be the previus chart of word, if the previus chart of guess word it´s a '*' */
						else if( (j-1 >= 0 && j-1 < word.length) && $scope.serverOut.data.word.charAt(j-1) === '*' && word.charAt(j-1) != '*'){
							var char = word.charAt(j-1);
							if(chartUsed.search(char) === -1){
								guess = word.charAt(j-1);
							}else{
								guess = chooseAChartOfList();
							}
						}
						if(guess === undefined||guess===''){
							var index = Math.floor((Math.random() * letters.length));
							guess = letters[index];
						}
						return guess;
					}
				}
			}
		} //End loop
		/* If there is no word with the same length of guess word, we will choose a chart of listOfGuess */
		return listOfGuess[$scope.indexLetters];

	};


	$scope.newGuess = function(index){
		validate();

		/*The first guess it will be a chart from listOfGuess*/
		var guess = makeNewGuess();

		/*Verify if the number os wrong guess is bigger then 10, if it´s true give me a new word*/
		if($scope.serverOut.data.wrongGuessCountOfCurrentWord === 10){
			/*Store the previus word*/
			console.log(">>>> LEARN",words);
			words.push($scope.serverOut.data.word);
			/*Give me a new word and make a new guess*/
			service.nextWord($scope.serverOut.sessionId).then(function(sucess){
				chartUsed = '';
				$scope.serverOut = sucess;
				$scope.indexLetters = 0;
				guess = makeNewGuess();
				console.log("New Guess: ",guess);
			});
		}

		console.log(">>> INDEX:",$scope.indexLetters);
		console.log(">>> GUESS:",guess);

		/*It's time to make a guess, send to server*/
			service.guess($scope.serverOut.sessionId, guess).then(function(sucess){
					/*Store our guess*/
					chartUsed = chartUsed.concat(guess);
					console.log("WORD THAT WAS USED: ",chartUsed);
					/*Store information*/
					$scope.serverOut = sucess;
					/* checks if the word was discovered */
					if(validateWord($scope.serverOut.data.word)){
						/*You need make a another guess*/
						$scope.newGuess();
						/*Update the index, to another chart guess*/
						$scope.indexLetters += 1;
					}else{
						/*If the word it´s correct, give me another word and store the word*/
						words.push($scope.serverOut.data.word);
						$scope.indexLetters = 0;
						console.log(">>> LEARN",words);

						/*If we don´t discovered all guess word, we will try ask for a new word*/
						service.getResult($scope.serverOut.sessionId).then(function(sucess){
							if(sucess.score===undefined || sucess.score <= 500){
								console.log("TRY AGAIN");
								chartUsed = '';
								/**/
								service.nextWord($scope.serverOut.sessionId).then(function(sucess){
									$scope.serverOut = sucess;
									$scope.newGuess();
								});
							}else{
								console.log("YOU ROCK!", sucess.score);
								/* SUBMIT THE RESULT */
								service.submit($scope.serverOut.sessionId);
								return;
							}
						});

					}
			});

	};

}]);
