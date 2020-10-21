const werRoles = [{ name: "🐺 Werewolf", team: "werewolves", verb: "Identify", description: "Action: Identify the role of a Player", id: "wolf" },
{ name: "😈 Cultist", team: "werewolves", verb: "Threaten", description: "Action: Threaten someone during the night<br>Win: Same as Werewolves", id: "cultist" }];
const vilRoles = [
    { name: "🕵️ Detective", team: "villagers", verb: "Identify", description: "Action: Identify the role of a Player", id: "detective" },
    { name: "🧑‍🌾 Villager", team: "villagers", verb: "Give corn to", description: "Action: Give corn to another player anonymously", id: "villager" },
    /* { name: "💂 Bodyguard", team: "villagers", verb: "Protect", description: "Action: Stop an action on a player", id: "bodyguard" }, */
    { name: "🧓 Gossip", team: "villagers", verb: "Follow", description: "Action: See who a Player visited", id: "gossip" },
    { name: "🧙 Fortune Teller", team: "villagers", verb: "Divine", description: "Action: Guess the team of a Player", id: "teller" },
    /*{ name: "👮 Jailer", team: "villagers", verb: "Block", description: "Action: Block a player from using his action during the night", id: "jailer" },*/
    { name: "🤴 Mayor", team: "villagers", verb: "Impress", description: "Action: Impress a Player - They will know your identity", id: "mayor" },
    { name: "🤡 Jester", team: "special", verb: "Visit", description: "Action: Visit someone<br>Win: Get yourself exiled (You lose otherwise)", id: "jester" }];

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
