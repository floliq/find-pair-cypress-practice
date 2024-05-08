(function () {
  const inputCount = document.getElementById('count');
  const inputTime = document.getElementById('timer');
  const scoreText = document.querySelector('.game__result-score');
  let list = [];
  let cards = null;
  let [isFlippedCard, lockBoard] = [false, false];
  let [firstCard, secondCard] = [null, null];
  let [firstValue, secondValue] = [null, null];
  let time = 0;
  let started = false;
  let score = 0;
  let countPairs = 0;
  let interval;

  function createNumbersArray(count) {
    let numberCount = count;
    if (count < 2 || count > 10 || count % 2 !== 0) {
      numberCount = 4;
      inputCount.value = 4;
      countPairs = 4;
    }
    list = [];
    for (let i = 1; i < numberCount + 1; i++) {
      list.push(i, i);
    }
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function resetBoard() {
    [isFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    score += 1;
    scoreText.textContent = score;
    resetBoard();
    if (score === countPairs) {
      document.querySelector('.game__result').textContent = 'Ты победил';
      clearInterval(interval);
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1000);
  }

  function flipCard(event) {
    const item = event.target.parentElement;
    if (lockBoard) return lockBoard;
    if (event.target.parentElement === firstCard) return firstCard;
    item.classList.add('flip');
    if (!isFlippedCard) {
      isFlippedCard = true;
      firstCard = event.target.parentElement;
      firstValue = parseInt(firstCard.children[0].textContent, 10);
      return;
    }
    secondCard = event.target.parentElement;
    secondValue = parseInt(secondCard.children[0].textContent, 10);
    if (firstValue === secondValue) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function createCards() {
    for (const num of list) {
      const card = document.createElement('div');
      card.classList.add('game__card', 'col-3', 'd-flex');
      const face = document.createElement('span');
      face.classList.add(
        'game__face',
        'd-flex',
        'justify-content-center',
        'align-items-center',
      );
      face.textContent = num;
      const back = document.createElement('span');
      back.classList.add(
        'game__back',
        'd-flex',
        'justify-content-center',
        'align-items-center',
      );
      back.textContent = '?';
      card.append(face);
      card.append(back);
      document.querySelector('.game__cards').append(card);
    }
    cards = document.querySelectorAll('.game__card');
    cards.forEach((card) => card.addEventListener('click', flipCard));
    started = true;
  }

  function removeCards() {
    cards.forEach((card) => card.remove());
  }

  function loseGame() {
    cards.forEach((card) => {
      card.classList.add('flip');
      card.removeEventListener('click', flipCard);
    });
  }

  function startTimer() {
    time--;
    document.querySelector('.game__result-seconds').textContent = time;
    if (time === 0) {
      document.querySelector('.game__result').textContent = 'Ты проиграл';
      loseGame();
      clearInterval(interval);
    }
  }

  function startGame(count) {
    createNumbersArray(count);
    shuffle(list);
    if (started) {
      removeCards();
      clearInterval(interval);
    }
    createCards();
    interval = setInterval(startTimer, 1000);
  }

  function createGame() {
    score = 0;
    time = parseInt(inputTime.value, 10);
    if (time < 30 || time > 180) {
      time = 60;
      inputTime.value = 60;
    }
    document.querySelector('.game__result').innerHTML =
      `Счет: <span class="game__result-score">${score}</span> Время: <span class="game__result-seconds">${time}</span>`;
    const count = parseInt(inputCount.value, 10);
    document.querySelector('.game__result-seconds').textContent = time;
    countPairs = count;
    startGame(count);
  }

  window.createGame = createGame;
})();
