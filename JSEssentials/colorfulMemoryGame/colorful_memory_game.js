const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'red', 'blue', 'green', 'purple', 'orange', 'pink'];
let cards = [];
let selectedCards = [];
let score = 0;
let timeLeft = 30;
let gameInterval;

const startbtn = document.getElementById('startbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

function generateCards() {
    for (const color of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.color = color;
        card.textContent = '?';
        gameContainer.appendChild(card);
    }
}

function shuffle(array) {
    
    const arrayCopy = [...array]; 
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
}

function handleCardClick(event) {
    const card = event.target;
    
    
    if (!card.classList.contains('card') || card.classList.contains('matched') || selectedCards.length >= 2) {
        return;
    }
    

    if (selectedCards.includes(card)) {
        return;
    }

    card.textContent = card.dataset.color;
    card.style.backgroundColor = card.dataset.color;
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;
    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        card1.textContent = '?';
        card2.textContent = '?';
        card1.style.backgroundColor = ''; // 
        card2.style.backgroundColor = '';
    }
    selectedCards = [];
}

function startGame() {

    clearInterval(gameInterval); 
    
    timeLeft = 30;
    score = 0; 
    selectedCards = [];
    
    startbtn.disabled = true;
    scoreElement.textContent = `Score: ${score}`;
    
    cards = shuffle(colors); 
    
    gameContainer.innerHTML = '';
    generateCards();
    

    gameContainer.removeEventListener('click', handleCardClick);
    gameContainer.addEventListener('click', handleCardClick);
    
    startGameTimer();
}

function startGameTimer() {
    timerElement.textContent = `Time Left: ${timeLeft}`;
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            alert('Game Over!');
            startbtn.disabled = false;
        }
    }, 1000);
}


startbtn.addEventListener('click', startGame);
