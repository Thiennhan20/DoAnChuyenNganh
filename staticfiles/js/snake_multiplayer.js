document.getElementById('multi-play-button').addEventListener('click', () => {
    // Ẩn main-container
    document.getElementById('main-container').classList.add('hidden');
    
    // Hiển thị multi-play-container và di chuyển vào màn hình
    document.getElementById('multi-play-container').classList.add('show');
    document.getElementById('multi-play-container').classList.remove('hidden');
});
document.addEventListener('DOMContentLoaded', function() {
    const logoText = "SNAKE.FAKE";
    const logoElement = document.getElementById('logo');
  
    // Split each character and wrap it in a <span> element
    logoElement.innerHTML = logoText.split('').map(char => `<span>${char}</span>`).join('');
});
  
// Sự kiện quay lại main-container
document.getElementById('back-to-main-button').addEventListener('click', () => {
    // Hiển thị lại main-container
    document.getElementById('main-container').classList.remove('hidden');
    
    // Ẩn multi-play-container
    document.getElementById('multi-play-container').classList.remove('show');
    document.getElementById('multi-play-container').classList.add('hidden');
});

// Sự kiện tạo phòng
document.getElementById('create-room-btn').addEventListener('click', () => {
    const roomName = document.getElementById('create-room-name').value;
    if (roomName) {
        console.log('Tạo phòng với tên:', roomName);
        // Thực hiện tạo phòng mới
    } else {
        alert('Vui lòng nhập tên phòng');
    }
});

// Sự kiện vào phòng
document.getElementById('join-room-btn').addEventListener('click', () => {
    const roomCode = document.getElementById('join-room-code').value;
    if (roomCode) {
        console.log('Vào phòng với mã:', roomCode);
        // Thực hiện kết nối vào phòng chơi theo mã phòng
    } else {
        alert('Vui lòng nhập mã phòng');
    }
});

