const werRoles = [{ name: "🐺 Werewolf", team: "werewolves", verb: "Identify", description: "Action: Identify the role of a Player" },
{ name: "😈 Cultist", team: "werewolves", verb: "Threaten", description: "Action: Threaten someone during the night<br>Win: Same as Werewolves" }];
const vilRoles = [
    { name: "🕵️ Detective", team: "villagers", verb: "Inspect", description: "Action: Find the alignement of a player" },
    { name: "🧑‍🌾 Villager", team: "villagers", verb: "Give corn to", description: "Action: Give corn to another player anonymously" },
    { name: "💂 Bodyguard", team: "villagers", verb: "Protect", description: "Action: Know who visits a player during the night" },
    { name: "🧙 Fortune Teller", team: "villagers", verb: "Guess role", description: "Action: Guess the role of a player" },
    { name: "👮 Jailer", team: "villagers", verb: "Block", description: "Action: Block a player from using his action during the night" },
    { name: "🤴 Mayor", team: "villagers", verb: "Impress", description: "Action: Impress someone - They will know your identity" },
    { name: "🤡 Jester", team: "special", verb: "Do nothing", description: "Action: Troll someone anonymously<br>Win: Get yourself exiled (You also win with the Villagers)" }];

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
