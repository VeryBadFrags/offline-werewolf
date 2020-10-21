const werRoles = [{ name: "🐺 Werewolf", team: "werewolves", verb: "Identify", description: "Action: Identify the role of a Player", id: "wolf" },
{ name: "😈 Cultist", team: "werewolves", verb: "Threaten", description: "Action: Threaten someone during the night<br>Win: Same as Werewolves", id: "cultist" }];
const vilRoles = [
    { name: "🕵️ Detective", team: "villagers", verb: "Identify", description: "Action: Identify the role of a Player", id: "detective" },
    { name: "🧑‍🌾 Villager", team: "villagers", verb: "Give corn to", description: "Action: Give corn to another player anonymously", id: "villager" },
    /* { name: "💂 Bodyguard", team: "villagers", verb: "Protect", description: "Action: Know who visits a player during the night", id: "bodyguard" }, */
    { name: "🧙 Fortune Teller", team: "villagers", verb: "Guess role", description: "Action: See who a player visited", id: "teller" },
    /*{ name: "👮 Jailer", team: "villagers", verb: "Block", description: "Action: Block a player from using his action during the night", id: "jailer" },*/
    { name: "🤴 Mayor", team: "villagers", verb: "Impress", description: "Action: Impress someone - They will know your identity", id: "mayor" },
    { name: "🤡 Jester", team: "special", verb: "Visit", description: "Action: Visit someone (and do nothing)<br>Win: Get yourself exiled (You also win with the Villagers)", id: "jester" }];

const avatars = [
    "🐱 Cat",
    "🐶 Dog",
    "🦊 Fox",
    "🐭 Mouse",
    "🐼 Panda",
    "🐧 Penguin",
    "🐰 Rabbit",
    "🐯 Tiger",
    "🦖 T-Rex",
    "🦉 Owl"
];

const fingerprintTokens = ["😀",
    "⭐️",
    "🍪",
    "🍕",
    "🍓",
    "🍒",
    "🥐",
    "🍩",
    "🍦",
    "⚽️",
    "🎷",
    "🧩",
    "🔑",
    "🦜",
    "🐵",
    "🐬",
    "🐢"];

const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const charactersLength = characters.length;
