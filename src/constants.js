const werRoles = [{ name: "🐺 Werewolf", team: "werewolves", verb: "Kill", description: "Action: Kill 1 player at night" },
{ name: "😈 Cultist", team: "werewolves", verb: "Threaten", description: "Action: Threaten someone during the night<br>Win: Same as Werewolves" }];
const vilRoles = [
    { name: "🕵️ Detective", team: "villagers", verb: "Inspect", description: "Action: Find the alignement of a player" },
    { name: "🧑‍🌾 Villager", team: "villagers", verb: "Give corn to", description: "Action: Give corn to another player" },
    { name: "💂 Bodyguard", team: "villagers", verb: "Protect", description: "Action: Protect a player during the night" },
    { name: "🧙 Fortune Teller", team: "villagers", verb: "Guess role", description: "Action: Guess the role of a player" },
    { name: "👮 Jailer", team: "villagers", verb: "Block", description: "Action: Block a player from using his action during the night" },
    { name: "🤴 Mayor", team: "villagers", verb: "None", description: "This role is public<br>Your vote counts twice" },
    { name: "🤡 Jester", team: "special", verb: "Troll", description: "Action: Troll someone<br>Win: Get yourself exiled (You also win with the Villagers)" }];

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

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charactersLength = characters.length;
