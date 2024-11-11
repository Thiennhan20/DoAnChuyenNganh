const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Đặt vị trí camera
camera.position.z = 5;

// Tạo ánh sáng
const ambientLight = new THREE.AmbientLight(0x404040); // ánh sáng môi trường
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // ánh sáng định hướng
scene.add(directionalLight);

// Tạo hình khối cho Snake
const snakeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
scene.add(snake);

// Tạo thức ăn
const foodGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const foodMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // màu đỏ cho thức ăn
const food = new THREE.Mesh(foodGeometry, foodMaterial);
food.position.set(1, 0, 0);
scene.add(food);

// Điều khiển và logic game
let direction = { x: 0.02, y: 0 };
function animate() {
    requestAnimationFrame(animate);

    // Di chuyển Snake
    snake.position.x += direction.x;
    snake.position.y += direction.y;

    // Vòng lặp không ngừng
    renderer.render(scene, camera);
}

animate();

// Xử lý sự kiện bàn phím để điều khiển Snake
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            direction = { x: 0, y: 0.02 };
            break;
        case 'ArrowDown':
            direction = { x: 0, y: -0.02 };
            break;
        case 'ArrowLeft':
            direction = { x: -0.02, y: 0 };
            break;
        case 'ArrowRight':
            direction = { x: 0.02, y: 0 };
            break;
    }
});
