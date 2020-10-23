const teamWerewolves = "werewolves";
const teamVillagers = "villagers";
const teamSpecial = "special";

const werRoles = [{ name: "🐺&nbsp;Werewolf", team: teamWerewolves, verb: "Identify", description: "Action: Identify the role of a player", id: "wolf" },
{ name: "😈&nbsp;Cultist", team: teamWerewolves, verb: "Threaten", description: "Action: Threaten someone during the night", id: "cultist" }];
const vilRoles = [
    { name: "🧑‍🎤&nbsp;Bard", team: teamVillagers, verb: "Visit", description: "Action: Visit someone (and do nothing)", id: "bard" },
    { name: "🕵️&nbsp;Detective", team: teamVillagers, verb: "Identify", description: "Action: Identify the role of a player", id: "detective" },
    { name: "🧑‍🌾&nbsp;Farmer", team: teamVillagers, verb: "Give corn to", description: "Action: Give corn to another player anonymously", id: "farmer" },
    /* { name: "💂 Bodyguard", team: teamVillagers, verb: "Protect", description: "Action: Stop an action on a player", id: "bodyguard" }, */
    { name: "🧙&nbsp;Fortune Teller", team: teamVillagers, verb: "Divine", description: "Action: Guess the team of a player", id: "teller" },
    { name: "🧓&nbsp;Gossip", team: teamVillagers, verb: "Follow", description: "Action: See who a player visited", id: "gossip" },
    /*{ name: "👮 Jailer", team: teamVillagers, verb: "Block", description: "Action: Block a player from using his action during the night", id: "jailer" },*/
    { name: "🤴&nbsp;Mayor", team: teamVillagers, verb: "Impress", description: "Action: Impress a player - They will know your identity", id: "mayor" },
    { name: "🤡&nbsp;Jester", team: teamSpecial, verb: "Visit", description: "Action: Visit someone (and do nothing)<br>Win: Get yourself exiled (You lose otherwise)", id: "jester" }];

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
