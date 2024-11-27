document.addEventListener("DOMContentLoaded", function () {
    const multiPlayButton = document.getElementById("multi-play-button");
    let playerSocket = null;

    // Room management
    let roomID = null;
    const maxPlayers = 5;

    multiPlayButton.addEventListener("click", function () {
        // Establish WebSocket connection for multiplayer
        playerSocket = new WebSocket(`ws://${window.location.host}/ws/multiplayer/`);

        playerSocket.onopen = function () {
            console.log("WebSocket connection for multiplayer established.");
            // Request to join or create a room
            playerSocket.send(JSON.stringify({ action: "join_room" }));
        };

        playerSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);

            if (data.action === "room_assigned") {
                // Display room ID and player info
                roomID = data.room_id;
                displayRoomInfo(data);
            } else if (data.action === "player_joined") {
                // Update player list when a new player joins
                updatePlayerList(data.players);
            } else if (data.action === "start_game") {
                // Start the game when all players are ready
                startMultiplayerGame(data.players);
            } else if (data.action === "room_full") {
                alert("Room is full. Please try again later.");
            }
        };

        playerSocket.onerror = function (error) {
            console.error("WebSocket error:", error);
        };

        playerSocket.onclose = function () {
            console.log("WebSocket connection for multiplayer closed.");
        };
    });

    function displayRoomInfo(data) {
        alert(`Joined Room: ${data.room_id}\nPlayers: ${data.players.map(p => p.username).join(", ")}`);
        // Optionally redirect to a new page or update the UI to show room details
    }

    function updatePlayerList(players) {
        console.log("Updated Player List:", players);
        // Update the room's player list on the UI
    }

    function startMultiplayerGame(players) {
        console.log("Starting Multiplayer Game with Players:", players);
        // Load the multiplayer game logic here
    }

    // Optional: Add functionality to leave the room or handle disconnection
    window.addEventListener("beforeunload", function () {
        if (playerSocket) {
            playerSocket.close();
        }
    });
});
