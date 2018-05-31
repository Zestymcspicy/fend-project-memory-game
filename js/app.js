/*
 * Create a list that holds all of your cards
 */
const symbolArray = ["cube", "cube", "anchor", "anchor", "bolt", "bolt", "leaf",
"leaf", "diamond", "diamond", "bicycle", "bicycle", "paper-plane-o",
 "paper-plane-o", "bomb", "bomb"];
let clearList = [];
let openList = [];
const moveScoreDisplay = document.querySelector("span");
let oldDeck = document.querySelector("ul.deck");
let restartGame = document.querySelector(".restart");
let moveScore = 0;
const starBox = document.querySelector(".stars");
let startingTime = 0;
let endingTime = 0;
let timer = document.querySelector(".timer");
const winModal = document.getElementById("win-modal");
let starScore = 3;
const playAgainButton = document.querySelector("#play-again");
const noThanksButton = document.querySelector("#no-thanks");

const cardCheck = function(event) {
  if (clearList.includes(event.target.id)){
    //had to handle errors from clicking on open cards
    return(console.log("nope"));
  }
  if (event.target.nodeName === "LI") {
    cardFlip(event.target);
  if ((openList.length) === 2) {
    moveScore++;
    theStars(moveScore);
    moveScoreDisplay.innerHTML = `${moveScore}`;
    oldDeck.removeEventListener("click", cardCheck, false);
    isItAMatch(event.target);
  }
  }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const newGame = function() {
  let newDeck = document.createElement("ul");
  newDeck.className = "deck";
  for (const cardSymbol of (shuffle(symbolArray))){
    let presentCardSymbol = document.createElement("i");
    presentCardSymbol.className = `fa fa-${cardSymbol}`;
    let presentCard = document.createElement("li");
    presentCard.id = `${cardSymbol}`;
    presentCard.className = "card";
    presentCard.appendChild(presentCardSymbol);
    newDeck.appendChild(presentCard);
  }
  moveScore = 0;
  moveScoreDisplay.innerHTML = `${moveScore}`;
  oldDeck.parentNode.replaceChild(newDeck, oldDeck);
  oldDeck = newDeck;
  startingTime = performance.now();
  deckListener();
  clearList = [];
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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

//restart button
restartGame.addEventListener("click", newGame);

newGame();

//make the cards flip
function cardFlip(theCard){
  theCard.classList.add("open","show");
  addToOpenList(theCard);
}

//store the cards
function addToOpenList(theCard){
  openList.push(`${theCard.id}`);
}

//checks for a match
function isItAMatch(theCard) {
    if (`${theCard.id}` === openList[0]) {
      matchedCards(theCard);
    }
    else {
      flipThemBack(theCard);
    }
  }

function deckListener() {
  oldDeck.addEventListener("click", cardCheck);
}

function partOfMatch(aCard){
  aCard.classList.add("match");
  aCard.classList.remove("open","show");
  aCard.parentNode.removeEventListener("click", cardCheck, true);
}

//handles matches and calls a win
function matchedCards(theCard){
  partOfMatch(theCard);
  let theMatch = document.querySelector(`#${theCard.id}.card.open.show`);
  partOfMatch(theMatch);
  clearList= clearList.concat(openList);
  openList = [];
  if (clearList.length === 16){
    youAreTheWinner();
  }
  deckListener();
}

function flipThemBack(theCard){
  setTimeout(function () {
    theCard.className = "card";
    let noMatch = document.querySelector(`#${openList[0]}.open.show`);
    noMatch.className = "card";
    openList = [];
    setTimeout(deckListener(), 500);
}, 1000);
}
//winner function with modal
const youAreTheWinner = function(){
  endingTime = performance.now();
  winModal.style.display = "block";
  document.getElementById("modal-text").innerHTML = `Way to go! You won in
  ${moveScore} moves! It took ${Math.round((endingTime-startingTime)/1000)}
  seconds. You scored ${starScore} stars!`;
}

playAgainButton.addEventListener("click", function (){
  winModal.style.display = "none";
  newGame();
});

function starDown (){
  star = starBox.querySelector("li");
  starBox.removeChild(star);
  starScore--;
}

const theStars = function(score) {
  if (score === 11){
    starDown();
  }
  if (score === 21){
    starDown();
  }
}

//running timer at the top of the screen
setInterval( function() {
  timer.innerHTML = `${Math.round((performance.now()-startingTime)/1000,1)}`;
}, 100);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
