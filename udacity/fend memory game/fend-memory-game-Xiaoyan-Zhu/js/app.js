/*
 * Create a list that holds all of your cards
 */



const listItems = document.getElementsByClassName("card");



const arrListItems = Array.prototype.slice.call(listItems);

const shuffledArray = shuffle(arrListItems);



// console.log(shuffledArray);

let newList = '';
for (i=0; i<shuffledArray.length; i++) {
	newList += shuffledArray[i].outerHTML;
}

function shuffleCards () {
	"use strict"
	document.getElementById("deck").innerHTML = newList;
}



//cards are evealed

let openCards = [];
let matchedCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	"use strict"
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one) --- revealCard()
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) --- addOpenCard()
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) --- matchCards()
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) --- hideCards()
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) --- updateMoveCounter()
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)  --- checkIfWon()
 */





// number of moves player has made - counts when cards are matched and when they are hidden

let matchedCount = 0;
let moveCount = 0;

//cards  are  matched
let matchingCards;
let displayedCards;

const allCards = document.getElementsByClassName('card');

//modal that appears on completing the game
const successModal = document.getElementById('success-modal');




//click function

	document.body.addEventListener('click', function(e) {
			"use strict"
	if (e.target.classList.contains("not-shown") && (document.querySelectorAll('.show').length < 2)) {	
		if (document.querySelectorAll('.not-shown').length == 16 && moveCount === 0) {
			runTimer();
		}
		
	
		let classMatch = e.target.querySelector('i').className;																	

		
			if (openCards.length < 1) { 			
				revealCard(e);
				addOpenCard(e);
				
			} else {  
					if (openCards.includes(classMatch)) {
						matchedCards.push(classMatch);
						revealCard(e);
						matchCards();
						updateMoveCount();
						openCards = [];
					} else {
						revealCard(e);
						hideCards();

					}
			}

	}  else {
		console.log("clicked outside cards");
	}
});	


// move counter

function updateMoveCount () {
   "use strict"
	moveCount += 1;
	if (moveCount === 1) {
		document.getElementById("moves-made").innerHTML =moveCount+" Move";
	} else {
		document.getElementById("moves-made").innerHTML =moveCount+" Moves";
	}

	adjustStars();
	

}


function matchCards() {
	    "use strict"
		matchedCount += 1;
		setTimeout(function() {
		matchingCards = document.querySelectorAll(".show");
		for (let i = 0; i< matchingCards.length; i++) {
			matchingCards[i].className = "card match";
			}
		console.log(matchingCards);
		checkIfWon();
		}, 1000);
}


// cards hidden

function hideCards () {
		"use strict"
	openCards = [];
	displayedCards = document.querySelectorAll(".show");

	setTimeout(function() { 
		console.log(displayedCards);
		for (let i = 0; i< displayedCards.length; i++) {
			displayedCards[i].className = "card not-shown";
			}
			}, 1000);
		updateMoveCount();

	}

// reveal cards

function revealCard(e) {
		"use strict"
	e.target.classList.add('show', 'open');
	e.target.classList.remove('not-shown');
	}

// 
function addOpenCard (e) {
		"use strict"
	let classMatch = e.target.querySelector('i').className;
	openCards.push(classMatch);
	}


//game completed model pop out

function checkIfWon () {
		"use strict"
	if (matchedCount === 8) {
		
		stopTimer();
		successModal.style.display='block';
		document.getElementById('success-message').innerHTML = "You completed the game in "+moveCount+" moves in "+completedTime+"!";
	if (moveCount > 0 && moveCount < 13)  {
		document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'><i class='fa fa-star'><i class='fa fa-star-half'>";
	}
	if (moveCount > 13 && moveCount < 19) {
	document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'><i class='fa fa-star'>";
	}
	if (moveCount > 19 && moveCount < 26) {
	document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'><i class='fa fa-star-half'>";
	}

	if(moveCount > 26) {
		document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'> you get one star, try complete in less moves next time.";
	}
}
		closeModal();
		

	}



function playAgain () {
		"use strict"
	playAgainButton.addEventListener('click', restartGame);
	displayTimer.textContent = "0:00";
}

//closing modal functions
function closeModal () {
		"use strict"
	closeModalButton.addEventListener('click', function () {
		successModal.style.display = 'none';
	});	
	window.addEventListener('click', windowCloseModal);
	playAgain();
}

function windowCloseModal (e) {
		"use strict"
	if (e.target == successModal) {
		successModal.style.display = 'none';
	}
}


// loop all cards and set class to not-show

function restartGame () {
		"use strict"
	for (let i = 0; i< allCards.length; i++) {
			allCards[i].className = "card not-shown";
			}

	shuffleCards();
	moveCount = 0;
	document.getElementById("moves-made").innerHTML = moveCount;
	openCards = [];
	matchedCards = [];
	matchingCards = '';
	displayedCards = '';

	successModal.style.display = 'none';
	stopTimer();
	displayTimer.textContent = "0:00";
	document.getElementById("moves-made").innerHTML =moveCount+" Moves";

}


//timer
const displayTimer = document.querySelector('#timer');
let clock;

let timerStart;
let timeNow;
let timerEnd;

let secondsElapsed;
let minutesElapsed;
let secondsRounded;
let secondsFormatted;
let timeElapsed;

let completedTime;

let clickToRun;


// run timer first click


function runTimer() {
		"use strict"
	timerStart = Date.now();
	clock = setInterval(function() {
	displayTime(clock);
	}, 1000)


	document.removeEventListener('click', runTimer);
}


function stopTimer() {
	"use strict"
	clearInterval(clock);
	completedTime = document.querySelector('#timer').textContent;

}

function displayTime(clock) {
	"use strict"
	timeNow = Date.now();
	secondsElapsed = (timeNow - timerStart) / 1000;
	minutesElapsed = Math.floor(secondsElapsed / 60);
	secondsRounded = Math.floor(secondsElapsed % 60);
	secondsFormatted = secondsRounded < 10 ? '0'+secondsRounded: secondsRounded;
	timeElapsed = minutesElapsed+":"+secondsFormatted;
	displayTimer.textContent = timeElapsed;
}


//star rating
const starRating = document.getElementsByClassName('stars')[0];

function adjustStars () {
		"use strict"
	if (moveCount > 0 && moveCount < 13) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star-half'></i></li>";
	}
	if (moveCount > 13 && moveCount < 19) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
	}
	if (moveCount > 19 && moveCount < 26) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star-half'></i></li>";
	}

	if(moveCount > 26) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li>";
	}
}

// close button
const closeModalButton = document.getElementsByClassName('close-button')[0];

// button restarts on model

const playAgainButton = document.getElementById('button-restart');

const restartButton = document.getElementsByClassName("restart")[0];

shuffleCards();



//restart button

restartButton.addEventListener('click', restartGame);

