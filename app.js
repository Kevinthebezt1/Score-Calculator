let players = [];
let matches = [];
let scorePenalty = 0;

function initializeGame() {
  const playerCount = parseInt(document.getElementById("player-count").value);
  scorePenalty = parseInt(document.getElementById("score-penalty").value);

  if (!playerCount || !scorePenalty || playerCount < 2) {
    alert("Please enter valid inputs.");
    return;
  }

  players = Array.from({ length: playerCount }, (_, i) => ({
    name: `Player ${i + 1}`,
    score: 0,
  }));

  displayPlayerNameInputs(playerCount);
}

function displayPlayerNameInputs(playerCount) {
  const nameInputSection = document.getElementById("name-input-section");
  const playerNamesDiv = document.getElementById("player-names");

  playerNamesDiv.innerHTML = "";
  for (let i = 0; i < playerCount; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Player ${i + 1} Name`;
    input.dataset.index = i;
    playerNamesDiv.appendChild(input);
  }

  nameInputSection.style.display = "block";
  document.querySelector(".match-input").style.display = "none";
}

function startGameWithNames() {
  const nameInputs = document.querySelectorAll("#player-names input");
  nameInputs.forEach((input) => {
    const index = parseInt(input.dataset.index);
    const name = input.value.trim();
    if (name) {
      players[index].name = name;
    }
  });

  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("scorePenalty", scorePenalty);

  populateWinnerDropdown();
  updateMatchTable();

  document.querySelector(".match-input").style.display = "block";
  document.getElementById("name-input-section").style.display = "none";
}

function logMatch() {
  const winnerIndex = parseInt(document.getElementById("match-winner").value);
  const matchNumber = matches.length + 1;

  matches.push({
    matchNumber: matchNumber,
    winnerIndex: winnerIndex,
  });

  localStorage.setItem("matches", JSON.stringify(matches));
  updateMatchTable();
}

function calculateScores() {
  players.forEach((player) => (player.score = 0));

  matches.forEach(({ winnerIndex }) => {
    const totalPenalty = scorePenalty * (players.length - 1);

    players.forEach((player, index) => {
      if (index === winnerIndex) {
        player.score += totalPenalty;
      } else {
        player.score -= scorePenalty;
      }
    });
  });

  localStorage.setItem("players", JSON.stringify(players));
  updateScoreTable();
}

function removeMatch(matchNumber) {
  matches = matches.filter((match) => match.matchNumber !== matchNumber);
  localStorage.setItem("matches", JSON.stringify(matches));
  updateMatchTable();
}

function updateMatchTable() {
  const matchTableBody = document.querySelector("#match-table tbody");
  matchTableBody.innerHTML = "";

  matches.forEach(({ matchNumber, winnerIndex }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${matchNumber}</td>
      <td>${players[winnerIndex].name}</td>
      <td>
        <button onclick="removeMatch(${matchNumber})">Remove</button>
      </td>`;
    matchTableBody.appendChild(row);
  });
}

function updateScoreTable() {
  const tableBody = document.querySelector("#score-table tbody");
  tableBody.innerHTML = "";

  players = JSON.parse(localStorage.getItem("players")) || players;

  players.forEach((player) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${player.name}</td><td>${player.score}</td>`;
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

function clearGame() {
  if (confirm("Are you sure you want to clear the game?")) {
    localStorage.clear();
    location.reload();
  }
}

window.onload = function () {
  if (localStorage.getItem("players")) {
    players = JSON.parse(localStorage.getItem("players"));
    matches = JSON.parse(localStorage.getItem("matches")) || [];
    scorePenalty = parseInt(localStorage.getItem("scorePenalty"));

    populateWinnerDropdown();
    updateMatchTable();
    document.querySelector(".match-input").style.display = "block";
  }
};
