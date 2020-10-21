var intervalId;
var playerID;
var totalPlayers;
var seed;
var iterationField;
var randomNumber;

var rolesList = [];
var playerActionChars = [];

function startGame() {
    resetValues();

    /* Get the Game params */
    let playerSelect = document.getElementById("player");
    playerID = Number(playerSelect.options[playerSelect.selectedIndex].value);
    totalPlayers = getTotalNumberOfPlayers();
    if (totalPlayers > avatars.length) {
        printError("There cannot be more than " + avatars.length + " players");
        return;
    }

    {
        seed = document.getElementById("seed").value.toUpperCase();
        iterationField = document.getElementById("iteration");
        randomNumber = getRNG(seed, iterationField.value, totalPlayers);

        /* Build list of roles */
        let suffledVillagers = vilRoles.slice();
        shuffle(suffledVillagers, randomNumber);

        let wolvesCount = 1;
        rolesList.push(werRoles[0]);
        for (let i = 0; i < totalPlayers - wolvesCount; i++) {
            rolesList.push(suffledVillagers[i % suffledVillagers.length]);
            if ((i + 1) % 3 == 0 && i + 1 < totalPlayers - wolvesCount) {
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

    iterationField.value = iterationField.value * 1 + 1;

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
            let actionCard = document.createElement('div');
            actionCard.classList.add("action-card", "card-current-player");
            actionCard.innerHTML = rolesList[playerID].verb + " " + avatars[i] + "<br>";
            let actionCode = playerActionChars[playerID] + targetActionChar[i]
            actionCard.innerHTML += "Code:<br>" + avatars[playerID] + " <strong>" + actionCode + "</strong>";
            actionCard.onclick = function () {
                document.getElementById("input" + playerID).value = actionCode;
                let otherCrads = document.getElementsByClassName("card-current-player");
                for (let j = 0; j < otherCrads.length; j++) {
                    otherCrads.item(j).classList.remove("selected");
                }
                actionCard.classList.add("selected");
            };
            actionsList.appendChild(actionCard);
        }
        /* Add Action Inputs */
        let actionInput = document.createElement('input');
        actionInput.type = "hidden";
        actionInput.pattern = "[A-Za-z0-9]{2}";
        actionInput.maxLength = 2;
        actionInput.required = true;
        actionInput.id = "input" + i;
        actionsInputList.appendChild(actionInput);

        if (i != playerID) {
            let targetActionChars2 = playerActionChars.slice();
            shuffle(targetActionChars2, randomNumber + 17 + i);

            let playerActions = document.createElement('div');
            playerActions.classList.add("flex", "roles-list");
            for (let j = 0; j < rolesList.length; j++) {
                if (j != i) {
                    let actionCard = document.createElement('div');
                    actionCard.classList.add("action-card", "card" + i);
                    let actionCode = playerActionChars[i] + targetActionChars2[j]
                    actionCard.innerHTML = avatars[i] + "<br><strong>" + actionCode + "</strong>";
                    actionCard.onclick = function () {
                        document.getElementById("input" + i).value = actionCode;
                        let otherCrads = document.getElementsByClassName("card" + i);
                        for (let k = 0; k < otherCrads.length; k++) {
                            otherCrads.item(k).classList.remove("selected");
                        }
                        actionCard.classList.add("selected");
                    }

                    playerActions.appendChild(actionCard);
                }
            }
            actionsInputList.appendChild(playerActions);
        }
    }

    /* Start timer */
    let timer = document.getElementById('timer');
    startTimer(60 * 1, timer, "🔔 Time's up! Share your action code with the others");

    document.getElementById("gameMode").innerHTML = "Night Phase - Do not communication with other players";
    document.getElementById("nightBox").style.display = "block";
    document.getElementById("phase").innerHTML = "Night";
}

/* Game logic for the Day Phase */
function startDay() {
    resetErrors();
    let targetOutputElement = document.getElementById("actionsResults");
    targetOutputElement.innerHTML = "";
    let actionMapping = {};

    /* Validate player actions */
    let blocked = false;

    let phaseSeed = seed;
    for (let i = 0; i < rolesList.length; i++) {
        let targetActionChars = playerActionChars.slice();
        shuffle(targetActionChars, randomNumber + 17 + i);

        let doc = document.getElementById("input" + i);
        let actionCode = doc.value;
        phaseSeed += actionCode;
        if (actionCode.length < 2) {
            let errorBox = document.getElementById("error");
            errorBox.innerHTML = "Error: empty action code for player " + avatars[i];
            errorBox.style.display = "block";
            return;
        }

        let authorId = getIdForChar(actionCode[0], playerActionChars);
        if (i != authorId) {
            let errorBox = document.getElementById("error");
            errorBox.innerHTML = "Error: invalid code " + actionCode + " for player " + avatars[i];
            errorBox.style.display = "block";
            return;
        }
        let targetId = getIdForChar(actionCode[1], targetActionChars);

        actionMapping[authorId] = targetId;

        if (playerID == targetId) {
            /* Process action towards current player */
            switch (rolesList[authorId].id) {
                case "cultist":
                    appendLine("You have found a dead crow on your doorstep - there must be a <strong>" + rolesList[authorId].name + "</strong> in town", targetOutputElement);
                    break;
                case "farmer":
                    appendLine("The <strong>" + rolesList[authorId].name + "</strong> gifted you some 🌽 corn", targetOutputElement);
                    break;
                case "jailer":
                    blocked = true;
                    appendLine("Your actions were blocked by the <strong>" + rolesList[authorId].name + "</strong>");
                    break;
                case "mayor":
                    appendLine("You were impressed by <strong>" + avatars[authorId] + "</strong> - they must be the <strong>" + rolesList[authorId].name + "</strong>", targetOutputElement);
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
                    appendLine("You learned that <strong>" + avatars[targetId] + "</strong>'s role is <strong>" + rolesList[targetId].name + "</strong>", targetOutputElement);
                    break;
                case "cultist":
                    appendLine("You have threatened <strong>" + avatars[targetId] + "</strong>", targetOutputElement);
                    break;
                case "detective":
                    appendLine("Your investigation showed that <strong>" + avatars[targetId] + "</strong>'s role is <strong>" + rolesList[targetId].name + "</strong>", targetOutputElement);
                    break;
                case "farmer":
                    appendLine("You gave 🌽 corn to  <strong>" + avatars[targetId] + "</strong>", targetOutputElement);
                    break;
                case "bodyguard":
                    appendLine("You protected <strong>" + avatars[targetId] + "</strong>", targetOutputElement);
                    break;
                case "gossip":
                    appendLine("You saw <strong>" + avatars[targetId] + "</strong> visit <strong>" + avatars[actionMapping[targetId]] + "</strong>", targetOutputElement);
                    break;
                case "teller":
                    appendLine("You divined <strong>" + avatars[targetId] + "</strong> and found out they are part of the <strong>" + rolesList[targetId].team + "</strong>", targetOutputElement);
                    break;
                case "mayor":
                    appendLine("You've impressed <strong>" + avatars[targetId] + "</strong> - they know your identity", targetOutputElement);
                    break;
                case "jester":
                    appendLine("You visited <strong>" + avatars[targetId] + "</strong>", targetOutputElement);
                    break;
                default:
            }
        } else {
            /* The actions of the player were blocked */
        }
    }

    document.getElementById("nightBox").style.display = "none";

    /* Start timer */
    let timer = document.getElementById('timer');
    startTimer(60 * 5, timer, "🔔 Time's up! Who should you exile?");

    {
        let newRandomNumber = getRNG(phaseSeed, iterationField.value, totalPlayers);
        let fingerprint = getFingerprint(newRandomNumber);
        document.getElementById("fingerprint").innerHTML = fingerprint;
    }

    document.getElementById("gameMode").innerHTML = "Day Phase - Debate and vote to exile a werewolf";
    document.getElementById("dayBox").style.display = "block";
    document.getElementById("phase").innerHTML = "Day";
    let gameWindow = document.getElementById("gameWindow");
    gameWindow.classList.remove("night");
    gameWindow.classList.add("day");
}

function printError(content) {
    let errorBox = document.getElementById("error");
    errorBox.innerHTML = content;
    errorBox.style.display = "block";
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
function getRNG(currentSeed, iteration, totalPlayers) {
    let startDate = 0;
    for (let i = 0; i < currentSeed.length; i++) {
        let charCode = currentSeed.charCodeAt(i) + iteration + totalPlayers;
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
    resetErrors();
    document.getElementById("actions").innerHTML = "";
    document.getElementById("dayBox").style.display = "none";

    rolesList = [];
}

function resetErrors() {
    let errorBox = document.getElementById("error");
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
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

function appendLine(content, list) {
    let actionItem = document.createElement('li');
    actionItem.innerHTML = content;
    list.appendChild(actionItem);
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
