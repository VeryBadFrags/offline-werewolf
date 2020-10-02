function startGame() {
    resetValues();

    /* Get the Game params */

    let playerSelect = document.getElementById("player");
    let playerID = Number(playerSelect.options[playerSelect.selectedIndex].value);
    let totalPlayers = getTotalNumberOfPlayers();

    {
        let seed = document.getElementById("seed").value.toUpperCase();
        let iterationField = document.getElementById("iteration");
        let randomNumber = getRNG(seed, iterationField.value, totalPlayers);

        /* Build list of roles */
        let suffledVillagers = vilRoles.slice();
        shuffle(suffledVillagers, randomNumber);

        let rolesList = [];
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
        console.log(rolesList);

        /* Set Actions list */
        let charactersShuffled = [];
        for (let i = 0; i < characters.length; i++) {
            charactersShuffled.push(characters.charAt(i));
        }
        shuffle(charactersShuffled, randomNumber + 2);
        let charactersShuffled2 = charactersShuffled.slice();
        shuffle(charactersShuffled2, randomNumber + 17 + playerID);

        let playerChar = charactersShuffled[playerID];
        let actionsList = document.getElementById("actions");
        let actionInputList = document.getElementById("actionInput");
        for (let i = 0; i < rolesList.length; i++) {
            if (i != playerID) {
                let actionCard = document.createElement('div');
                actionCard.classList.add("card");
                actionCard.classList.add("action-box");
                actionCard.innerHTML = "Kill: " + avatars[i] + "<br>";
                actionCard.innerHTML += "Code: <strong>" + playerChar + charactersShuffled2[i] + "</strong>";
                actionsList.appendChild(actionCard);
            }
            /* Add Action Inputs */
            let actionInput = document.createElement('input');
            actionInput.type = "text";
            actionInput.pattern = "[A-Z]{2}";
            actionInput.maxLength = 2;
            actionInput.required = true;
            actionInput.id = "input" + i;
            let actionInputLabel = document.createElement('label');
            actionInputLabel.for = "input" + i;
            actionInputLabel.innerHTML = avatars[i];
            actionInputList.appendChild(actionInputLabel);
            actionInputList.appendChild(actionInput);
        }

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
        document.getElementById("role").innerHTML = rolesList[playerID].name;

        /* Set Role */
        document.getElementById("playerid").innerHTML = avatars[playerID];
    }

    {
        /* Start timer */
        let timer = document.getElementById('timer');
        startTimer(60 * 5, timer);

        document.getElementById("gameWindow").style.display = "inline-block";
        window.scrollTo(0, 0);
    }
}

function startDay() {
    document.getElementById("nightBox").style.display = "none";
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
function shuffle(array, randomNumber) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = (currentIndex ^ randomNumber) % currentIndex;
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

function startTimer(duration, display) {
    var timer = duration;
    setTimerDisplay(timer, display);
    var intervalId = setInterval(function () {
        timer--;
        setTimerDisplay(timer, display);
        if (timer < 0) {
            display.textContent = "🔔 Time's up! Who should you exile?";
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

document.getElementById("total-players").max = avatars.length;
setPlayersList();
