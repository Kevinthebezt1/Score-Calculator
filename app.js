let players = [];
let scorePenalty = 0;
let matchHistory = [];

function initializeGame() {
  const playerCount = parseInt(document.getElementById("player-count").value);
  scorePenalty = parseInt(document.getElementById("score-penalty").value);

  if (!playerCount || !scorePenalty || playerCount < 2) {
    alert("Please enter valid inputs.");
    return;
  }

  players = Array.from({ length: playerCount }, (_, i) => ({
    name: `Player ${i + 1}`,
    score: 0
  }));
  matchHistory = [];

  saveToLocalStorage();

  updateMatchHistoryTable();
  populateWinnerDropdown();

  document.querySelector(".match-input").style.display = "block";
}

function logMatch() {
  const winnerIndex = parseInt(document.getElementById("match-winner").value);
  const totalPenalty = scorePenalty * (players.length - 1);

  // Update scores
  players.forEach((player, index) => {
    if (index === winnerIndex) {
      player.score += totalPenalty;
    } else {
      player.score -= scorePenalty;
    }
  });

  // Add to match history
  matchHistory.push({
    matchNumber: matchHistory.length + 1,
    winnerIndex,
    scores: players.map(player => `${player.name}: ${player.score}`).join(", ")
  });

  saveToLocalStorage();
  updateMatchHistoryTable();
}

function removeMatch(matchIndex) {
  // Remove match from history
  matchHistory.splice(matchIndex, 1);

  // Recalculate all scores
  players = players.map(player => ({ name: player.name, score: 0 }));
  matchHistory.forEach(match => {
    const totalPenalty = scorePenalty * (players.length - 1);
    players.forEach((player, index) => {
      if (index === match.winnerIndex) {
        player.score += totalPenalty;
      } else {
        player.score -= scorePenalty;
      }
    });
    match.scores = players.map(player => `${player.name}: ${player.score}`).join(", ");
  });

  saveToLocalStorage();
  updateMatchHistoryTable();
}

function clearGame() {
  if (confirm("Are you sure you want to clear the game?")) {
    localStorage.clear();
    location.reload();
  }
}

function updateMatchHistoryTable() {
  const tableBody = document.querySelector("#match-history-table tbody");
  tableBody.innerHTML = "";

  matchHistory.forEach((match, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${match.matchNumber}</td>
      <td>${players[match.winnerIndex].name}</td>
      <td>${match.scores}</td>
      <td><button onclick="removeMatch(${index})">Remove</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function populateWinnerDropdown() {
  const winnerDropdown = document.getElementById("match-winner");
  winnerDropdown.innerHTML = "";

  players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = player.name;
    winnerDropdown.appendChild(option);
  });
}

function saveToLocalStorage() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("scorePenalty", scorePenalty);
  localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
}

// Initialize data from localStorage on page load
window.onload = function () {
  if (localStorage.getItem("players")) {
    players = JSON.parse(localStorage.getItem("players"));
    scorePenalty = parseInt(localStorage.getItem("scorePenalty"));
    matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];

    updateMatchHistoryTable();
    populateWinnerDropdown();
    document.querySelector(".match-input").style.display = "block";
  }
};