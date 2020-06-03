// let backgroundMusic = new Audio('./assets/sound/background.ogg');
// backgroundMusic.volume = 0.5;
// backgroundMusic.loop = true;

$("#game-start").hide();
document.querySelector("#end").style.display = "none";
$("#fp").hide();

let flipSound = new Audio("./assets/sound/flip.ogg");
let matchSound = new Audio("./assets/sound/match.ogg");
let notMatchSound = new Audio("./assets/sound/notmatch.ogg");

const cards = document.querySelectorAll(".cards");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let cardLeft = cards.length;
let interval = null;
let flip = 0;
let matches = 0;
const tTime = 60;

const scriptURL =
  "https://script.google.com/macros/s/AKfycbwHrtwpeb68_tSZplxtRdTJc4yhhqTBV3DhKEUWfGY8nSMyUvdT/exec";
const form = document.forms["submit-to-google-sheet"];

function flipCard() {
  flipSound.play();

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");
  ++flip;
  document.getElementById("flip").innerHTML = flip;
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  secondCard = this;
  checkForMatch();
  isFinish();
}

function isFinish() {
  if (cardLeft === 0) {
    // backgroundMusic.pause();
    clearInterval(interval);
    setTimeout(() => {
      $(".time").hide();
      $("#board").hide();
      $("#artName").hide(); 
      $("#ins").hide();
      $("#end").show();
      $("#game-end").hide();
      $("#content").html("Congrats, you've got a photographic memory!");
      document.getElementById("flips").innerHTML = flip;
      $("#hd").hide();

      document.querySelector("#matchesSubmit").value = matches;
      document.querySelector("#flipsSubmit").value = flip;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch(scriptURL, {
          method: "POST",
          dataType: "jsonp",
          crossDomain: true,
          body: new FormData(form),
        })
          .then((response) => {
            console.log("Success!", response);
          })
          .catch((error) => console.error("Error!", error.message));
          
        $("#emailForm").hide();
        $('#tt').hide();
        $('#fp').show();
        document.body.style.background = '#F8E052';
        $("#game-end").show();
      });

    }, 2000);
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    if (firstCard.dataset.framework == 1) {
      document.getElementById("artName").innerHTML =
        "Amedeo Modigliani, 'Red-headed Girl in Evening Dress', 1918";
    } else if (firstCard.dataset.framework == 2) {
      document.getElementById("artName").innerHTML =
        "Edouard Manet, 'In the Conservatory', 1879";
    } else if (firstCard.dataset.framework == 3) {
      document.getElementById("artName").innerHTML =
        "Juan Gris, 'Portrait of Pablo Picasso', 1912";
    } else if (firstCard.dataset.framework == 4) {
      document.getElementById("artName").innerHTML =
        "Roy Lichtenstein, 'Hopeless', 1963";
    } else if (firstCard.dataset.framework == 5) {
      document.getElementById("artName").innerHTML =
        "Johannes Vermeer, 'The Lacemaker', 1669";
    } else if (firstCard.dataset.framework == 6) {
      document.getElementById("artName").innerHTML =
        "Man Ray, 'Portrait of Rose Selavy', 1921";
    }
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchSound.play();

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  cardLeft -= 2;
  ++matches;
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  notMatchSound.play();

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffleCards() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function time() {
  let x = tTime;
  interval = setInterval(() => {
    document.getElementById("time-remaining").innerHTML = x;
    window.localStorage.setItem("currentTime", x);
    --x;
    if (x === -2) {
      $(".time").hide();
      $("#board").hide();
      $("#artName").hide();
      $("#inst").hide();
      $("#end").show();
      $("#ins").hide();
      $("#game-end").hide();
      $("#content").html("Oops, looks like you were all out of time! ");
      document.getElementById("flips").innerHTML = flip;
      document.getElementById("match").innerHTML = matches;

      document.querySelector("#matchesSubmit").value = matches;
      document.querySelector("#flipsSubmit").value = flip;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch(scriptURL, {
          method: "POST",
          dataType: "jsonp",
          crossDomain: true,
          body: new FormData(form),
        })
          .then((response) => {
            console.log("Success!", response);
          })
          .catch((error) => console.error("Error!", error.message));
          
        $("#emailForm").hide();
        $('#tt').hide();
        $('#fp').show();
        document.body.style.background = '#F8E052';
        $("#game-end").show();
      });
    }
  }, 1000);
}

function startGame() {
  // backgroundMusic.play();

  time();

  shuffleCards();

  // add event for each card can clicked
  cards.forEach((card) => card.addEventListener("click", flipCard));
}

$("#play-now").click(()=>{
  $("#game-play").hide();
  $("#game-start").show();
  startGame();
})

