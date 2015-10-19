angular.module('app').controller('controller',['$scope','$rootScope','service',function($scope,$rootScope,service){

	var controller = $scope;
	/**
	 * This commands represents the hangaman commands:
	 * 1 - startGame / 2 - nextWord / 3 - nextWord / 4 - getResult / 5 - submitResult
	 */
	self.command = undefined;
	$scope.tentativas = '';

	/* English letter frequencies, sorted by frequency */
	var letters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D', 'L', 'C', 'U', 'M', 'W', 'F','G','Y','P','B','V','K','J','X','Q','Z' ];

	var teste = [['A','I','E','S','R','N','T','O','L','C','D','U','P','M','G','H','B','Y','F','V','K','W','Z','X','Q','J'],
				 ['A','O','E','I','U','M','B','H','S','R','N','T','L','C','D','P','G','Y','F','V','K','W','Z','X','Q','J'],
				 ['A','E','O','I','U','Y','H','B','C','K','R','N','T','L','D','P','M','G','H','F','V','W','Z','X','Q','J'],
				 ['A','E','O','I','U','Y','S','B','F','R','N','T','L','C','D','P','M','G','H','V','K','W','Z','X','Q','J'],
				 ['S','E','A','O','I','U','Y','H','R','N','T','L','C','D','P','M','G','B','F','V','K','W','Z','X','Q','J']]
/*6 	EAIOUSY
7 	EIAOUS
8 	EIAOU
9 	EIAOU
10 	EIOAU
11 	EIOAD
12 	EIOAF*/

	var words = [];


	$scope.sessionID = undefined;
	$scope.serverOut;

	function validateWord(word){
		return word.indexOf("*") > -1;
	};

	function validate(){
		if($scope.serverOut.sessionId === undefined){
			alert("Ops! sessionId invalid!");
			return;
		}if($scope.serverOut.data === undefined){
			alert("Ops! date is not valid");
			return;
		}
	};

	controller.startGame = function(){
		service.startGame().then(function(sucess){
			$scope.serverOut = sucess;
		});
	};

	/* Give a word for the player */
	$scope.nextWord = function(){
		validate();
		service.nextWord($scope.serverOut.sessionId).then(function(sucess){
			$scope.serverOut = sucess;	
		});
	};

	function makeAGuess(){
		/* Procura na lista de palavras as plavras que tenha o mesmo tamanho da palavra sorteada
		   e verifica*/
		for (i = 0; i < words.length; i++) {
			var word = words[i];
			console.log("!!!!!!!!!!!!!!!!!!! ",word);
			/* verifica se o tamanho das palavras sao compativeis */
    		if(word.length === $scope.serverOut.data.word.length){
    			console.log("PRIMEIRO FOR - tem palavras com o mesmo tamanho",$scope.serverOut.data.word);
    			/* intera sobre todos os caracteres da palavra */
    			for(j = 0; word.length; j++){
    				if(word.charAt(j)===$scope.serverOut.data.word.charAt(j)){
    					console.log("SEGUNDO FOR - opa pode ser essa palara");
    					if(j+1<=word.length){
    						/* verifica se o proximo palpite nao ja nao foi usado*/
    						if(!($scope.serverOut.data.word.indexOf(word.charAt(j+1)) > -1)){
    							console.log("Segundo guess: ",word.charAt(j+1));
    							return word.charAt(j+1);
    						}
    					}
    				}
    			}
			}
		};
	}

	$scope.guess = function(){
		validate();
		if($scope.serverOut.data.wrongGuessCountOfCurrentWord === undefined){
			return;
		}

		var lista = teste[$scope.serverOut.data.word.length-1];
		var indexLetters = $scope.serverOut.data.wrongGuessCountOfCurrentWord;
		var guess = lista[indexLetters];

		console.log("PRIMEIRO GUESS: ",guess);

		if($scope.serverOut.data.wrongGuessCountOfCurrentWord === 10){
			words.push($scope.serverOut.data.word);
			//$scope.nextWord();
			service.nextWord($scope.serverOut.sessionId).then(function(sucess){
				$scope.serverOut = sucess;	
				console.log(">>>>>>>>>> APRENDEU",words);
				makeAGuess();
			});
		}else{
			makeAGuess();
		}

		console.log("###### ",guess);
		$scope.tentativas = $scope.tentativas.concat(guess);
		service.guess($scope.serverOut.sessionId, guess).then(function(sucess){
			$scope.serverOut = sucess;

			/* atualiza a lista de palavras */
			words[words.length-1] = $scope.serverOut.data.word;

			if(validateWord($scope.serverOut.data.word)){
				$scope.guess();
			}else{
				console.log("ACERTOU");
				$scope.tentativas = '';
				words.push($scope.serverOut.data.word);
				nextWord();
			}
		});
	};

	$scope.getResult = function(){
		validate();
		service.getResult($scope.serverOut.sessionId).then(function(sucess){
			$scope.serverOut = sucess;	
		});
	};

}]);
