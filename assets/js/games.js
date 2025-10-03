// Thu Gian Games - PREMIUM INTERACTIVE FEATURES
console.log('Thu Gian Games loaded!');

// Game State Management
class GameState {
    constructor() {
        this.storageKey = 'keongot_games_progress';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = {
                coloringDrawings: [],
                memoryBestScore: 0,
                puzzleBestTime: 0,
                mathBestScore: 0,
                pianoRecordings: [],
                totalPlayTime: 0,
                achievements: []
            };
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    updateData(updates) {
        const data = this.getData();
        const newData = { ...data, ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(newData));
    }

    addAchievement(achievement) {
        const data = this.getData();
        if (!data.achievements.includes(achievement)) {
            this.updateData({
                achievements: [...data.achievements, achievement]
            });
            this.showAchievement(achievement);
        }
    }

    showAchievement(achievement) {
        const achievementModal = document.createElement('div');
        achievementModal.className = 'achievement-modal';
        achievementModal.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <h3>Thành tích mới!</h3>
                <p>${achievement}</p>
            </div>
        `;
        document.body.appendChild(achievementModal);
        
        setTimeout(() => {
            achievementModal.remove();
        }, 3000);
    }
}

// Initialize game state
const gameState = new GameState();

// Coloring Game
class ColoringGame {
    constructor() {
        this.canvas = document.getElementById('coloringCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentColor = '#FF6B9D';
        this.currentTool = 'brush';
        this.brushSize = 5;
        this.colors = [
            '#FF6B9D', '#4ECDC4', '#FFD93D', '#FF8C42', '#9B59B6',
            '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#34495E',
            '#E67E22', '#1ABC9C', '#8E44AD', '#F1C40F', '#E91E63'
        ];
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupColorPalette();
        this.setupTools();
        this.setupImageSelector();
        this.loadImage('house'); // Load default image
    }

    setupCanvas() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
    }

    setupColorPalette() {
        const palette = document.getElementById('colorPalette');
        palette.innerHTML = '';

        this.colors.forEach((color, index) => {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-btn';
            colorBtn.style.backgroundColor = color;
            colorBtn.dataset.color = color;
            if (index === 0) colorBtn.classList.add('active');
            
            colorBtn.addEventListener('click', () => this.selectColor(color, colorBtn));
            palette.appendChild(colorBtn);
        });
    }

    setupTools() {
        const tools = ['brushTool', 'eraserTool', 'clearTool', 'saveTool'];
        tools.forEach(toolId => {
            const tool = document.getElementById(toolId);
            if (tool) {
                tool.addEventListener('click', () => this.selectTool(toolId, tool));
            }
        });
    }

    setupImageSelector() {
        document.querySelectorAll('.image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectImage(e.target.dataset.image, e.target));
        });
    }

    selectImage(imageType, button) {
        document.querySelectorAll('.image-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.animateButton(button);
        this.loadImage(imageType);
    }

    loadImage(imageType) {
        this.clearCanvas();
        this.drawImage(imageType);
    }

    drawImage(imageType) {
        switch(imageType) {
            case 'house':
                this.drawHouse();
                break;
            case 'flower':
                this.drawFlower();
                break;
            case 'butterfly':
                this.drawButterfly();
                break;
            case 'tree':
                this.drawTree();
                break;
            case 'car':
                this.drawCar();
                break;
            case 'cat':
                this.drawCat();
                break;
            case 'sun':
                this.drawSun();
                break;
            case 'heart':
                this.drawHeart();
                break;
        }
    }

    drawCat() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Cat head - centered
        this.ctx.beginPath();
        this.ctx.arc(250, 180, 60, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Ears - centered
        this.ctx.beginPath();
        this.ctx.moveTo(210, 140);
        this.ctx.lineTo(230, 120);
        this.ctx.lineTo(250, 140);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(250, 140);
        this.ctx.lineTo(270, 120);
        this.ctx.lineTo(290, 140);
        this.ctx.stroke();
        
        // Eyes - centered
        this.ctx.beginPath();
        this.ctx.arc(230, 170, 8, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(270, 170, 8, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Nose - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 180);
        this.ctx.lineTo(245, 190);
        this.ctx.lineTo(255, 190);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Mouth - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 190);
        this.ctx.lineTo(240, 200);
        this.ctx.moveTo(250, 190);
        this.ctx.lineTo(260, 200);
        this.ctx.stroke();
        
        // Whiskers - centered
        this.ctx.beginPath();
        this.ctx.moveTo(200, 180);
        this.ctx.lineTo(220, 185);
        this.ctx.moveTo(200, 190);
        this.ctx.lineTo(220, 190);
        this.ctx.moveTo(280, 185);
        this.ctx.lineTo(300, 180);
        this.ctx.moveTo(280, 190);
        this.ctx.lineTo(300, 190);
        this.ctx.stroke();
        
        // Body - centered
        this.ctx.beginPath();
        this.ctx.ellipse(250, 280, 40, 60, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Tail - centered
        this.ctx.beginPath();
        this.ctx.moveTo(290, 280);
        this.ctx.quadraticCurveTo(330, 250, 350, 300);
        this.ctx.stroke();
    }

    drawSun() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Sun center - centered
        this.ctx.beginPath();
        this.ctx.arc(250, 200, 40, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Sun rays - centered
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            const startX = 250 + Math.cos(angle) * 50;
            const startY = 200 + Math.sin(angle) * 50;
            const endX = 250 + Math.cos(angle) * 70;
            const endY = 200 + Math.sin(angle) * 70;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        
        // Sun face - centered
        this.ctx.beginPath();
        this.ctx.arc(235, 185, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(265, 185, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(250, 210, 15, 0, Math.PI);
        this.ctx.stroke();
    }

    drawHeart() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Heart shape - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 250);
        this.ctx.bezierCurveTo(250, 200, 200, 200, 200, 230);
        this.ctx.bezierCurveTo(200, 260, 250, 300, 250, 300);
        this.ctx.bezierCurveTo(250, 300, 300, 260, 300, 230);
        this.ctx.bezierCurveTo(300, 200, 250, 200, 250, 250);
        this.ctx.stroke();
        
        // Heart decorations - centered
        this.ctx.beginPath();
        this.ctx.arc(230, 220, 3, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(270, 220, 3, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    selectColor(color, button) {
        this.currentColor = color;
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.animateButton(button);
    }

    selectTool(toolId, button) {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.animateButton(button);

        switch(toolId) {
            case 'brushTool':
                this.currentTool = 'brush';
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'eraserTool':
                this.currentTool = 'eraser';
                this.canvas.style.cursor = 'grab';
                break;
            case 'clearTool':
                this.clearCanvas();
                break;
            case 'saveTool':
                this.saveDrawing();
                break;
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.draw(e);
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.currentTool === 'brush') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.brushSize;
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = this.brushSize * 2;
        }

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.showMessage('Canvas đã được xóa!', 'success');
    }

    saveDrawing() {
        const dataURL = this.canvas.toDataURL('image/png');
        const data = gameState.getData();
        const newDrawing = {
            id: Date.now(),
            dataURL: dataURL,
            timestamp: new Date().toISOString()
        };
        
        gameState.updateData({
            coloringDrawings: [...data.coloringDrawings, newDrawing]
        });
        
        this.showMessage('Tranh đã được lưu!', 'success');
        gameState.addAchievement('Họa sĩ tài năng');
    }


    drawHouse() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // House base - centered
        this.ctx.strokeRect(150, 200, 200, 150);
        
        // Roof - centered
        this.ctx.beginPath();
        this.ctx.moveTo(130, 200);
        this.ctx.lineTo(250, 120);
        this.ctx.lineTo(370, 200);
        this.ctx.stroke();
        
        // Door - centered
        this.ctx.strokeRect(230, 280, 40, 70);
        
        // Windows - centered
        this.ctx.strokeRect(180, 230, 30, 30);
        this.ctx.strokeRect(290, 230, 30, 30);
        
        // Sun - centered
        this.ctx.beginPath();
        this.ctx.arc(400, 100, 30, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Grass - centered
        this.ctx.strokeStyle = '#2ECC71';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 500; i += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 400);
            this.ctx.lineTo(i + 5, 390);
            this.ctx.stroke();
        }
    }

    drawFlower() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Flower center - centered
        this.ctx.beginPath();
        this.ctx.arc(250, 200, 20, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Petals - centered
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x = 250 + Math.cos(angle) * 40;
            const y = 200 + Math.sin(angle) * 40;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // Stem - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 220);
        this.ctx.lineTo(250, 300);
        this.ctx.stroke();
        
        // Leaves - centered
        this.ctx.beginPath();
        this.ctx.ellipse(230, 250, 20, 10, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(270, 270, 20, 10, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    drawButterfly() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Body - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 150);
        this.ctx.lineTo(250, 250);
        this.ctx.stroke();
        
        // Wings - centered
        this.ctx.beginPath();
        this.ctx.ellipse(220, 180, 30, 20, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(280, 180, 30, 20, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(210, 220, 25, 15, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(290, 220, 25, 15, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Antennae - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 150);
        this.ctx.lineTo(240, 140);
        this.ctx.moveTo(250, 150);
        this.ctx.lineTo(260, 140);
        this.ctx.stroke();
    }

    drawTree() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Trunk - centered
        this.ctx.strokeRect(240, 250, 20, 100);
        
        // Leaves - centered
        this.ctx.beginPath();
        this.ctx.arc(250, 200, 60, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Branches - centered
        this.ctx.beginPath();
        this.ctx.moveTo(250, 250);
        this.ctx.lineTo(210, 220);
        this.ctx.moveTo(250, 250);
        this.ctx.lineTo(290, 220);
        this.ctx.stroke();
    }

    drawCar() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        // Car body - centered
        this.ctx.strokeRect(150, 200, 200, 80);
        
        // Wheels - centered
        this.ctx.beginPath();
        this.ctx.arc(190, 300, 20, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(310, 300, 20, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Windows - centered
        this.ctx.strokeRect(170, 210, 50, 40);
        this.ctx.strokeRect(280, 210, 50, 40);
        
        // Headlights - centered
        this.ctx.beginPath();
        this.ctx.arc(150, 220, 8, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(150, 260, 8, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }
}

// Memory Game
class MemoryGame {
    constructor() {
        this.grid = document.getElementById('memoryGrid');
        this.scoreElement = document.getElementById('memoryScore');
        this.movesElement = document.getElementById('memoryMoves');
        this.timeElement = document.getElementById('memoryTime');
        this.score = 0;
        this.moves = 0;
        this.time = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.gameTimer = null;
        this.icons = ['🐱', '🐶', '🐰', '🐸', '🐯', '🦁', '🐨', '🐼'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newMemoryGame').addEventListener('click', () => this.newGame());
        document.getElementById('memoryHint').addEventListener('click', () => this.showHint());
    }

    newGame() {
        this.score = 0;
        this.moves = 0;
        this.time = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.updateDisplay();
        this.createCards();
        this.startTimer();
    }

    createCards() {
        this.grid.innerHTML = '';
        const cards = [...this.icons, ...this.icons].sort(() => Math.random() - 0.5);
        
        cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.icon = icon;
            card.dataset.index = index;
            card.innerHTML = '<i class="fas fa-question"></i>';
            
            card.addEventListener('click', () => this.flipCard(card));
            this.grid.appendChild(card);
        });
    }

    flipCard(card) {
        if (this.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        card.innerHTML = card.dataset.icon;
        this.flippedCards.push(card);
        this.animateCard(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.icon === card2.dataset.icon) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.score += 10;
            this.animateMatch(card1, card2);
            
            if (this.matchedPairs === this.icons.length) {
                this.gameComplete();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = '<i class="fas fa-question"></i>';
                card2.innerHTML = '<i class="fas fa-question"></i>';
            }, 500);
        }
        
        this.flippedCards = [];
        this.updateDisplay();
    }

    animateCard(card) {
        card.style.transform = 'scale(1.1)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }

    animateMatch(card1, card2) {
        [card1, card2].forEach(card => {
            card.style.animation = 'matchPulse 0.6s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        });
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.time++;
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.movesElement.textContent = this.moves;
        this.timeElement.textContent = this.formatTime(this.time);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    gameComplete() {
        clearInterval(this.gameTimer);
        const data = gameState.getData();
        if (this.score > data.memoryBestScore) {
            gameState.updateData({ memoryBestScore: this.score });
            gameState.addAchievement('Trí nhớ siêu phàm');
        }
        this.showMessage('Chúc mừng! Bạn đã hoàn thành trò chơi!', 'success');
    }

    showHint() {
        if (this.flippedCards.length === 1) {
            const firstCard = this.flippedCards[0];
            const matchingCard = Array.from(this.grid.children).find(card => 
                card.dataset.icon === firstCard.dataset.icon && card !== firstCard
            );
            if (matchingCard) {
                matchingCard.style.border = '3px solid #FFD93D';
                setTimeout(() => {
                    matchingCard.style.border = '';
                }, 2000);
            }
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Math Game
class MathGame {
    constructor() {
        this.scoreElement = document.getElementById('mathScore');
        this.correctElement = document.getElementById('mathCorrect');
        this.wrongElement = document.getElementById('mathWrong');
        this.questionElement = document.getElementById('mathQuestion');
        this.answersElement = document.getElementById('mathAnswers');
        this.score = 0;
        this.correct = 0;
        this.wrong = 0;
        this.currentQuestion = null;
        this.difficulty = 'easy';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.dataset.level, e.target));
        });
    }

    selectDifficulty(level, button) {
        this.difficulty = level;
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.animateButton(button);
        this.generateQuestion();
    }

    generateQuestion() {
        const question = this.createQuestion();
        this.currentQuestion = question;
        
        this.questionElement.innerHTML = `
            <h4>${question.question}</h4>
            <div class="question-number">Câu hỏi ${this.correct + this.wrong + 1}</div>
        `;
        
        this.answersElement.style.display = 'grid';
        this.answersElement.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerBtn = document.createElement('button');
            answerBtn.className = 'answer-btn';
            answerBtn.textContent = answer;
            answerBtn.addEventListener('click', () => this.selectAnswer(answer, answerBtn));
            this.answersElement.appendChild(answerBtn);
        });
    }

    createQuestion() {
        let num1, num2, operation, correctAnswer;
        
        switch(this.difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operation = Math.random() < 0.5 ? '+' : '-';
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                operation = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
                break;
        }

        switch(operation) {
            case '+':
                correctAnswer = num1 + num2;
                break;
            case '-':
                correctAnswer = num1 - num2;
                break;
            case '×':
                correctAnswer = num1 * num2;
                break;
            case '÷':
                correctAnswer = Math.floor(num1 / num2);
                break;
        }

        const question = `${num1} ${operation} ${num2} = ?`;
        const answers = this.generateAnswers(correctAnswer);
        
        return { question, answers, correctAnswer };
    }

    generateAnswers(correctAnswer) {
        const answers = [correctAnswer];
        while (answers.length < 4) {
            const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer !== correctAnswer && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        return answers.sort(() => Math.random() - 0.5);
    }

    selectAnswer(answer, button) {
        const isCorrect = answer === this.currentQuestion.correctAnswer;
        
        if (isCorrect) {
            button.classList.add('correct');
            this.correct++;
            this.score += 10;
            this.animateButton(button, 'correct');
        } else {
            button.classList.add('wrong');
            this.wrong++;
            this.animateButton(button, 'wrong');
        }
        
        this.updateDisplay();
        
        setTimeout(() => {
            this.generateQuestion();
        }, 1500);
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.correctElement.textContent = this.correct;
        this.wrongElement.textContent = this.wrong;
    }

    animateButton(button, type) {
        if (type === 'correct') {
            button.style.animation = 'correctPulse 0.6s ease';
        } else {
            button.style.animation = 'wrongShake 0.6s ease';
        }
        
        setTimeout(() => {
            button.style.animation = '';
        }, 600);
    }
}

// Piano Game
class PianoGame {
    constructor() {
        this.audioContext = null;
        this.oscillators = {};
        this.recordings = [];
        this.isRecording = false;
        this.currentRecording = [];
        this.init();
    }

    init() {
        this.setupPianoKeys();
        this.setupEventListeners();
        this.initAudioContext();
    }

    setupPianoKeys() {
        const pianoKeys = document.getElementById('pianoKeys');
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Only white keys
        const octaves = [3, 4, 5]; // 3 octaves
        
        pianoKeys.innerHTML = '';
        
        octaves.forEach(octave => {
            notes.forEach((note, index) => {
                const key = document.createElement('div');
                const fullNote = `${note}${octave}`;
                
                key.className = 'piano-key';
                key.dataset.note = fullNote;
                key.textContent = note;
                key.title = fullNote;
                
                key.addEventListener('mousedown', () => this.playNote(fullNote, key));
                key.addEventListener('mouseup', () => this.stopNote(fullNote));
                key.addEventListener('mouseleave', () => this.stopNote(fullNote));
                
                pianoKeys.appendChild(key);
            });
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.song-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.playSong(e.target.dataset.song, e.target));
        });
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.error('Web Audio API not supported');
        }
    }

    playNote(note, keyElement) {
        if (!this.audioContext) return;
        
        const frequency = this.getFrequency(note);
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        
        oscillator.start();
        
        this.oscillators[note] = { oscillator, gainNode };
        
        if (this.isRecording) {
            this.currentRecording.push({
                note,
                time: this.audioContext.currentTime,
                duration: 0.5
            });
        }
        
        this.animateKey(keyElement);
    }

    stopNote(note) {
        if (this.oscillators[note]) {
            const { oscillator, gainNode } = this.oscillators[note];
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
            oscillator.stop(this.audioContext.currentTime + 0.1);
            delete this.oscillators[note];
        }
    }

    getFrequency(note) {
        const frequencies = {
            // Octave 3 - Only white keys
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            // Octave 4 - Only white keys
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            // Octave 5 - Only white keys
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
        };
        return frequencies[note] || 440;
    }

    animateKey(keyElement) {
        keyElement.style.transform = 'translateY(2px)';
        keyElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        
        setTimeout(() => {
            keyElement.style.transform = '';
            keyElement.style.boxShadow = '';
        }, 100);
    }


    playSong(songName, button) {
        document.querySelectorAll('.song-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const songs = {
            twinkle: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
            happy: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4'],
            mary: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'D4', 'D4', 'D4', 'E4', 'G4', 'G4'],
            jingle: ['E4', 'E4', 'E4', 'E4', 'E4', 'G4', 'C4', 'D4', 'E4', 'F4', 'F4', 'F4', 'F4', 'F4', 'E4', 'E4', 'E4', 'D4', 'D4', 'E4', 'D4', 'G4']
        };
        
        const song = songs[songName];
        if (song) {
            song.forEach((note, index) => {
                setTimeout(() => {
                    this.playNote(note);
                    setTimeout(() => this.stopNote(note), 400);
                }, index * 500);
            });
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }
}


// Initialize all games when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Thu Gian Games...');
    
    // Initialize games
    const coloringGame = new ColoringGame();
    const memoryGame = new MemoryGame();
    const mathGame = new MathGame();
    const pianoGame = new PianoGame();
    
    console.log('All games initialized successfully!');
});

// Add CSS for game messages and achievements
const style = document.createElement('style');
style.textContent = `
    .game-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 25px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .game-message.success {
        background: linear-gradient(135deg, #4ECDC4, #45B7B8);
    }
    
    .game-message.info {
        background: linear-gradient(135deg, #3498DB, #2980B9);
    }
    
    .achievement-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD93D, #FFEAA7);
        padding: 30px;
        border-radius: 25px;
        text-align: center;
        z-index: 1001;
        animation: achievementPop 0.5s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .achievement-icon {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .achievement-content h3 {
        color: var(--text-dark);
        margin-bottom: 10px;
        font-family: 'Patrick Hand', cursive;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes achievementPop {
        0% { transform: translate(-50%, -50%) scale(0); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);
