export const AvatarSkin: Avatar = {
  seed: 'custom-seed',
  scale: 100,
  flip: false,
  size: 200,
  translateX: 5,
  translateY: 5,
  radius: 0,
  face: ['base'],
  mouth: ['unimpressed'],
  hair: ['mohawk'],
  accessories: ['sailormoonCrown'],
  eyes: ['winking'],
  accessoriesProbability: 3,
  skinColor: ['tan'],
  hairColor: ['variant06'],
};

export const AvatarSkinAvaattar:any = {
  seed: 'custom-seed',
  scale: 200,
  flip: false,
  size: 100,
  translateX: 5,
  translateY: 5,
  radius: 0,
  style:'transparent',
  top:['bigHair'],
  topChance: 100,
  hatColor:['blue'],
  hairColor:['auburn'],
  facialHair:['beardMajestic'],
  facialHairChance:3,
  facialHairColor:['auburn'],
  clothes:['hoodie'],
  clothesColor:['heather'],
  eyebrow: ['default'],
  mouth: ['default'],
  hair: ['mohawk'],
  eyes: ['happy'],
  accessoriesProbability: 3,
  skin: ['tanned'],
  clotheGraphics: ['skullOutline']
};


export interface Avatar {
  seed: string;
  scale: number;
  flip: boolean;
  size: number;
  translateX: number;
  translateY: number;
  radius: number;
  face:any[];
  mouth:any[];
  hair:any[];
  accessories:any[];
  eyes:any[];
  accessoriesProbability: number;
  skinColor:any[];
  hairColor:any[];
}

export const EyeTypes = ["close", "closed", "cry", "default", "dizzy", "xDizzy", "roll", "eyeRoll", "happy", "hearts", "side", "squint", "surprised", "wink", "winkWacky"]
export const SkinTypes = ["tanned", "yellow", "pale", "light", "brown", "darkBrown", "black"];
export const MouthTypes = ["concerned", "default", "disbelief", "eating", "grimace", "sad", "scream", "screamOpen", "serious", "smile", "tongue", "twinkle", "vomit"]
export const ClotheTypes = ["blazer", "blazerAndShirt", "blazerAndSweater", "sweater", "collarAndSweater", "shirt", "graphicShirt", "shirtCrewNeck", "shirtScoopNeck", "shirtVNeck", "hoodie", "overall"]
export const HairTypes = ["longHair", "shortHair", "eyepatch", "hat", "hijab", "turban", "bigHair", "bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froAndBand", "miaWallace", "longButNotTooLong", "shavedSides", "straight01", "straight02", "straightAndStrand", "dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "shortCurly", "shortFlat", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart", "winterHat01", "winterHat02", "winterHat03", "winterHat04"]
export const HairColorTypes = ["auburn", "black", "blonde", "blondeGolden", "brown", "brownDark", "pastel", "pastelPink", "platinum", "red", "gray", "silverGray"]
