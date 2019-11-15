/*Whack-a-Mole/Simon 2 in 1 game.
 combining wes bos and free code camp tutorial */

document.addEventListener("DOMContentLoaded", function () {

//get our element
  const intro = document.querySelector('.intro');
  const message = document.querySelector('.message');
  const messageWhack = document.querySelector('.message-whack');
  const choiceWhack = document.querySelector('.choice-whack');
  const choiceMime = document.querySelector('.choice-mime');
  const game = document.querySelector('.game');
  const holes = document.querySelectorAll('.hole');
  const moles = document.querySelectorAll('.mole');



//1ST GAME MIME A MOLE

//get our element
  const highStreak = document.querySelector('.high-streak');
  const currentStreak = document.querySelector('.current-streak');
  const strictMode = document.querySelector('.strict-mode');
  const normalMode = document.querySelector('.normal-mode');
  const mimeMenu = document.querySelector('.mime-menu');
  const mimeStartButton = document.querySelector('.mime-start');
  const mimeResetButton = document.querySelector('.mime-reset');
  const mimeSettings = document.querySelector('.mime-settings');
  const mimeInfo = document.querySelector('.mime-info');
  const mimeReset = document.querySelector('.mime-reset');


  //build out functions for menus screen

  function handleMode() {
    if (this.className === "strict-mode") {
      mime.strict = true;
    } else
    {
      mime.strict = false;
    }
    hide(mimeSettings);
    holes.forEach(hole => hole.classList.add("active"));
    game.classList.add("active");
    show(mimeInfo);
    holes.forEach(hole => hole.classList.add('avoid-clicks'));
    hide(mimeResetButton);
    show(mimeStartButton);
  }

  function toggleButtons() {
    if (!mime.playFinished) {
      holes.forEach(hole => hole.classList.add('avoid-clicks'));
    } else
    {
      holes.forEach(hole => hole.classList.remove('avoid-clicks'));
    }
  }

  function mimeMenuHandler() {
    hide(mimeInfo);
    hide(mode);
    hide(message);
    mimeResetGame();
    mime.high = 0;
    highStreak.textContent = 0;
    holes.forEach(hole => hole.classList.remove("active", "avoid-clicks"));
    holes.forEach(hole => hole.removeEventListener('click', playerClick));
    holes.forEach(mole => mole.classList.remove('up'));
    game.classList.remove("active");
    show(intro);
    startAnimation();
  }

  function mimeStartGame() {
    show(mimeResetButton);
    hide(mimeStartButton);
    hide(message);
    holes.forEach(hole => hole.addEventListener('click', playerClick));
    addToSequence();
  }

  function mimeResetGame() {
    hide(mimeResetButton);
    show(mimeStartButton);
    mime.sequence = [];
    mime.playerSequence = [];
    mime.playFinished = false;
    mime.holeNumber = 0;
    mime.count = 0;
    mime.streak = 0;
    currentStreak.textContent = mime.streak;
  }

  //Sounds

  //Error Sound https://freesound.org/people/original_sound/sounds/366103
  //get our elements
  const errorSound = document.querySelector(".error-sound");
  const sound1 = document.querySelector(".sound1");
  const sound2 = document.querySelector(".sound2");
  const sound3 = document.querySelector(".sound3");
  const sound4 = document.querySelector(".sound4");
  const soundArray = [sound1, sound2, sound3, sound4];

  //Gameplay
  let mime = {
    strict: false,
    sequence: [],
    playerSequence: [],
    playFinished: false,
    holeNumber: 0,
    count: 0,
    streak: 0,
    high: 0,
    speed: 600 };

//build out functions
  function addToSequence() {
    if (mime.sequence.length > 19) {
      show(message);
      message.textContent = 'You Win!';
      mimeResetGame();
      return;
    }
    let random = Math.floor(Math.random() * 4);
    mime.sequence.push(random);
    mime.streak++;
    currentStreak.textContent = mime.streak;
    if (mime.streak >= mime.high) {
      mime.high = mime.streak;
      highStreak.textContent = mime.high;
    }
    playSequence();
  }

  function playerClick() {
    if (mime.playFinished) {
      mime.holeNumber = parseInt(this.dataset.key);
      mime.playerSequence.push(mime.holeNumber);
      if (mime.holeNumber !== mime.sequence[mime.count]) {
        if (mime.strict) {
          error();
          mimeResetGame();
          show(message);
          message.textContent = 'Game Over';
          return;
        } else {
          mime.playerSequence = [];
          error();
          mime.count = 0;
          return;
        }
      }
      holes[mime.holeNumber].classList.add('light');
      holes[mime.holeNumber].classList.add('up');
      soundArray[mime.holeNumber].play();
      (function () {
        setTimeout(function () {
          holes[mime.holeNumber].classList.remove('light');
          holes[mime.holeNumber].classList.remove('up');
        }, mime.speed);
      })();
      if (mime.count >= mime.sequence.length - 1) {
        if (mime.sequence.length < 19) {
          show(message);
          message.textContent = 'Next Round';
        }
        setTimeout(function () {
          hide(message);
          mime.playerSequence = [];
          mime.count = 0;
          addToSequence();
          return;
        }, 2000);
      }
      mime.count++;
    }
  }

  function playSequence() {
    mime.playFinished = false;
    toggleButtons();
    for (let i = 0; i < mime.sequence.length; i++) {
      setTimeout(function () {
        if (mime.sequence.length === 0) {
          return;
        }
        holes[mime.sequence[i]].classList.add('light');
        holes[mime.sequence[i]].classList.add('up');
        soundArray[mime.sequence[i]].play();
        (function () {
          setTimeout(function () {
            if (mime.sequence.length === 0) {
              return;
            }
            holes[mime.sequence[i]].classList.remove('light');
            holes[mime.sequence[i]].classList.remove('up');
          }, mime.speed);
        })(i);
      }, i * (mime.speed * 2));
    }
    setTimeout(function () {
      mime.playFinished = true;
      toggleButtons();
    }, mime.sequence.length * (mime.speed * 2));
  }

  function error() {
    holes.forEach(hole => hole.classList.add('light', 'up'));
    errorSound.play();
    setTimeout(function () {
      holes.forEach(hole => hole.classList.remove('light', 'up'));
      if (!mime.strict) {
        message.textContent = 'Try Again';
        show(message);
        setTimeout(function () {
          hide(message);
          playSequence();
        }, mime.speed * 2);
      }
    }, mime.speed * 2.5);
  }

  //Event Listeners
  mimeStartButton.addEventListener('click', mimeStartGame);
  mimeResetButton.addEventListener('click', mimeResetGame);
  strictMode.addEventListener('click', handleMode);
  normalMode.addEventListener('click', handleMode);
  mimeMenu.addEventListener('click', mimeMenuHandler);


  //2ND GAME WHACK-A-MOLE

  const modeOptions = document.querySelectorAll('.mode-options > p');
  const currentScore = document.querySelector('.current-score');
  const highScore = document.querySelector('.high-score');
  const whackStartButton = document.querySelector('.whack-start');
  const whackMenu = document.querySelector('.whack-menu');
  const mode = document.querySelector('.mode');
  const whackInfo = document.querySelector('.whack-info');

  //Menu and Settings

  function modeSelectionHandler() {
    whack.modeSelection(this);
    show(whackInfo);
    hide(mode);
  }

  function menuHandler() {
    hide(whackInfo);
    whack.high = 0;
    whack.score = 0;
    hide(messageWhack);
    currentScore.textContent = whack.score;
    highScore.textContent = whack.high;
    moles.forEach(mole => mole.removeEventListener('click', whack.hit));
    moles.forEach(mole => mole.classList.remove('up'));
    show(intro);
    startAnimation();
  }

  //Gameplay build out functions

  let whack = {
    lastHole: null,
    timeUp: false,
    score: 0,
    high: 0,
    minPeep: 200,
    maxPeep: 1000,

    randomTime: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    randomHole: function (holes) {
      const idx = Math.floor(Math.random() * holes.length);
      const hole = holes[idx];
      if (hole === this.lastHole) {
        return this.randomHole(holes);
      }
      this.lastHole = hole;
      return hole;
    },

    peep: function () {
      const time = this.randomTime(whack.minPeep, whack.maxPeep);
      const hole = this.randomHole(holes);
      hole.classList.add('up');
      setTimeout(() => {
        hole.classList.remove('up');
        if (!whack.timeUp) {
          whack.peep();
        }
      }, time);
    },

    startGame: function (length) {
      hide(messageWhack);
      moles.forEach(mole => mole.addEventListener('click', whack.hit));
      currentScore.textContent = 0;
      whack.timeUp = false;
      whackStartButton.classList.add('avoid-clicks');
      whack.score = 0;
      whack.peep();
      setTimeout(() => {
        whack.timeUp = true;
        whackStartButton.classList.remove('avoid-clicks');

        setTimeout(() => {
          messageWhack.textContent = 'You Scored: ' + whack.score;
          show(messageWhack);
        }, 500);
      }, length);
    },

    hit: function (e) {
      if (!e.isTrusted) return;
      whack.score++;
      if (whack.score >= whack.high) {
        whack.high = whack.score;
      }
      this.parentElement.classList.remove('up');
      currentScore.textContent = whack.score;
      highScore.textContent = whack.high;
    },

    modeSelection: function (e) {
      let option = e.className;
      if (option === 'easy') {
        whack.minPeep = 1000;
        whack.maxPeep = 2000;
      }
      if (option === 'medium') {
        whack.minPeep = 200;
        whack.maxPeep = 1000;
      }
      if (option === 'hard') {
        whack.minPeep = 100;
        whack.maxPeep = 400;
      }
    } };


  //Event Listeners
  modeOptions.forEach(option => option.addEventListener('click', modeSelectionHandler));
  whackStartButton.addEventListener('click', () => whack.startGame(10000));
  whackMenu.addEventListener('click', menuHandler);

  

  //START MENU

  function startAnimation() {
    whack.timeUp = true;
    whack.timeUp = false;
    whack.peep();
  }

  function init() {
    hide(whackInfo);
    hide(mode);
    hide(mimeSettings);
    hide(mimeInfo);
    hide(mimeReset);
    hide(message);
    hide(messageWhack);
    startAnimation();
  }

  //Start Whack a mole game
  function whackStart() {
    whack.timeUp = true;
    hide(intro);
    show(mode);
  }

  //Start Mime a mole game
  function mimeStart() {
    whack.timeUp = true;
    hide(intro);
    show(mimeSettings);
  }

  //Event Listeners
  choiceWhack.addEventListener('click', whackStart);
  choiceMime.addEventListener('click', mimeStart);

  init();

  //Assiting functions
  NodeList.prototype.forEach = Array.prototype.forEach;

  function hide(element) {
    element.style.display = "none";
  }

  function show(element) {
    element.style.display = "";
  }

});