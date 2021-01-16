let intervalId;
let playerID;
let totalPlayers;
let seed;
let roundField;
let randomNumber;

let rolesList = [];
let playerActionChars = [];

const playerListElement = document.getElementById("player");

function startGame() {
    window.scrollTo(0, 0);
    resetValues();

    // Get the Game params
    playerID = Number(playerListElement.options[playerListElement.selectedIndex].value);
    if (playerID == -1) {
        printError(`Please select an 👤 Avatar`);
        return;
    }

    totalPlayers = getTotalNumberOfPlayers();
    if (totalPlayers > avatars.length) {
        printError(`There cannot be more than ${avatars.length} players`);
        return;
    }

    {
        seed = document.getElementById("seed").value.toUpperCase();
        if (seed.length < 4) {
            printError(`Please enter a valid 🎲 Code`);
            return;
        }
        roundField = document.getElementById("iteration");
        if (roundField.value < 1) {
            printError(`Please enter a valid 🔢 Round`);
            return;
        }
        randomNumber = getRNG(seed, roundField.value);

        /* Build list of roles */
        let suffledVillagers = vilRoles.slice();
        shuffle(suffledVillagers, randomNumber);

        let wolvesCount = 1;
        rolesList.push(werRoles[0]);
        for (let i = 0; i < totalPlayers - wolvesCount; i++) {
            rolesList.push(suffledVillagers[i % suffledVillagers.length]);
            // Add a Wolf every 3 players
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
        document.getElementById("actionVerbDescription").innerHTML = rolesList[playerID].description;

        /* Set Player name */
        document.getElementById("playerid").innerHTML = avatars[playerID];

        /* Display players info to Werewolves */
        if (rolesList[playerID].team === "werewolves") {
            let playersInfoElem = document.getElementById("playersInfo");
            let wolvesList = [];
            rolesList.forEach((role, i) => {
                if (role.id === "wolf") {
                    wolvesList.push(`<strong>${avatars[i]}</strong>`);
                }
            });
            playersInfoElem.innerHTML = `The <span class='werewolves-text'>Werewolves</span> are: ${wolvesList.join(", ")}<br>`;
        }

        startNight();
    }

    roundField.value = roundField.value * 1 + 1;

    document.getElementById("gameWindow").style.display = "inline-block";
}

// Game logic for the Night Phase
function startNight() {
    playerActionChars = [...characters];
    shuffle(playerActionChars, randomNumber + 2);

    let targetActionChar = playerActionChars.slice();
    shuffle(targetActionChar, randomNumber + 17 + playerID);

    // Set Night Actions list
    let playerActionContainer = document.getElementById("playerActionSelect");
    playerActionContainer.innerHTML = "";

    let playerActionsLabel = document.createElement("label");
    playerActionsLabel.htmlFor = "input" + playerID;
    playerActionContainer.append(playerActionsLabel);

    let playerActionsSelect = document.createElement("select");
    playerActionsSelect.id = "input" + playerID;
    playerActionsSelect.classList = "form-control";
    playerActionsSelect.required = true;
    let emptyOption = document.createElement("option");
    playerActionsSelect.append(emptyOption);
    playerActionContainer.append(playerActionsSelect);

    playerActionsLabel.innerHTML = `Select who to <strong>${rolesList[playerID].verb}</strong> and share the Player Code:`;
    let actionsInputList = document.getElementById("playersActionSelects");
    actionsInputList.innerHTML = "";

    let currentPlayerOptionsList = [];
    rolesList.forEach((r, iAuthor) => {
        if (iAuthor != playerID) {
            // Build possible actions for the current player
            let actionCode = playerActionChars[playerID] + targetActionChar[iAuthor];
            let opt = document.createElement('option');
            opt.value = actionCode;
            opt.innerHTML = `${rolesList[playerID].verb} ${avatars[iAuthor]} -> "${avatars[playerID]} ${actionCode}"`;
            currentPlayerOptionsList.push(opt);

            // Build action codes for the other players
            let targetActionChars2 = playerActionChars.slice();
            shuffle(targetActionChars2, randomNumber + 17 + iAuthor);

            let iPlayerActionContainer = document.createElement("div");
            let iPlayerActionLabel = document.createElement("label");
            iPlayerActionLabel.htmlFor = "input" + iAuthor;
            iPlayerActionLabel.innerHTML = avatars[iAuthor];
            iPlayerActionContainer.append(iPlayerActionLabel);

            let iPlayerActionSelect = document.createElement("select");
            iPlayerActionSelect.id = "input" + iAuthor;
            iPlayerActionSelect.classList = "form-control";
            iPlayerActionSelect.required = true;
            let emptyOptionElement = document.createElement("option");
            iPlayerActionSelect.append(emptyOptionElement);

            let iPlayerActionSelectWrapper = document.createElement("div");
            iPlayerActionSelectWrapper.classList.add("custom-select");
            iPlayerActionSelectWrapper.append(iPlayerActionSelect);
            iPlayerActionContainer.append(iPlayerActionSelectWrapper);

            // List the codes for the other players
            let actionOptionsList = [];
            rolesList.forEach((_, jTarget) => {
                if (jTarget != iAuthor) {
                    let jActionCode = playerActionChars[iAuthor] + targetActionChars2[jTarget];
                    let iOpt = document.createElement('option');
                    iOpt.value = jActionCode;
                    iOpt.innerHTML = `${avatars[iAuthor]} ${jActionCode}`;
                    actionOptionsList.push(iOpt);
                }
            });
            actionOptionsList.sort((a, b) => a.value.localeCompare(b.value))
                .forEach(actionOption => iPlayerActionSelect.append(actionOption));

            actionsInputList.append(iPlayerActionContainer);
        }
    });
    currentPlayerOptionsList.forEach(opt => playerActionsSelect.append(opt));

    // Start timer
    let timer = document.getElementById('timer');
    startTimer(60 * 2, timer, "🔔 Time's up! Share your Player Code with the others");

    document.getElementById("gameMode").innerHTML = "🌙 Night Phase - Do not communication with other players";
    document.getElementById("nightBox").style.display = "block";
    document.getElementById("phase").innerHTML = "Night";
    let gameWindow = document.getElementById("gameWindow");
    gameWindow.classList.add("night");
    gameWindow.classList.remove("day");
    let containerElement = document.getElementById("container");
    containerElement.classList.remove('bg-day');
    containerElement.classList.add('bg-night');
}

// Game logic for the Day Phase
function startDay() {
    window.scrollTo(0, 0);
    resetErrors();
    let targetOutputElement = document.getElementById("actionsResults");
    targetOutputElement.innerHTML = "";
    let actionMapping = {};

    let codesSummaryElement = document.getElementById('playerCodesSummary');
    codesSummaryElement.innerHTML = "<br>Codes:";
    let codesSummaryList = document.createElement('ul');
    codesSummaryList.classList.add('list-inline', 'list-middot');
    let blocked = false;

    let phaseSeed = seed;
    // Rebuild the Actions from the Player Codes for each player
    rolesList.forEach((_, i) => {
        let targetActionChars = playerActionChars.slice();
        shuffle(targetActionChars, randomNumber + 17 + i);

        let inputElement = document.getElementById("input" + i);
        let actionCode = inputElement.value;

        // Add the Player Code to the summary box
        let lineItem = document.createElement('li');
        lineItem.innerHTML = avatars[i] + "&nbsp;";
        let strongActionCode = document.createElement('strong');
        strongActionCode.innerText = actionCode;
        lineItem.append(strongActionCode);
        codesSummaryList.append(lineItem);

        phaseSeed += actionCode;
        if (actionCode.length < 2) {
            let errorBox = document.getElementById("error");
            errorBox.innerHTML = `Error: you must pick the Player Code for <strong>${avatars[i]}</strong>`;
            errorBox.style.display = "block";
            return;
        }

        let authorId = playerActionChars.findIndex(elem => elem == actionCode[0]);
        let targetId = targetActionChars.findIndex(elem => elem == actionCode[1]);
        if (i != authorId || targetId == -1) {
            printError(`Error: invalid Player Code ${actionCode} for ${avatars[i]}`);
            return;
        }

        actionMapping[authorId] = targetId;

        if (playerID == targetId) {
            // Process action towards current player
            switch (rolesList[authorId].id) {
                case "cultist":
                    appendLine(`You have found a dead crow on your doorstep - there must be a <strong>${rolesList[authorId].name}</strong> in town`, targetOutputElement);
                    break;
                case "farmer":
                    appendLine(`The <strong>${rolesList[authorId].name}</strong> gifted you some 🌽 corn`, targetOutputElement);
                    break;
                case "jailer":
                    blocked = true;
                    appendLine(`Your actions were blocked by the <strong>${rolesList[authorId].name}</strong>`);
                    break;
                case "mayor":
                    appendLine(`You were impressed by <strong>${avatars[authorId]}</strong> - they must be the <strong>${rolesList[authorId].name}</strong>`, targetOutputElement);
                    break;
                default:
            }
        }
    });

    codesSummaryElement.append(codesSummaryList);

    // Process current player action
    {
        let targetId = actionMapping[playerID];
        if (!blocked) {
            let targetAvatar = avatars[targetId];
            let targetRole = rolesList[targetId];
            switch (rolesList[playerID].id) {
                case "wolf":
                    appendLine(`You learned that <strong>${targetAvatar}</strong>'s role is <strong>${rolesList[targetId].name}</strong>`, targetOutputElement);
                    break;
                case "cultist":
                    appendLine(`You have threatened <strong>${targetAvatar}</strong>`, targetOutputElement);
                    break;
                case "bard":
                    appendLine(`You visited <strong>${targetAvatar}</strong>`, targetOutputElement);
                    break;
                case "detective":
                    // Return 2 possible roles for the target
                    let goodRole, badRole;
                    if (targetRole.team === teamWerewolves) {
                        badRole = targetRole.name;
                        goodRole = vilRoles[randomNumber % vilRoles.length].name;
                    } else {
                        goodRole = targetRole.name;
                        badRole = werRoles[0].name; // TODO return cultist if enough players
                    }
                    appendLine(`Your investigation showed that <strong>${targetAvatar}</strong>'s role is either <strong>${goodRole}</strong> or <strong>${badRole}</strong>`, targetOutputElement);
                    break;
                case "farmer":
                    appendLine(`You gave 🌽 corn to <strong>${targetAvatar}</strong>`, targetOutputElement);
                    break;
                case "bodyguard":
                    appendLine(`You protected <strong>${targetAvatar}</strong>`, targetOutputElement);
                    break;
                case "gossip":
                    appendLine(`You saw <strong>${targetAvatar}</strong> visit <strong>${avatars[actionMapping[targetId]]}</strong>`, targetOutputElement);
                    break;
                case "teller":
                    // Special roles appear as Villagers to the Fortune Teller
                    let targetTeam = targetRole.team;
                    if (targetTeam === teamSpecial) {
                        targetTeam = teamVillagers;
                    }
                    appendLine(`You divined <strong>${targetAvatar}</strong> and found out they are part of the <strong>${targetTeam}</strong>`, targetOutputElement);
                    break;
                case "mayor":
                    appendLine(`You impressed <strong>${targetAvatar}</strong> - they know your identity`, targetOutputElement);
                    break;
                case "jester":
                    appendLine(`You visited <strong>${targetAvatar}</strong>`, targetOutputElement);
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
        let newRandomNumber = getRNG(phaseSeed, roundField.value);
        let fingerprint = getFingerprint(newRandomNumber);
        document.getElementById("fingerprint").innerHTML = fingerprint;
    }

    document.getElementById("gameMode").innerHTML = "☀️ Day Phase - Debate and vote to exile a werewolf";
    document.getElementById("dayBox").style.display = "block";
    document.getElementById("phase").innerHTML = "Day";
    let gameWindow = document.getElementById("gameWindow");
    gameWindow.classList.remove("night");
    gameWindow.classList.add("day");

    let containerElement = document.getElementById("container");
    containerElement.classList.remove('bg-night');
    containerElement.classList.add('bg-day');
}

// Print an error box at the top of the page
function printError(content) {
    let errorBox = document.getElementById("error");
    errorBox.innerText = content;
    errorBox.style.display = "block";
}

// Pseudo-LFSR, it just needs to be fast and unpredictable
function getRNG(currentSeed, iteration) {
    let startDate = [...currentSeed].reduce((acc, _, i) => acc + (currentSeed.charCodeAt(i) + iteration + totalPlayers) * (i + 1), 0);

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

// Fisher-Yates Shuffle using the seed
function shuffle(array, rand) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = (currentIndex ^ rand) % currentIndex;
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Generate a 3-emoji fingerprint to confirm that players are on the same game
function getFingerprint(seedNumber) {
    let seed1 = seedNumber + 1;
    let seed2 = Math.floor(seedNumber / 10);
    let seed3 = seedNumber ^ seedNumber >> 2;
    return fingerprintTokens[seed1 % fingerprintTokens.length] + fingerprintTokens[seed2 % fingerprintTokens.length] + fingerprintTokens[seed3 % fingerprintTokens.length];
}

function resetValues() {
    resetErrors();
    document.getElementById("dayBox").style.display = "none";
    document.getElementById("playersInfo").innerHTML = "";
    document.getElementById('playerCodesSummary').innerHTML = "";

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

// Remove the children of an HTML element
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

// Populate the roles list in the Rules card
function fillRolesFromArray(array) {
    let rulesRolesList = document.getElementById("rulesRolesList");
    array.forEach(roleItem => {
        let roleBlock = document.createElement('div');
        roleBlock.classList.add("role-card");
        roleBlock.classList.add(roleItem.team);
        let title = document.createElement('h4');
        title.classList.add("card-title");
        title.innerHTML = roleItem.name;
        roleBlock.append(title);

        let description = document.createElement('div');
        description.innerHTML = roleItem.description;
        roleBlock.append(description);

        rulesRolesList.append(roleBlock);
    });
}

function appendLine(content, list) {
    let actionItem = document.createElement('li');
    actionItem.innerHTML = content;
    list.append(actionItem);
}

function initSeed() {
    let newSeed = "";
    [...Array(4).keys()].forEach(i => newSeed += characters.charAt(Math.floor(Math.random() * charactersLength)));
    document.getElementById("seed").value = newSeed;
}

/* onload */
initSeed();

/* Set the list of available Avatars */
function setPlayersList() {
    removeOptions(playerListElement);
    totalPlayers = getTotalNumberOfPlayers();

    let emptyOpt = document.createElement('option');
    emptyOpt.value = -1;
    playerListElement.append(emptyOpt);

    [...Array(Math.min(avatars.length, totalPlayers)).keys()].map(i => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = avatars[i];
        return opt;
    }).forEach(node => playerListElement.append(node));
}

fillRules();

document.getElementById('start-form').addEventListener('submit', (event) => {
    event.preventDefault();
    startGame();
});

document.getElementById('secret-block-button').addEventListener('click', () => showHide('secretBlock'));
document.getElementById('start-day-button').addEventListener('click', () => startDay());

document.getElementById("total-players").max = avatars.length;
setPlayersList();
