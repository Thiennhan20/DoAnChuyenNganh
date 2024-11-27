document.getElementById('single-play-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('back-button').addEventListener('click', goBackToMenu);
// Mở bảng chọn da khi nhấn nút "Thay Đổi Da"
document.getElementById('change-skin-button').addEventListener('click', () => {
    document.getElementById('skin-picker-overlay').classList.remove('hidden');
});
document.getElementById('single-play-button').addEventListener('click', () => {
    document.getElementById('player-name').value = username;
});

document.getElementById('chat-form').addEventListener("submit", (e) => {
    e.preventDefault();
      const messageInput = document.getElementById("message-input");
      const message = messageInput.value.trim();
      if (message) {
          chatSocket.send(JSON.stringify({ message: message }));
          messageInput.value = "";
      }
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
    document.getElementById('chat-box').classList.add('hidden');
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
// Khởi tạo biến cho chướng ngại vật và thời gian
let obstacles = [];
let isStunned = false;
let invulnerable = false;
let gameStartTime;
const stunDuration = 3000; // 3 seconds stun duration
const invulnerableDuration = 2000; // Thời gian miễn choáng là 2 giây
let star = null;
let isStarActive = false;
let level = 1;
let starDisplayDuration = 30000; // 20 seconds in milliseconds
let starTimer;
let scoreToSpawnStar = 50;
let totalScore = 0;
let pointSoundIndex = 0;
let wingSoundIndex = 0;
let swooshingSoundIndex = 0;
let foodRefreshInterval;
let obstacleRefreshInterval;
let timePerLevel = 60000; // 1 phút mỗi màn
let remainingTime; // Thời gian còn lại của màn hiện tại
let totalPlayTime = 0;

// Get elements
const chatBox = document.getElementById('chat-box');
const toggleChat = document.getElementById('toggle-chat');
const closeChat = document.getElementById('close-chat');

toggleChat.addEventListener('click', () => {
    chatBox.classList.add('expanded');
    toggleChat.classList.add('hidden');
    closeChat.classList.remove('hidden');
    document.querySelector('.chat-input').classList.remove('hidden'); // Hiển thị chat-input
});

closeChat.addEventListener('click', () => {
    chatBox.classList.remove('expanded');
    toggleChat.classList.remove('hidden');
    closeChat.classList.add('hidden');
    document.querySelector('.chat-input').classList.add('hidden'); // Ẩn chat-input
});




function playPointSound() {
    sfxPointInstances[pointSoundIndex].currentTime = 0; // Reset to start if the sound was played recently
    sfxPointInstances[pointSoundIndex].play();
    pointSoundIndex = (pointSoundIndex + 1) % sfxPointInstances.length; // Cycle to the next sound instance
}

function playWingSound() {
    sfxWingInstances[wingSoundIndex].currentTime = 0;
    sfxWingInstances[wingSoundIndex].play();
    wingSoundIndex = (wingSoundIndex + 1) % sfxWingInstances.length;
}

function playBoostSound() {
    sfxSwooshingInstances[swooshingSoundIndex].currentTime = 0; // Reset to start if the sound was played recently
    sfxSwooshingInstances[swooshingSoundIndex].play();
    swooshingSoundIndex = (swooshingSoundIndex + 1) % sfxSwooshingInstances.length; // Cycle to the next sound instance
}


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
    loadHighScore(); // Load high score từ máy chủ

    document.getElementById('time-remaining').classList.remove('hidden');
    document.getElementById('level-display').classList.remove('hidden');

    document.getElementById('level-number').innerText = level;
    username = document.getElementById('player-name').value || 'Player';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('main-container').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('hud').style.display = 'flex';
    hideButtons();

    gameStartTime = Date.now();
    placeObstacles();
    score = 0;
    updateScoreDisplay(); // Cập nhật hiển thị điểm

    resetGame();

    // Đảm bảo xóa các vòng lặp cũ nếu có
    clearInterval(foodRefreshInterval);
    clearInterval(obstacleRefreshInterval);

    timePerLevel = 60000; // Reset thời gian cho màn 1 (1 phút)
    remainingTime = timePerLevel; // Thời gian còn lại cho màn hiện tại

    // Thiết lập lại vòng lặp làm mới thức ăn và chướng ngại vật
    foodRefreshInterval = setInterval(refreshFoods, 10000); // Làm mới thức ăn mỗi 10 giây
    obstacleRefreshInterval = setInterval(refreshObstacles, 10000); // Làm mới chướng ngại vật mỗi 10 giây
    gameInterval = setInterval(updateGame, normalSpeed);
}







function hideButtons() {
    document.querySelectorAll('#top-left button, #bottom-left button, #bottom-right button').forEach(button => {
        button.classList.add('hidden');
    });
}

function updateGame() {
    if (isStunned) {
        checkTimeLimit(); // Tiếp tục cập nhật thời gian
        return; // Không di chuyển rắn
    }

    moveSnake();

    if (checkObstacleCollision()) {
        isStunned = true; // Đặt trạng thái choáng
        setTimeout(() => {
            isStunned = false; // Hết thời gian choáng
            invulnerable = true; // Kích hoạt khiên miễn choáng
            setTimeout(() => {
                invulnerable = false; // Hết thời gian miễn choáng
            }, invulnerableDuration);
        }, stunDuration);
    } else if (checkCollision()) {
        clearInterval(gameInterval);
        showGameOver();
    } else {
        drawGame();
    }

    // Gọi hàm kiểm tra giới hạn thời gian ở đây
    checkTimeLimit();

    // Kiểm tra điều kiện để xuất hiện ngôi sao
    if (score >= scoreToSpawnStar && !star) {
        star = {
            x: Math.random() * (canvas.width - objectSize),
            y: Math.random() * (canvas.height - objectSize)
        };
        isStarActive = true;

        // Chuyển đổi tất cả thức ăn thành chướng ngại vật ngay lập tức
        foods.forEach(food => {
            obstacles.push({
                x: food.x,
                y: food.y,
                width: objectSize,
                height: objectSize,
                type: Math.random() < 0.5 ? 'hole' : 'wall' // Ngẫu nhiên chọn loại chướng ngại vật
            });
        });
        foods = []; // Xóa toàn bộ thức ăn sau khi chuyển đổi

        // Tính thời gian hiển thị ngôi sao dựa trên thời gian còn lại của màn
        const starDisplayTime = remainingTime;

        // Đặt hẹn giờ để ngôi sao biến mất sau thời gian hiển thị hoặc khi hết giờ màn chơi
        starTimer = setTimeout(() => {
            star = null;
        }, starDisplayTime);
    }

    // Kiểm tra nếu rắn ăn ngôi sao
    if (star && checkStarCollision()) {
        clearTimeout(starTimer);
        star = null;
        proceedToNextLevel();
    }

    // Vẽ ngôi sao nếu có
    if (star) {
        drawStar(ctx, star.x, star.y, objectSize / 2); // Kích thước bằng nửa objectSize
    }
}




function activateBoost() {
    if (isBoosting || score <= 0 || snakeLength <= 1) return;
    playBoostSound();
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
            playPointSound();  // Play sound for gaining points
            snakeLength += 1; // Increase snake length
        } else if (food.type === FOOD_TYPES.PURPLE) {
            pointsChange = -10;
            playWingSound(); // Play sound for losing points
            snakeLength = Math.max(snakeLength - 1, 1); // Decrease snake length but ensure it's at least 1
        } else if (food.type === FOOD_TYPES.ORANGE) {
            pointsChange = Math.random() < 0.5 ? 10 : -10;
            if (pointsChange > 0) {
                playPointSound(); // Play sound for gaining points
            } else {
                playWingSound(); // Play sound for losing points
            }
            snakeLength = Math.max(snakeLength + (pointsChange / 10), 1); // Adjust length based on score change
        }

        // Update the score and ensure it doesn't go below zero
        score = Math.max(score + pointsChange, 0);
        updateScoreDisplay();
        
        if (score === 0 && isBoosting) {
            deactivateBoost();
        }

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
        const gapSize = 15; // Adjust this to set the desired distance between head and first body part
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
            ctx.fillStyle = invulnerable ? 'yellow' : (index === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY); // Đổi màu nếu miễn choáng
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = invulnerable ? 20 : 10; // Tăng hiệu ứng nếu miễn choáng
            
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
    // Vẽ chướng ngại vật
    drawObstacles();
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
        let x, y;
        do {
            // Tạo vị trí ngẫu nhiên cho thức ăn, đảm bảo không đặt gần biên canvas
            x = Math.floor(Math.random() * ((canvas.width - objectSize * 2) / objectSize)) * objectSize + objectSize;
            y = Math.floor(Math.random() * ((canvas.height - objectSize * 2) / objectSize)) * objectSize + objectSize;
        } while (isPositionOccupied(x, y)); // Kiểm tra vị trí có bị trùng hay không

        const food = { x, y, type };
        foods.push(food);

        // Hẹn giờ loại bỏ thức ăn nếu không ăn sau một khoảng thời gian nhất định
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
    // Thêm thời gian đã chơi của màn hiện tại vào tổng thời gian chơi
    const playTimeThisLevel = Math.min(Date.now() - gameStartTime, timePerLevel); // Giới hạn thời gian tối đa của màn
    totalPlayTime += playTimeThisLevel;

    // Tính toán tổng thời gian chơi dưới dạng phút và giây
    const totalMinutes = Math.floor(totalPlayTime / 60000);
    const totalSeconds = Math.floor((totalPlayTime % 60000) / 1000);
    const formattedTotalTime = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;

    document.getElementById('time-remaining').classList.add('hidden');
    document.getElementById('play-time').innerText = formattedTotalTime;

    // Hiển thị số màn đã vượt qua
    document.getElementById('levels-completed').innerText = level - 1; // Vì màn tiếp theo chỉ bắt đầu sau khi ăn sao

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById('final-score').innerText = score;
    document.getElementById('game-over-screen').classList.remove('hidden');
    updateScoreDisplay();
    saveHighScore(score);
}





function goBackToMenu() {
    clearInterval(gameInterval);
    clearInterval(foodRefreshInterval);
    clearInterval(obstacleRefreshInterval);

    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('main-container').style.display = 'block';
    canvas.style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('level-display').classList.add('hidden');

    resetButtons();
    resetGame();
    // Reset các giá trị liên quan đến ngôi sao
    if (starTimer) {
        clearTimeout(starTimer); // Hủy bộ đếm thời gian ngôi sao
    }
    star = null; // Xóa ngôi sao hiện tại
    isStarActive = false; // Ngôi sao không hoạt động

    // Đặt lại các giá trị về trạng thái ban đầu khi trở về menu
    level = 1; // Đặt lại màn chơi về màn 1
    timePerLevel = 60000; // Đặt lại thời gian mỗi màn về 1 phút
    remainingTime = timePerLevel; // Thời gian còn lại của màn đầu tiên
    scoreToSpawnStar = 50; // Đặt lại mốc điểm xuất hiện ngôi sao về 50
    gameStartTime = Date.now(); // Đặt lại thời gian bắt đầu
    totalPlayTime = 0;
    // Cập nhật giao diện hiển thị
    document.getElementById('level-number').innerText = level;

    
    document.getElementById('time-remaining').classList.add('hidden');
    document.getElementById('time-remaining').textContent = "01:00";

    playMusic();
    document.getElementById('chat-box').classList.remove('hidden'); // Thêm dòng này
}




function restartGame() {
    clearInterval(gameInterval);
    clearInterval(foodRefreshInterval);
    clearInterval(obstacleRefreshInterval);
    if (starTimer) {
        clearTimeout(starTimer); // Hủy bộ đếm thời gian ngôi sao
    }
    // Đặt lại các giá trị về trạng thái ban đầu
    level = 1; // Đặt lại màn chơi về màn 1
    timePerLevel = 60000; // Đặt lại thời gian mỗi màn về 1 phút
    remainingTime = timePerLevel; // Thời gian còn lại của màn đầu tiên
    scoreToSpawnStar = 50; // Đặt lại mốc điểm xuất hiện ngôi sao về 50
    totalPlayTime = 0; // Đặt lại tổng thời gian chơi
    score = 0; // Đặt lại điểm số
    star = null; // Xóa ngôi sao nếu có
    isStarActive = false; // Ngôi sao không hoạt động


    // Đặt lại hiển thị thời gian và màn
    document.getElementById('time-remaining').textContent = "01:00";
    document.getElementById('level-number').innerText = level;
    updateScoreDisplay();

    // Đặt lại đồ họa
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('time-remaining').classList.remove('hidden');
    document.getElementById('level-display').classList.remove('hidden');

    // Đặt lại trạng thái của trò chơi và chuẩn bị các đối tượng
    resetGame(); // Đặt lại rắn, thức ăn, chướng ngại vật
    gameStartTime = Date.now(); // Đặt lại thời gian bắt đầu

    // Đảm bảo xóa các vòng lặp cũ nếu có
    clearInterval(foodRefreshInterval);
    clearInterval(obstacleRefreshInterval);

    // Thiết lập lại các vòng lặp làm mới thức ăn và chướng ngại vật
    foodRefreshInterval = setInterval(refreshFoods, 10000); // Làm mới thức ăn mỗi 10 giây
    obstacleRefreshInterval = setInterval(refreshObstacles, 10000); // Làm mới chướng ngại vật mỗi 10 giây
    gameInterval = setInterval(updateGame, normalSpeed); // Thiết lập lại tốc độ trò chơi

    // Hiển thị canvas và HUD
    canvas.style.display = 'block';
    document.getElementById('hud').style.display = 'flex';
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
    foods = []; // Reset thức ăn
    obstacles = []; // Reset chướng ngại vật

    // Làm mới thức ăn và chướng ngại vật
    placeFood();
    placeObstacles();
    
    // Important: Ensure game-over-screen does not reappear unexpectedly
    document.getElementById('game-over-screen').classList.add('hidden');
    clearInterval(gameInterval); // Ensures no lingering game intervals
}

function updateLeaderboard() {
    const timeframe = document.getElementById("timeframe").value;
    fetch(`/get_high_scores/?timeframe=${timeframe}`)
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById("leaderboard-list").getElementsByTagName('tbody')[0];
            leaderboardList.innerHTML = ''; // Xóa các hàng cũ

            data.forEach(item => {
                const row = leaderboardList.insertRow();
                
                const usernameCell = row.insertCell();
                usernameCell.textContent = item.username;

                const scoreCell = row.insertCell();
                scoreCell.textContent = item.score;

                const levelsCell = row.insertCell();
                levelsCell.textContent = item.levels_completed;

                const timeCell = row.insertCell();
                const minutes = Math.floor(item.total_play_time / 60);
                const seconds = item.total_play_time % 60;
                timeCell.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`; // Hiển thị dưới dạng phút:giây
            });
        })
        .catch(error => console.error("Error fetching leaderboard:", error));
}


// Hàm để khởi tạo và đặt vị trí chướng ngại vật
function placeObstacles() {
    obstacles = []; // Xóa chướng ngại vật cũ

    const edgeBuffer = objectSize; // Dùng buffer bằng 1 objectSize để cách biên

    for (let i = 0; i < 5; i++) { // Tạo 5 chướng ngại vật
        let x, y;
        do {
            // Đảm bảo vị trí chướng ngại vật cách biên một khoảng "edgeBuffer"
            x = Math.floor(Math.random() * ((canvas.width - edgeBuffer * 2) / objectSize)) * objectSize + edgeBuffer;
            y = Math.floor(Math.random() * ((canvas.height - edgeBuffer * 2) / objectSize)) * objectSize + edgeBuffer;
        } while (isPositionOccupied(x, y)); // Kiểm tra vị trí có bị trùng hay không

        const obstacle = {
            x: x,
            y: y,
            width: Math.random() < 0.5 ? objectSize : objectSize * 2, // Hố có kích thước bằng objectSize, tường có kích thước objectSize * 2
            height: objectSize,
            type: Math.random() < 0.5 ? 'hole' : 'wall' // Ngẫu nhiên chọn loại chướng ngại vật
        };
        obstacles.push(obstacle);
    }
}




// Hàm kiểm tra va chạm với chướng ngại vật
function checkObstacleCollision() {
    const head = snake[0];
    const tolerance = objectSize / 4; // Tolerance nhỏ để tránh choáng sớm

    if (invulnerable) return false; // Nếu có khiên miễn choáng thì không gây choáng

    return obstacles.some(obstacle => {
        return (
            head.x + tolerance < obstacle.x + obstacle.width &&
            head.x + objectSize - tolerance > obstacle.x &&
            head.y + tolerance < obstacle.y + obstacle.height &&
            head.y + objectSize - tolerance > obstacle.y
        );
    });
}


// Cập nhật thời gian chơi và kiểm tra thua
function checkTimeLimit() {
    const elapsedTime = Date.now() - gameStartTime; 
    remainingTime = timePerLevel - elapsedTime;

    if (remainingTime <= 0) {
        // Hết giờ màn chơi, xóa ngôi sao nếu có
        if (star) {
            clearTimeout(starTimer);
            star = null;
        }

        clearInterval(gameInterval);
        showGameOver();
        document.getElementById('time-remaining').textContent = "00:00"; 
    } else {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        document.getElementById('time-remaining').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}




function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'hole') {
            // Vẽ hố với kích thước bằng 1 cục thức ăn (objectSize)
            const centerX = obstacle.x + objectSize / 2;
            const centerY = obstacle.y + objectSize / 2;
            const maxRadius = objectSize / 2;

            // Tạo hiệu ứng lốc xoáy
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, maxRadius - i * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + i * 0.1})`;
                ctx.fill();
            }

            // Thêm phần trung tâm sáng hơn của hố
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius / 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(50, 50, 50, 0.8)`;
            ctx.fill();
        } else if (obstacle.type === 'wall') {
            // Vẽ tường có kích thước bằng 2 cục thức ăn (width = objectSize * 2, height = objectSize)
            ctx.fillStyle = 'gray';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Thêm họa tiết gạch
            ctx.strokeStyle = 'darkgray';
            ctx.lineWidth = 1;
            for (let y = obstacle.y; y < obstacle.y + obstacle.height; y += objectSize / 2) {
                ctx.beginPath();
                ctx.moveTo(obstacle.x, y);
                ctx.lineTo(obstacle.x + obstacle.width, y);
                ctx.stroke();
            }
            for (let x = obstacle.x; x < obstacle.x + obstacle.width; x += objectSize / 2) {
                ctx.beginPath();
                ctx.moveTo(x, obstacle.y);
                ctx.lineTo(x, obstacle.y + obstacle.height);
                ctx.stroke();
            }
        }
    });
}




// Hàm kiểm tra xem một vị trí có bị trùng với các vật thể khác (thức ăn hoặc chướng ngại vật) không
function isPositionOccupied(x, y) {
    // Check if the position overlaps with any food item
    for (let food of foods) {
        if (Math.abs(food.x - x) < objectSize && Math.abs(food.y - y) < objectSize) {
            return true;
        }
    }
    // Check if the position overlaps with any obstacle
    for (let obstacle of obstacles) {
        if (
            x < obstacle.x + obstacle.width &&
            x + objectSize > obstacle.x &&
            y < obstacle.y + obstacle.height &&
            y + objectSize > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

// Hàm để làm mới vị trí thức ăn, đảm bảo không trùng với chướng ngại vật
function refreshFoods() {
    foods = []; // Xóa toàn bộ thức ăn cũ

    for (let i = 0; i < maxFoods; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvas.width / objectSize)) * objectSize;
            y = Math.floor(Math.random() * (canvas.height / objectSize)) * objectSize;
        } while (isPositionOccupied(x, y)); // Kiểm tra vị trí để tránh chồng lên nhau

        const type = getRandomFoodType(); // Loại thức ăn ngẫu nhiên
        const food = { x, y, type };

        if (isStarActive) {
            // Nếu ngôi sao đang hoạt động, chuyển thức ăn thành chướng ngại vật
            obstacles.push({
                x: food.x,
                y: food.y,
                width: objectSize,
                height: objectSize,
                type: Math.random() < 0.5 ? 'hole' : 'wall' // Loại chướng ngại vật ngẫu nhiên
            });
        } else {
            // Nếu không có ngôi sao, thêm thức ăn vào danh sách foods
            foods.push(food);
        }
    }
}



// Hàm làm mới vị trí của chướng ngại vật, đảm bảo không trùng với thức ăn
function refreshObstacles() {
    if (isStarActive) return; // Nếu ngôi sao đang hoạt động, không làm mới chướng ngại vật

    obstacles = []; // Làm mới danh sách chướng ngại vật
    for (let i = 0; i < 5; i++) { // Tạo 5 chướng ngại vật mới
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvas.width / objectSize)) * objectSize;
            y = Math.floor(Math.random() * (canvas.height / objectSize)) * objectSize;
        } while (isPositionOccupied(x, y)); // Đảm bảo vị trí không bị trùng

        obstacles.push({
            x: x,
            y: y,
            width: objectSize * 2, // Kích thước chướng ngại vật
            height: objectSize,
            type: Math.random() < 0.5 ? 'hole' : 'wall' // Ngẫu nhiên loại chướng ngại vật
        });
    }
}





function drawStar(ctx, x, y, size) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(
            x + size * Math.cos((18 + i * 72) * Math.PI / 180),
            y - size * Math.sin((18 + i * 72) * Math.PI / 180)
        );
        ctx.lineTo(
            x + (size / 2) * Math.cos((54 + i * 72) * Math.PI / 180),
            y - (size / 2) * Math.sin((54 + i * 72) * Math.PI / 180)
        );
    }
    ctx.closePath();
    ctx.fill();
}

function checkStarCollision() {
    const head = snake[0];
    if (
        head.x < star.x + objectSize &&
        head.x + objectSize > star.x &&
        head.y < star.y + objectSize &&
        head.y + objectSize > star.y
    ) {
        star = null; // Xóa ngôi sao
        isStarActive = false; // Ngôi sao không còn hoạt động
        refreshFoods(); // Làm mới lại thức ăn
        return true;
    }
    return false;
}


function proceedToNextLevel() {
    // Thêm thời gian đã chơi của màn hiện tại vào tổng thời gian chơi
    const elapsedTime = Date.now() - gameStartTime;
    totalPlayTime += elapsedTime;

    // Tăng level và điểm cần thiết để xuất hiện sao
    level++;
    scoreToSpawnStar *= 2; // Tăng gấp đôi điểm yêu cầu để xuất hiện ngôi sao
    timePerLevel += 60000; // Mỗi màn tăng thêm 1 phút
    remainingTime = timePerLevel; // Reset thời gian còn lại cho màn mới
    isStarActive = false; // Reset trạng thái ngôi sao
    star = null;
    gameStartTime = Date.now(); // Đặt lại thời gian bắt đầu cho màn mới
    refreshFoods(); // Làm mới thức ăn
    refreshObstacles(); // Làm mới chướng ngại vật

    // Đồng bộ hóa lại vòng lặp làm mới thức ăn và chướng ngại vật mỗi 10 giây
    clearInterval(foodRefreshInterval);
    clearInterval(obstacleRefreshInterval);

    foodRefreshInterval = setInterval(() => {
        if (remainingTime > 0) {
            refreshFoods(); // Làm mới thức ăn mỗi 10 giây
        }
    }, 10000); // Làm mới thức ăn mỗi 10 giây

    obstacleRefreshInterval = setInterval(() => {
        if (remainingTime > 0) {
            refreshObstacles(); // Làm mới chướng ngại vật mỗi 10 giây
        }
    }, 10000); // Làm mới chướng ngại vật mỗi 10 giây

    // Cập nhật giao diện màn hiện tại
    document.getElementById('level-number').innerText = level;

    // Reset ngôi sao nếu có
    if (starTimer) {
        clearTimeout(starTimer);
        star = null;
    }

    // Kiểm tra nếu điểm số đủ điều kiện, tạo ngôi sao mới
    if (score >= scoreToSpawnStar && !star) {
        star = { 
            x: Math.random() * (canvas.width - objectSize), 
            y: Math.random() * (canvas.height - objectSize) 
        };

        const starDisplayTime = remainingTime; // Thời gian hiển thị ngôi sao theo thời gian còn lại
        starTimer = setTimeout(() => {
            star = null;
        }, starDisplayTime);

        // Chuyển đổi tất cả thức ăn thành chướng ngại vật khi ngôi sao xuất hiện
        foods.forEach(food => {
            obstacles.push({
                x: food.x,
                y: food.y,
                width: objectSize,
                height: objectSize,
                type: Math.random() < 0.5 ? 'hole' : 'wall' // Ngẫu nhiên chọn loại chướng ngại vật
            });
        });
        foods = []; // Xóa thức ăn sau khi chuyển đổi
    }

    // Hiển thị thông báo chuyển màn
    let levelMessage = document.createElement('div');
    levelMessage.innerText = `Màn ${level}`;
    levelMessage.style.position = 'fixed';
    levelMessage.style.top = '50%';
    levelMessage.style.left = '50%';
    levelMessage.style.transform = 'translate(-50%, -50%)';
    levelMessage.style.color = 'white';
    levelMessage.style.fontSize = '3rem';
    levelMessage.style.fontWeight = 'bold';
    document.body.appendChild(levelMessage);

    setTimeout(() => document.body.removeChild(levelMessage), 2000); // Hiển thị trong 2 giây
}

