document.getElementById('single-play-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('back-button').addEventListener('click', goBackToMenu);
// Mở bảng chọn da khi nhấn nút "Thay Đổi Da"
document.getElementById('change-skin-button').addEventListener('click', () => {
    document.getElementById('skin-picker-overlay').classList.remove('hidden');
});

// Đóng bảng chọn da khi nhấn nút "Hủy"
document.getElementById('cancel-skin').addEventListener('click', () => {
    document.getElementById('skin-picker-overlay').classList.add('hidden');
});

// Cập nhật màu sắc xem trước theo lựa chọn của người dùng
document.getElementById('head-color').addEventListener('input', (event) => {
    document.getElementById('preview-snake-head').style.backgroundColor = event.target.value;
});

document.getElementById('body-color').addEventListener('input', (event) => {
    document.getElementById('preview-snake-body').style.backgroundColor = event.target.value;
});

document.getElementById('gradient-color-1').addEventListener('input', updateGradientPreview);
document.getElementById('gradient-color-2').addEventListener('input', updateGradientPreview);

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("leaderboard-button").addEventListener("click", function () {
        document.getElementById("leaderboard-overlay").classList.remove("hidden");
    });

    document.getElementById("close-leaderboard").addEventListener("click", function () {
        document.getElementById("leaderboard-overlay").classList.add("hidden");
    });
});


// Áp dụng màu sắc mới khi nhấn nút "Áp Dụng"
document.getElementById('apply-skin').addEventListener('click', () => {
    const headColor = document.getElementById('head-color').value;
    const bodyColor = document.getElementById('body-color').value;
    const gradientColor1 = document.getElementById('gradient-color-1').value;
    const gradientColor2 = document.getElementById('gradient-color-2').value;

    // Sử dụng bodyColor thay vì gradient nếu chỉ là màu đơn sắc
    COLORS.SNAKE_HEAD = headColor;
    COLORS.SNAKE_BODY = bodyColor;  // Dùng màu đơn sắc

    // Kiểm tra nếu người dùng muốn dùng gradient cho thân
    if (bodyColor === 'gradient') {
        // Tạo gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientColor1);
        gradient.addColorStop(1, gradientColor2);
        COLORS.SNAKE_BODY = gradient;
    }

    // Đóng bảng chọn màu
    document.getElementById('skin-picker-overlay').classList.add('hidden');
});

window.addEventListener('click', startMusicOnFirstInteraction);
window.addEventListener('keydown', startMusicOnFirstInteraction);

// Sự kiện để bật/tắt nhạc khi nhấn nút "Âm nhạc"
document.getElementById('music-button').addEventListener('click', () => {
    if (isTogglingMusic) return;  // Prevents multiple rapid triggers
    isTogglingMusic = true;

    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }

    setTimeout(() => {
        isTogglingMusic = false;
    }, 300);  // Debounce duration, adjust as needed
});

document.getElementById('single-play-button').addEventListener('click', () => {
    preventMusicStart = true;
    pauseMusic();  // Stop the background music
    startGame();
});

document.addEventListener("DOMContentLoaded", function() {
    const settingsButton = document.getElementById('bottom-left').querySelector('.btn-icon');
    const settingsMenu = document.getElementById('settings-menu');
    const closeSettingsButton = document.getElementById('close-settings');
    
    settingsButton.addEventListener('click', () => {
        console.log("Settings button clicked");
        settingsMenu.classList.add('active');
        settingsMenu.classList.remove('hidden');
    });
    
    
    closeSettingsButton.addEventListener('click', () => {
        settingsMenu.classList.remove('active');
        setTimeout(() => settingsMenu.classList.add('hidden'), 500); // Hide after animation
    });
});



const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let username = '';
let isTogglingMusic = false;
let snake = [{ x: 150, y: 150 }];
let direction = { x: 10, y: 0 };
let foods = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore'), 10) : 0;
let gameInterval;
const objectSize = 25;
const maxFoods = 10;
let snakeLength = 1;
const foodLifespan = 10000; // 10 seconds lifespan for each food item
const COLORS = {
    SNAKE_HEAD: '#006400',      // Dark green for the snake head
    SNAKE_BODY: '#8FBC8F',      // Light green for the snake body
    APPLE: '#FF0000',           // Red for apple
    ORANGE: '#FFA500',          // Orange for orange food
    PURPLE: '#800080'           // Purple for purple food
};
// Food types
const FOOD_TYPES = {
    RED: 'red',
    PURPLE: 'purple',
    ORANGE: 'orange'
};

let isBoosting = false;
let boostStartTime;
let boostPenaltyInterval;
let shortBoostCount = 0;
let lastBoostEndTime = 0;
let preventMusicStart = false;
const normalSpeed = 100;
const boostSpeed = 100 / 2; // 2x speed
const penaltyInterval = 5000; // 5 seconds in milliseconds
const penaltyPoints = 10;
const backgroundMusic = document.getElementById('background-music');
let isMusicPlaying = false;




function playMusic() {
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
    }).catch(error => {
        console.error("Lỗi khi phát nhạc:", error);
    });
}

// Hàm tạm dừng nhạc nền
function pauseMusic() {
    backgroundMusic.pause();
    isMusicPlaying = false;
}

// Bắt đầu phát nhạc khi người dùng tương tác lần đầu
function startMusicOnFirstInteraction() {
    if (!isMusicPlaying && !preventMusicStart) {
        playMusic();
        // Gỡ bỏ sự kiện sau khi đã phát nhạc lần đầu
        window.removeEventListener('click', startMusicOnFirstInteraction);
        window.removeEventListener('keydown', startMusicOnFirstInteraction);
    }
}

function updateGradientPreview() {
    const color1 = document.getElementById('gradient-color-1').value;
    const color2 = document.getElementById('gradient-color-2').value;
    document.getElementById('preview-snake-body').style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
}

function updateScoreDisplay() {
    document.getElementById('score').innerText = score;
    document.getElementById('high-score').innerText = highScore;
}

function startGame() {
    // Lấy giá trị username từ input
    username = document.getElementById('player-name').value || 'Player';
    // Thiết lập canvas và các thông số ban đầu
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('main-container').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('hud').style.display = 'flex';
    hideButtons();

    score = 0;
    updateScoreDisplay();
    resetGame();
    gameInterval = setInterval(updateGame, normalSpeed);
}


function hideButtons() {
    document.querySelectorAll('#top-left button, #bottom-left button, #bottom-right button').forEach(button => {
        button.classList.add('hidden');
    });
}

function updateGame() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        showGameOver();
    } else {
        drawGame();
    }
}

function activateBoost() {
    if (isBoosting || score <= 0 || snakeLength <= 1) return;
    sfxSwooshing.play();
    isBoosting = true;
    boostStartTime = Date.now();

    // Set boost speed
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, boostSpeed);

    // Start interval to apply penalties every 5 seconds while holding boost
    boostPenaltyInterval = setInterval(() => {
        if (isBoosting) {
            // Deduct points and decrease length, but ensure length is at least 1
            score = Math.max(score - penaltyPoints, 0);
            snakeLength = Math.max(snakeLength - 1, 1);
            updateScoreDisplay();
            adjustSnakeLength();

            // Stop boost immediately if both score and snakeLength reach minimum thresholds
            if (score === 0 && snakeLength === 1) {
                deactivateBoost(); // Stop boost immediately
            }
        }
    }, penaltyInterval); // Trigger every 5 seconds
}

function deactivateBoost() {
    if (!isBoosting) return;
    isBoosting = false;
    clearInterval(boostPenaltyInterval); // Stop the penalty interval when boost ends

    const boostDuration = Date.now() - boostStartTime;
    const currentTime = Date.now();

    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, normalSpeed);

    if (boostDuration < penaltyInterval) {
        if (currentTime - lastBoostEndTime < penaltyInterval) {
            shortBoostCount += 1;
            if (shortBoostCount >= 2) {
                score = Math.max(score - penaltyPoints, 0);
                snakeLength = Math.max(snakeLength - 1, 1);
                updateScoreDisplay();
                adjustSnakeLength();
                resetShortBoostCount();

                if (score === 0 && snakeLength === 1) {
                    deactivateBoost(); // Stop boost immediately if at minimum thresholds
                }
            }
        } else {
            resetShortBoostCount();
        }
    } else {
        resetShortBoostCount();
    }
    lastBoostEndTime = currentTime;
}

function adjustSnakeLength() {
    while (snake.length > snakeLength) {
        snake.pop(); // Remove extra segments to match the updated snake length
    }
}


// Function to reset the short boost counter and last end time
function resetShortBoostCount() {
    shortBoostCount = 0;
    lastBoostEndTime = 0;
}
function adjustSnakeLength() {
    while (snake.length > snakeLength) {
        snake.pop(); // Remove extra segments to match the updated snake length
    }
}

// Listen for keydown and keyup events to control boost
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isBoosting) {
        activateBoost();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        deactivateBoost();
    }
});

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Adjust collision detection to account for image size
    const foodIndex = foods.findIndex(food => 
        head.x < food.x + objectSize &&
        head.x + objectSize > food.x &&
        head.y < food.y + objectSize &&
        head.y + objectSize > food.y
    );

    if (foodIndex !== -1) {
        const food = foods[foodIndex];
        let pointsChange = 0;

        // Determine the points change based on food type
        if (food.type === FOOD_TYPES.RED) {
            pointsChange = 10;
            sfxPoint.play(); // Play sound for gaining points
            snakeLength += 1; // Increase snake length
        } else if (food.type === FOOD_TYPES.PURPLE) {
            pointsChange = -10;
            sfxWing.play(); // Play sound for losing points
            snakeLength = Math.max(snakeLength - 1, 1); // Decrease snake length but ensure it's at least 1
        } else if (food.type === FOOD_TYPES.ORANGE) {
            pointsChange = Math.random() < 0.5 ? 10 : -10;
            if (pointsChange > 0) {
                sfxPoint.play(); // Play sound for gaining points
            } else {
                sfxWing.play(); // Play sound for losing points
            }
            snakeLength = Math.max(snakeLength + (pointsChange / 10), 1); // Adjust length based on score change
        }

        // Update the score and ensure it doesn't go below zero
        score = Math.max(score + pointsChange, 0);
        updateScoreDisplay();
        
        // Remove the eaten food and place new food if needed
        foods.splice(foodIndex, 1);
        if (foods.length < maxFoods) {
            placeFood();
        }
    }

    // Ensure the new segment adds a gap after eating
    while (snake.length > snakeLength) {
        snake.pop();
    }

    // Add a consistent gap between the head and the first body segment
    if (snake.length > 1) {
        const firstBodyPart = snake[1];
        const gapSize = 5; // Adjust this to set the desired distance between head and first body part
        if (direction.x !== 0) {
            // Horizontal movement
            firstBodyPart.x = head.x - direction.x + (direction.x > 0 ? -gapSize : gapSize);
            firstBodyPart.y = head.y;
        } else {
            // Vertical movement
            firstBodyPart.y = head.y - direction.y + (direction.y > 0 ? -gapSize : gapSize);
            firstBodyPart.x = head.x;
        }
    }
}



function checkCollision() {
    const head = snake[0];
    
    // Check collision with body segments
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            console.log("Collision with body detected, playing die sound.");
            sfxDie.play();
            return true;
        }
    }

    // Check collision with the edges of the canvas
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        console.log("Boundary collision detected, playing die sound.");
        sfxDie.play(); // Play the die sound when hitting the edges
        return true;
    }
    
    return false;
}


function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#74ebd5');
    gradient.addColorStop(1, '#9face6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((part, index) => {
        if (index === 0) {
            // Draw the head
            ctx.fillStyle = COLORS.SNAKE_HEAD;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 15;
            
            // Draw the head as a rounded rectangle
            ctx.beginPath();
            ctx.moveTo(part.x, part.y);
            ctx.lineTo(part.x + objectSize, part.y); // Top side
            ctx.lineTo(part.x + objectSize, part.y + objectSize); // Right side
            ctx.lineTo(part.x, part.y + objectSize); // Bottom side
            ctx.closePath();
            ctx.fill();

            // Add eyes
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(part.x + objectSize * 0.3, part.y + objectSize * 0.3, objectSize / 8, 0, Math.PI * 2); // Left eye
            ctx.arc(part.x + objectSize * 0.7, part.y + objectSize * 0.3, objectSize / 8, 0, Math.PI * 2); // Right eye
            ctx.fill();

            // Add pupils
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(part.x + objectSize * 0.3, part.y + objectSize * 0.3, objectSize / 16, 0, Math.PI * 2); // Left pupil
            ctx.arc(part.x + objectSize * 0.7, part.y + objectSize * 0.3, objectSize / 16, 0, Math.PI * 2); // Right pupil
            ctx.fill();

            // Draw a forked tongue
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(part.x + objectSize * 0.5, part.y + objectSize); // Start at mouth position
            ctx.lineTo(part.x + objectSize * 0.5, part.y + objectSize + 10); // Middle of the tongue
            ctx.lineTo(part.x + objectSize * 0.45, part.y + objectSize + 15); // Left fork
            ctx.moveTo(part.x + objectSize * 0.5, part.y + objectSize + 10); // Middle of the tongue
            ctx.lineTo(part.x + objectSize * 0.55, part.y + objectSize + 15); // Right fork
            ctx.stroke();

            // Draw the username above the snake's head
            ctx.font = "16px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(username, part.x + objectSize / 2, part.y - 10);
        } else {
            // Draw the body parts with light green color and rounded edges
            ctx.fillStyle = COLORS.SNAKE_BODY;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(part.x + objectSize / 2, part.y + objectSize / 2, objectSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw the foods with specified colors and a glow effect
    foods.forEach(food => {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 15;

        if (food.type === FOOD_TYPES.RED) {
            ctx.fillStyle = COLORS.APPLE;
        } else if (food.type === FOOD_TYPES.PURPLE) {
            ctx.fillStyle = COLORS.PURPLE;
        } else if (food.type === FOOD_TYPES.ORANGE) {
            ctx.fillStyle = COLORS.ORANGE;
        }
        
        // Draw food as circles
        ctx.beginPath();
        ctx.arc(food.x + objectSize / 2, food.y + objectSize / 2, objectSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Reset shadow for other elements
    ctx.shadowBlur = 0;
}




function placeFood() {
    while (foods.length < maxFoods) {
        const type = getRandomFoodType();
        const x = Math.floor(Math.random() * (canvas.width / objectSize)) * objectSize;
        const y = Math.floor(Math.random() * (canvas.height / objectSize)) * objectSize;

        const food = { x, y, type };
        foods.push(food);

        setTimeout(() => {
            const index = foods.indexOf(food);
            if (index !== -1) {
                foods.splice(index, 1);
                placeFood();
            }
        }, foodLifespan);
    }
}


function getRandomFoodType() {
    const random = Math.random();
    if (random < 0.4) return FOOD_TYPES.RED;
    if (random < 0.7) return FOOD_TYPES.PURPLE;
    return FOOD_TYPES.ORANGE;
}

function changeDirection(event) {
    const { key } = event;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -10 };
    else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 10 };
    else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -10, y: 0 };
    else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 10, y: 0 };
}

document.addEventListener('keydown', changeDirection);

function showGameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById('final-score').innerText = score;
    document.getElementById('game-over-screen').classList.remove('hidden');
    updateScoreDisplay();
}

function goBackToMenu() {
    // Clear all game intervals to prevent background logic from running
    clearInterval(gameInterval);
    clearInterval(boostPenaltyInterval);

    // Hide the game over screen and reset display elements
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('main-container').style.display = 'block';
    canvas.style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    
    // Reset buttons and game state
    resetButtons();
    resetGame();

    // Play background music when returning to the main menu
    playMusic();
}


function restartGame() {
    // Ẩn màn hình game over và bắt đầu lại game ngay lập tức
    document.getElementById('game-over-screen').classList.add('hidden');
    score = 0; // Reset score for a new game
    updateScoreDisplay();
    resetGame();
    gameInterval = setInterval(updateGame, 100);
}

function resetButtons() {
    document.querySelectorAll('.btn-icon').forEach(button => {
        button.classList.remove('hidden');
    });
}

function resetGame() {
    // Reset the snake to its initial state
    snake = [{ x: Math.floor(canvas.width / 2 / objectSize) * objectSize, y: Math.floor(canvas.height / 2 / objectSize) * objectSize }];
    direction = { x: 10, y: 0 };
    snakeLength = 1; // Reset the length of the snake to 1
    foods = []; // Clear any existing food items
    placeFood(); // Place initial food items
    
    // Important: Ensure game-over-screen does not reappear unexpectedly
    document.getElementById('game-over-screen').classList.add('hidden');
    clearInterval(gameInterval); // Ensures no lingering game intervals
}

function updateLeaderboard() {
    const timeframe = document.getElementById("timeframe").value;
    
    // For demonstration, log the selected timeframe.
    // Replace this with code to fetch and display the correct leaderboard data.
    console.log("Selected timeframe:", timeframe);
    
    // Example: Update the leaderboard data based on the selected timeframe
    // if (timeframe === "weekly") { ... }
    // else if (timeframe === "daily") { ... }
    // else if (timeframe === "all_time") { ... }
}