document.getElementById("create-room-button").addEventListener("click", () => {
    roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("room-id-display").innerText = `Room ID: ${roomId}`;
    connectToRoom(roomId);
});

document.getElementById("join-room-button").addEventListener("click", () => {
    const inputRoomId = document.getElementById("room-id-input").value;
    if (inputRoomId) {
        roomId = inputRoomId;
        connectToRoom(roomId);
    }
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Lấy context để vẽ

// Hiển thị canvas khi bắt đầu game
canvas.style.display = 'block';

let chatSocket;
let players = {};
let foods = [];
let roomId;
let snake = [{ x: 150, y: 150 }];
let direction = { x: 10, y: 0 };
let score = 0;

function connectToRoom(roomId) {
    chatSocket = new WebSocket(`ws://${window.location.host}/ws/game/${roomId}/`);

    chatSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.type === "snake_move") {
            players[data.player_name] = {
                positions: data.snake_positions,
                score: data.score,
            };
            updateLeaderboard();
        } else if (data.type === "update_foods") {
            foods = data.foods;
        }
    };

    chatSocket.onclose = function () {
        console.log("WebSocket connection closed");
    };
}


function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    const foodIndex = foods.findIndex(food =>
        head.x < food.x + objectSize &&
        head.x + objectSize > food.x &&
        head.y < food.y + objectSize &&
        head.y + objectSize > food.y
    );

    if (foodIndex !== -1) {
        score += 10;
        foods.splice(foodIndex, 1);
        placeFood();
    } else {
        snake.pop();
    }

    // Gửi vị trí rắn qua WebSocket
    chatSocket.send(JSON.stringify({
        type: "move",
        player_name: username,
        snake_positions: snake,
        score: score,
    }));
}

function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / objectSize)) * objectSize;
    const y = Math.floor(Math.random() * (canvas.height / objectSize)) * objectSize;
    foods.push({ x, y });

    // Cập nhật thức ăn tới server nếu là chủ phòng
    if (isRoomHost) {
        chatSocket.send(JSON.stringify({
            type: "update_foods",
            foods: foods,
        }));
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ rắn của tất cả người chơi
    Object.values(players).forEach(player => {
        player.positions.forEach(part => {
            ctx.fillStyle = "green";
            ctx.fillRect(part.x, part.y, objectSize, objectSize);
        });
    });

    // Vẽ thức ăn
    foods.forEach(food => {
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, objectSize, objectSize);
    });

    // Vẽ rắn của chính mình
    snake.forEach(part => {
        ctx.fillStyle = "blue";
        ctx.fillRect(part.x, part.y, objectSize, objectSize);
    });
}

function updateLeaderboard() {
    const leaderboard = Object.entries(players)
        .sort(([, a], [, b]) => b.score - a.score)
        .map(([name, data]) => `<li>${name}: ${data.score}</li>`)
        .join("");
    document.getElementById("leaderboard").innerHTML = leaderboard;
}
