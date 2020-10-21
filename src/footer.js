var intervalId;
var playerID;
var randomNumber;

var rolesList = [];
var playerActionChars = [];

function startGame() {
    resetValues();

    /* Get the Game params */

    let playerSelect = document.getElementById("player");
    playerID = Number(playerSelect.options[playerSelect.selectedIndex].value);
    let totalPlayers = getTotalNumberOfPlayers();

    {
        let seed = document.getElementById("seed").value.toUpperCase();
        let iterationField = document.getElementById("iteration");
        randomNumber = getRNG(seed, iterationField.value, totalPlayers);

        /* Build list of roles */
        let suffledVillagers = vilRoles.slice();
        shuffle(suffledVillagers, randomNumber);

        let wolvesCount = 1;
        rolesList.push(werRoles[0]);
        for (let i = 0; i < totalPlayers - wolvesCount; i++) {
            rolesList.push(suffledVillagers[i % suffledVillagers.length]);
            if ((i + 1) % 4 == 0 && i + 1 < totalPlayers - wolvesCount) {
                rolesList.push(werRoles[wolvesCount % werRoles.length]);
                wolvesCount++;
            }
        }

        shuffle(rolesList, randomNumber + 1);

        /* Set Fingerprint */
        {
            let fingerprint = getFingerprint(randomNumber);
            document.getElementById("fingerprint").innerHTML = fingerprint;
        }

        /* Set Alignment */
        /* {
             let alignment = "Villagers";
             document.getElementById("alignment").innerHTML = alignment;
         } */

        /* Set Role */
        document.getElementById("roleField").innerHTML = rolesList[playerID].name;
        document.getElementById("actionVerbField").innerHTML = rolesList[playerID].description;

        /* Set Player name */
        document.getElementById("playerid").innerHTML = avatars[playerID];

        /* Prepare Randomness */
        playerActionChars = [];
        for (let i = 0; i < characters.length; i++) {
            playerActionChars.push(characters.charAt(i));
        }
        shuffle(playerActionChars, randomNumber + 2);

        startNight();
    }

    document.getElementById("gameWindow").style.display = "inline-block";
    window.scrollTo(0, 0);
}

/* Game logic for the Night Phase */
function startNight() {
    let targetActionChar = playerActionChars.slice();
    shuffle(targetActionChar, randomNumber + 17 + playerID);

    /* Set Night Actions list */
    let actionsList = document.getElementById("actions");
    let actionsInputList = document.getElementById("actionInput");
    actionsInputList.innerHTML = "";
    for (let i = 0; i < rolesList.length; i++) {
        if (i != playerID) {
            let actionCard = document.createElement('card');
            actionCard.classList.add("action-card");
            actionCard.innerHTML = rolesList[playerID].verb + " " + avatars[i] + "<br>";
            let actionCode = playerActionChars[playerID] + targetActionChar[i]
            actionCard.innerHTML += "Code: <strong>" + actionCode + "</strong>";
            actionCard.onclick = function () {
                document.getElementById("input" + playerID).value = actionCode;
                let otherCrads = document.getElementsByClassName("action-card");
                for (let j = 0; j < otherCrads.length; j++) {
                    otherCrads.item(j).classList.remove("selected");
                }
                actionCard.classList.add("selected");
            };
            actionsList.appendChild(actionCard);
        }
        /* Add Action Inputs */
        let actionInput = document.createElement('input');
        actionInput.type = "text";
        actionInput.pattern = "[A-Za-z0-9]{2}";
        actionInput.maxLength = 2;
        actionInput.required = true;
        actionInput.id = "input" + i;
        let actionInputLabel = document.createElement('label');
        actionInputLabel.for = "input" + i;
        actionInputLabel.innerHTML = avatars[i];
        actionsInputList.appendChild(actionInputLabel);
        actionsInputList.appendChild(actionInput);
    }

    /* Start timer */
    let timer = document.getElementById('timer');
    startTimer(60 * 1, timer, "🔔 Time's up! Share your action code with the others");

    document.getElementById("gameMode").innerHTML = "Night Phase - Do not communication with other players";
    document.getElementById("nightBox").style.display = "block";
}

/* Game logic for the Day Phase */
function startDay() {
    let actionOutputElement = document.getElementById("actionOutput");
    actionOutputElement.innerHTML = "";
    let targetOutputElement = document.getElementById("targetOutput");
    targetOutputElement.innerHTML = "";
    let actionMapping = {};
    /* Validate player actions */
    let blocked = false;

    for (let i = 0; i < rolesList.length; i++) {
        let targetActionChars = playerActionChars.slice();
        shuffle(targetActionChars, randomNumber + 17 + i);

        let doc = document.getElementById("input" + i);
        let actionCode = doc.value;
        if (actionCode.length < 2) {
            console.log("Error: empty action code for player " + i);
            actionCode = "00";
        }

        let authorId = getIdForChar(actionCode[0], playerActionChars);
        if (i != authorId) {
            console.log("Error: invalid code " + actionCode);
        }
        let targetId = getIdForChar(actionCode[1], targetActionChars);

        actionMapping[authorId] = targetId;

        if (playerID == targetId) {
            /* Process action towards current player */
            switch (rolesList[authorId].id) {
                case "cultist":
                    targetOutputElement.innerHTML = targetOutputElement.innerHTML + "You were threatened by someone!" + "<br>";
                    break;
                case "villager":
                    targetOutputElement.innerHTML = targetOutputElement.innerHTML + "Someone gave you 🌽 corn" + "<br>";
                    break;
                case "jailer":
                    blocked = true;
                    break;
                case "mayor":
                    targetOutputElement.innerHTML = targetOutputElement.innerHTML + "You were impressed by " + avatars[authorId] + " - they must be the " + rolesList[authorId].name + "<br>";
                    break;
                default:
            }
        }
    }

    /* Process current player action */
    {
        let targetId = actionMapping[playerID];
        if (!blocked) {
            switch (rolesList[playerID].id) {
                case "wolf":
                    actionOutputElement.innerHTML = avatars[targetId] + " is " + rolesList[targetId].name;
                    break;
                case "cultist":
                    actionOutputElement.innerHTML = "You have threatened " + avatars[targetId];
                    break;
                case "detective":
                    actionOutputElement.innerHTML = avatars[targetId] + " is " + rolesList[targetId].name;
                    break;
                case "villager":
                    actionOutputElement.innerHTML = "You gave corn to  " + avatars[targetId];
                    break;
                case "bodyguard":
                    actionOutputElement.innerHTML = "You protected " + avatars[targetId];
                    break;
                case "teller":
                    actionOutputElement.innerHTML = avatars[targetId] + " visited " + avatars[targetId];
                    break;
                case "mayor":
                    actionOutputElement.innerHTML = "You've impressed " + avatars[targetId] + " - they now know your identity";
                    break;
                case "jester":
                    actionOutputElement.innerHTML = "You visited " + avatars[targetId];
                    break;
                default:
            }
        } else {
            actionOutputElement.innerHTML = "You actions were blocked by the 👮 Jailer!";
        }
    }

    document.getElementById("nightBox").style.display = "none";

    /* Start timer */
    let timer = document.getElementById('timer');
    startTimer(60 * 5, timer, "🔔 Time's up! Who should you exile?");

    document.getElementById("gameMode").innerHTML = "Day Phase - Debate and vote to exile a werewolf";
    document.getElementById("dayBox").style.display = "block";
}

function getIdForChar(char, charsList) {
    for (let i = 0; i < charsList.length; i++) {
        if (charsList[i] == char) {
            return i;
        }
    }
    console.log("Error: action code not found");
    return 0;
}

/* Pseudo-LFSR, it just needs to be fast and unpredictable */
function getRNG(seed, iteration, totalPlayers) {
    let startDate = 0;
    for (let i = 0; i < seed.length; i++) {
        let charCode = seed.charCodeAt(i) + iteration + totalPlayers;
        startDate += charCode * (i + 1);
    }

    const modulo = 65536;
    startDate %= modulo;
    let lfsr = startDate;
    let period = 0;

    do {
        lfsr ^= lfsr >> 7;
        lfsr ^= lfsr << 9;
        lfsr ^= lfsr >> 13;
        ++period;

        if (period > 1000000000) {
            break;
        }
    }
    while ((lfsr % modulo) != startDate);

    return period;
}
/* Fisher-Yates Shuffle using the seed */
function shuffle(array, rand) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = (currentIndex ^ rand) % currentIndex;
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Generate a 3-emoji fingerprint to confirm that players are on the same game */
function getFingerprint(seedNumber) {
    let seed1 = seedNumber + 1;
    let seed2 = Math.floor(seedNumber / 10);
    let seed3 = seedNumber ^ seedNumber >> 2;
    return fingerprintTokens[seed1 % fingerprintTokens.length] + fingerprintTokens[seed2 % fingerprintTokens.length] + fingerprintTokens[seed3 % fingerprintTokens.length];
}

function resetValues() {
    let errorBox = document.getElementById("error");
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
    document.getElementById("actions").innerHTML = "";
    document.getElementById("dayBox").style.display = "none";

    rolesList = [];
}

function getTotalNumberOfPlayers() {
    return document.getElementById("total-players").value;
}

function removeOptions(selectElement) {
    for (let i = selectElement.options.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function showHide(elementId) {
    let elem = document.getElementById(elementId);
    if (elem.style.display === 'none') {
        elem.style.display = 'block';
    } else {
        elem.style.display = 'none';
    }
}

function startTimer(duration, display, endText) {
    clearInterval(intervalId);
    var timer = duration;
    setTimerDisplay(timer, display);
    intervalId = setInterval(function () {
        timer--;
        setTimerDisplay(timer, display);
        if (timer < 0) {
            display.textContent = endText;
            clearInterval(intervalId);
        }
    }, 1000);
}

function setTimerDisplay(timer, display) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = "⏱ " + minutes + ":" + seconds;
}

function fillRules() {
    fillRolesFromArray(werRoles);
    fillRolesFromArray(vilRoles);
}

function fillRolesFromArray(array) {
    let rulesRolesList = document.getElementById("rulesRolesList");
    for (let i = 0; i < array.length; i++) {
        let role = document.createElement('div');
        role.classList.add("role-card");
        role.classList.add(array[i].team);
        let title = document.createElement('h3');
        title.innerHTML = array[i].name;
        role.appendChild(title);

        let description = document.createElement('span');
        description.innerHTML = array[i].description;
        role.appendChild(description);

        rulesRolesList.appendChild(role);
    }
}

/* onload */

/* Init seed */
{
    let newSeed = "";
    for (let i = 0; i < 4; i++) {
        newSeed += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    document.getElementById("seed").value = newSeed;
}

/* Set the list of available Avatars */
const playerListElement = document.getElementById("player");
function setPlayersList() {
    removeOptions(playerListElement);
    let totalPlayers = getTotalNumberOfPlayers();
    for (let i = 0; i < avatars.length && i < totalPlayers; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = avatars[i];
        playerListElement.appendChild(opt);
    }
}

fillRules();

document.getElementById("total-players").max = avatars.length;
setPlayersList();
