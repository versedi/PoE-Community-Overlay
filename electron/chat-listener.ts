import { IpcMain } from 'electron';
import { watchFile, FSWatcher, stat, open, read, openSync } from 'fs';
import { debounce } from 'lodash'
import { EOL } from 'os';

const regTradeOfferWhisper = /@From .+:* Hi, I would like to buy your .+ listed for [0-9\.]+ .+ in .+/gi;
const regBuyerJoined = /.+ has joined the area/gi;
const regTradeAccepted = /Trade accepted/gi;
const regTradeCancelled = /Trade cancelled/gi;
const regGuild = /<.+> .+/gi;
const regTwoDots = /: Hi, /gi;
const regItemLocation = /(stash tab ".+"; position: left [0-9]+, top [0-9])/gi;

const currencyNameToImage = {
    alt: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollMagic.png?v=6d9520174f6643e502da336e76b730d3',
    fuse: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketLinks.png?v=0ad7134a62e5c45e4f8bc8a44b95540f',
    alch: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeToRare.png?v=89c110be97333995522c7b2c29cae728',
    chaos: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?v=c60aa876dd6bab31174df91b1da1b4f9',
    gcp: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyGemQuality.png?v=f11792b6dbd2f5f869351151bc3a4539',
    exalted: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?v=1745ebafbd533b6f91bccf588ab5efc5',
    chrome: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketColours.png?v=9d377f2cf04a16a39aac7b14abc9d7c3',
    jewellers: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketNumbers.png?v=2946b0825af70f796b8f15051d75164d',
    chance: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeRandomly.png?v=e4049939b9cd61291562f94364ee0f00',
    chisel: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyMapQuality.png?v=f46e0a1af7223e2d4cae52bc3f9f7a1f',
    vaal: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyVaal.png?v=64114709d67069cd665f8f1a918cd12a',
    blessed: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyImplicitMod.png?v=472eeef04846d8a25d65b3d4f9ceecc8',
    p: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyCoin.png?v=b971d7d9ea1ad32f16cce8ee99c897cf',
    mirror: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDuplicate.png?v=6fd68c1a5c4292c05b97770e83aa22bc',
    transmute: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeToMagic.png?v=333b8b5e28b73c62972fc66e7634c5c8',
    silver: 'https://web.poecdn.com/image/Art/2DItems/Currency/SilverObol.png?v=93c1b204ec2736a2fe5aabbb99510bcf'
};

export interface ItemGridSize{
    width: number,
    height: number
}

export interface ItemType{
    bases:string[],
    size: ItemGridSize
}

const itemTypes: ItemType[] = [
    {
        bases: [
            // 2H Axes
            'Stone Axe',
            'Jade Chopper',
            'Woodsplitter',
            'Poleaxe',
            'Double Axe',
            'Gilded Axe',
            'Shadow Axe',
            'Dagger Axe',
            'Jasper Chopper',
            'Timber Axe',
            'Headsman Axe',
            'Labrys',
            'Noble Axe',
            'Abyssal Axe',
            'Karui Chopper',
            'Talon Axe',
            'Sundering Axe',
            'Ezomyte Axe',
            'Vaal Axe',
            'Despot Axe',
            'Void Axe',
            'Fleshripper',
            // 2H Maces
            'Driftwood Maul',
            'Tribal Maul',
            'Mallet',
            'Sledgehammer',
            'Jagged Maul',
            'Brass Maul',
            'Fright Maul',
            'Morning Star',
            'Totemic Maul',
            'Great Mallet',
            'Steelhead',
            'Spiny Maul',
            'Plated Maul',
            'Dread Maul',
            'Solar Maul',
            'Karui Maul',
            'Colossus Mallet',
            'Piledriver',
            'Meatgrinder',
            'Imperial Maul',
            'Terror Maul',
            'Coronal Maul',
            // 2H Swords
            'Corroded Blade',
            'Longsword',
            'Bastard Sword',
            'Two-Handed Sword',
            'Etched Greatsword',
            'Ornate Sword',
            'Spectral Sword',
            'Curved Blade',
            'Butcher Sword',
            'Footman Sword',
            'Highland Blade',
            'Engraved Greatsword',
            'Tiger Sword',
            'Wraith Sword',
            'Lithe Blade',
            'Headman\'s Sword',
            'Reaver Sword',
            'Ezomyte Blade',
            'Vaal Greatsword',
            'Lion Sword',
            'Infernal Sword',
            'Exquisite Blade',
            // Body armours
            'Plate Vest',
            'Chestplate',
            'Copper Plate',
            'War Plate',
            'Full Plate',
            'Arena Plate',
            'Lordly Plate',
            'Bronze Plate',
            'Battle Plate',
            'Sun Plate',
            'Colosseum Plate',
            'Majestic Plate',
            'Golden Plate',
            'Crusader Plate',
            'Astral Plate',
            'Gladiator Plate',
            'Glorious Plate',
            'Shabby Jerkin',
            'Strapped Leather',
            'Buckskin Tunic',
            'Wild Leather',
            'Full Leather',
            'Sun Leather',
            'Thief\'s Garb',
            'Eelskin Tunic',
            'Frontier Leather',
            'Glorious Leather',
            'Coronal Leather',
            'Cutthroat\'s Garb',
            'Sharkskin Tunic',
            'Destiny Leather',
            'Exquisite Leather',
            'Zodiac Leather',
            'Assassin\'s Garb',
            'Simple Robe',
            'Silken Vest',
            'Scholar\'s Robe',
            'Silken Garb',
            'Mage\'s Vestment',
            'Silk Robe',
            'Cabalist Regalia',
            'Sage\'s Robe',
            'Silken Wrap',
            'Conjurer\'s Vestment',
            'Spidersilk Robe',
            'Destroyer Regalia',
            'Savant\'s Robe',
            'Necromancer Silks',
            'Occultist\'s Vestment',
            'Widowsilk Robe',
            'Vaal Regalia',
            'Scale Vest',
            'Light Brigandine',
            'Scale Doublet',
            'Infantry Brigandine',
            'Full Scale Armour',
            'Soldier\'s Brigandine',
            'Field Lamellar',
            'Wyrmscale Doublet',
            'Hussar Brigandine',
            'Full Wyrmscale',
            'Commander\'s Brigandine',
            'Battle Lamellar',
            'Dragonscale Doublet',
            'Desert Brigandine',
            'Full Dragonscale',
            'General\'s Brigandine',
            'Triumphant Lamellar',
            'Chainmail Vest',
            'Chainmail Tunic',
            'Ringmail Coat',
            'Chainmail Doublet',
            'Full Ringmail',
            'Full Chainmail',
            'Holy Chainmail',
            'Latticed Ringmail',
            'Crusader Chainmail',
            'Ornate Ringmail',
            'Chain Hauberk',
            'Devout Chainmail',
            'Loricated Ringmail',
            'Conquest Chainmail',
            'Elegant Ringmail',
            'Saint\'s Hauberk',
            'Saintly Chainmail',
            'Padded Vest',
            'Oiled Vest',
            'Padded Jacket',
            'Oiled Coat',
            'Scarlet Raiment',
            'Waxed Garb',
            'Bone Armour',
            'Quilted Jacket',
            'Sleek Coat',
            'Crimson Raiment',
            'Lacquered Garb',
            'Crypt Armour',
            'Sentinel Jacket',
            'Varnished Coat',
            'Blood Raiment',
            'Sadist Garb',
            'Carnal Armour',
            'Sacrificial Garb',
            // Quivers
            'Two-Point Arrow Quiver',
            'Serrated Arrow Quiver',
            'Sharktooth Arrow Quiver',
            'Blunt Arrow Quiver',
            'Fire Arrow Quiver',
            'Broadhead Arrow Quiver',
            'Penetrating Arrow Quiver',
            'Ornate Quiver',
            'Spike-Point Arrow Quiver',
            'Rugged Quiver',
            'Cured Quiver',
            'Conductive Quiver',
            'Heavy Quiver',
            'Light Quiver',
            'Serrated Arrow Quiver',

        ],
        size: {
            width: 2,
            height: 3
        }
    }, {
        bases: [
            //Helmets
            'Iron Hat',
            'Cone Helmet',
            'Barbute Helmet',
            'Close Helmet',
            'Gladiator Helmet',
            'Reaver Helmet',
            'Siege Helmet',
            'Samite Helmet',
            'Ezomyte Burgonet',
            'Royal Burgonet',
            'Eternal Burgonet',
            'Leather Cap',
            'Tricorne',
            'Leather Hood',
            'Wolf Pelt',
            'Hunter Hood',
            'Noble Tricorne',
            'Ursine Pelt',
            'Silken Hood',
            'Sinner Tricorne',
            'Lion Pelt',
            'Vine Circlet',
            'Iron Circlet',
            'Torture Cage',
            'Tribal Circlet',
            'Bone Circlet',
            'Lunaris Circlet',
            'Steel Circlet',
            'Necromancer Circlet',
            'Solaris Circlet',
            'Mind Cage',
            'Hubris Circlet',
            'Battered Helm',
            'Sallet',
            'Visored Sallet',
            'Gilded Sallet',
            'Secutor Helm',
            'Fencer Helm',
            'Lacquered Helmet',
            'Fluted Bascinet',
            'Pig-Faced Bascinet',
            'Nightmare Bascinet',
            'Rusted Coif',
            'Soldier Helmet',
            'Great Helmet',
            'Crusader Helmet',
            'Aventail Helmet',
            'Zealot Helmet',
            'Great Crown',
            'Magistrate Crown',
            'Prophet Crown',
            'Praetor Crown',
            'Bone Helmet',
            'Scare Mask',
            'Plague Mask',
            'Iron Mask',
            'Festival Mask',
            'Golden Mask',
            'Raven Mask',
            'Callous Mask',
            'Regicide Mask',
            'Harlequin Mask',
            'Vaal Mask',
            'Deicide Mask',
            // Boots
            'Iron Greaves',
            'Steel Greaves',
            'Plated Greaves',
            'Reinforced Greaves',
            'Antique Greaves',
            'Ancient Greaves',
            'Goliath Greaves',
            'Vaal Greaves',
            'Titan Greaves',
            'Rawhide Boots',
            'Goathide Boots',
            'Deerskin Boots',
            'Nubuck Boots',
            'Eelskin Boots',
            'Sharkskin Boots',
            'Shagreen Boots',
            'Stealth Boots',
            'Slink Boots',
            'Wool Shoes',
            'Velvet Slippers',
            'Silk Slippers',
            'Scholar Boots',
            'Satin Slippers',
            'Samite Slippers',
            'Conjurer Boots',
            'Arcanist Slippers',
            'Sorcerer Boots',
            'Leatherscale Boots',
            'Ironscale Boots',
            'Bronzescale Boots',
            'Steelscale Boots',
            'Serpentscale Boots',
            'Wyrmscale Boots',
            'Hydrascale Boots',
            'Dragonscale Boots',
            'Chain Boots',
            'Ringmail Boots',
            'Mesh Boots',
            'Riveted Boots',
            'Zealot Boots',
            'Soldier Boots',
            'Legion Boots',
            'Crusader Boots',
            'Wrapped Boots',
            'Strapped Boots',
            'Clasped Boots',
            'Shackled Boots',
            'Trapper Boots',
            'Ambush Boots',
            'Carnal Boots',
            'Assassin\'s Boots',
            'Murder Boots',
            'Two-Toned Boots',
            // Gloves
            'Iron Gauntlets',
            'Plated Gauntlets',
            'Bronze Gauntlets',
            'Steel Gauntlets',
            'Antique Gauntlets',
            'Ancient Gauntlets',
            'Goliath Gauntlets',
            'Vaal Gauntlets',
            'Titan Gauntlets',
            'Spiked Gloves',
            'Rawhide Gloves',
            'Goathide Gloves',
            'Deerskin Gloves',
            'Nubuck Gloves',
            'Eelskin Gloves',
            'Sharkskin Gloves',
            'Shagreen Gloves',
            'Stealth Gloves',
            'Gripped Gloves',
            'Wool Gloves',
            'Velvet Gloves',
            'Silk Gloves',
            'Embroidered Gloves',
            'Satin Gloves',
            'Samite Gloves',
            'Conjurer Gloves',
            'Arcanist Gloves',
            'Sorcerer Gloves',
            'Fingerless Silk Gloves',
            'Fishscale Gauntlets',
            'Ironscale Gauntlets',
            'Bronzescale Gauntlets',
            'Steelscale Gauntlets',
            'Serpentscale Gauntlets',
            'Wyrmscale Gauntlets',
            'Hydrascale Gauntlets',
            'Dragonscale Gauntlets',
            'Chain Gloves',
            'Ringmail Gloves',
            'Mesh Gloves',
            'Riveted Gloves',
            'Zealot Gloves',
            'Soldier Gloves',
            'Legion Gloves',
            'Crusader Gloves',
            'Wrapped Mitts',
            'Strapped Mitts',
            'Clasped Mitts',
            'Trapper Mitts',
            'Ambush Mitts',
            'Carnal Mitts',
            'Assassin\'s Mitts',
            'Murder Mitts',
            // Claws
            'Nailed Fist',
            'Sharktooth Claw',
            'Awl',
            'Cat\'s Paw',
            'Blinder',
            'Timeworn Claw',
            'Sparkling Claw',
            'Fright Claw',
            'Double Claw',
            'Thresher Claw',
            'Gouger',
            'Tiger\'s Paw',
            'Gut Ripper',
            'Prehistoric Claw',
            'Noble Claw',
            'Eagle Claw',
            'Twin Claw',
            'Great White Claw',
            'Throat Stabber',
            'Hellion\'s Paw',
            'Eye Gouger',
            'Vaal Claw',
            'Imperial Claw',
            'Terror Claw',
            'Gemini Claw',
            // Shields
            'Splintered Tower Shield',
            'Corroded Tower Shield',
            'Rawhide Tower Shield',
            'Cedar Tower Shield',
            'Copper Tower Shield',
            'Reinforced Tower Shield',
            'Painted Tower Shield',
            'Buckskin Tower Shield',
            'Mahogany Tower Shield',
            'Bronze Tower Shield',
            'Girded Tower Shield',
            'Crested Tower Shield',
            'Shagreen Tower Shield',
            'Ebony Tower Shield',
            'Ezomyte Tower Shield',
            'Colossal Tower Shield',
            'Pinnacle Tower Shield',
            'Goathide Buckler',
            'Pine Buckler',
            'Painted Buckler',
            'Hammered Buckler',
            'War Buckler',
            'Gilded Buckler',
            'Oak Buckler',
            'Enameled Buckler',
            'Corrugated Buckler',
            'Battle Buckler',
            'Golden Buckler',
            'Ironwood Buckler',
            'Lacquered Buckler',
            'Vaal Buckler',
            'Crusader Buckler',
            'Imperial Buckler',
            'Twig Spirit Shield',
            'Yew Spirit Shield',
            'Bone Spirit Shield',
            'Tarnished Spirit Shield',
            'Jingling Spirit Shield',
            'Brass Spirit Shield',
            'Walnut Spirit Shield',
            'Ivory Spirit Shield',
            'Ancient Spirit Shield',
            'Chiming Spirit Shield',
            'Thorium Spirit Shield',
            'Lacewood Spirit Shield',
            'Fossilised Spirit Shield',
            'Vaal Spirit Shield',
            'Harmonic Spirit Shield',
            'Titanium Spirit Shield',
            'Rotted Round Shield',
            'Fir Round Shield',
            'Studded Round Shield',
            'Scarlet Round Shield',
            'Splendid Round Shield',
            'Maple Round Shield',
            'Spiked Round Shield',
            'Crimson Round Shield',
            'Baroque Round Shield',
            'Teak Round Shield',
            'Spiny Round Shield',
            'Cardinal Round Shield',
            'Elegant Round Shield',
            'Plank Kite Shield',
            'Linden Kite Shield',
            'Reinforced Kite Shield',
            'Layered Kite Shield',
            'Ceremonial Kite Shield',
            'Etched Kite Shield',
            'Steel Kite Shield',
            'Laminated Kite Shield',
            'Angelic Kite Shield',
            'Branded Kite Shield',
            'Champion Kite Shield',
            'Mosaic Kite Shield',
            'Archon Kite Shield',
            'Spiked Bundle',
            'Driftwood Spiked Shield',
            'Alloyed Spiked Shield',
            'Burnished Spiked Shield',
            'Ornate Spiked Shield',
            'Redwood Spiked Shield',
            'Compound Spiked Shield',
            'Polished Spiked Shield',
            'Sovereign Spiked Shield',
            'Alder Spiked Shield',
            'Ezomyte Spiked Shield',
            'Mirrored Spiked Shield',
            'Supreme Spiked Shield',

        ],
        size: {
            width: 2,
            height: 2
        }
    }, {
        bases: [
            //Belts
            'Chain Belt',
            'Rustic Sash',
            'Stygian Vise',
            'Heavy Belt',
            'Leather Belt',
            'Cloth Belt',
            'Studded Belt',
            'Vanguard Belt',
            'Crystal Belt',

        ],
        size: {
            width: 2,
            height: 1
        }
    }, {
        bases: [
            // Daggers
            'Glass Shank',
            'Skinning Knife',
            'Stiletto',
            'Flaying Knife',
            'Prong Dagger',
            'Poignard',
            'Trisula',
            'Gutting Knife',
            'Ambusher',
            'Sai',
            'Rune Daggers',
            'Carving Knife',
            'Boot Knife',
            'Copper Kris',
            'Skean',
            'Imp Dagger',
            'Butcher Knife',
            'Boot Blade',
            'Royal Skean',
            'Fiend Dagger',
            'Slaughter Knife',
            'Ezomyte Dagger',
            'Platinum Kris',
            'Imperial Skean',
            'Demon Dagger',
            // Maces
            'Driftwood Club',
            'Tribal Club',
            'Spiked Club',
            'Stone Hammer',
            'War Hammer',
            'Bladed Mace',
            'Ceremonial Mace',
            'Dream Mace',
            'Wyrm Mace',
            'Petrified Club',
            'Barbed Club',
            'Rock Breaker',
            'Battle Hammer',
            'Flanged Mace',
            'Ornate Mace',
            'Phantom Mace',
            'Dragon Mace',
            'Ancestral Club',
            'Tenderizer',
            'Gavel',
            'Legion Hammer',
            'Pernarch',
            'Auric Mace',
            'Nightmare Mace',
            'Behemoth Mace',
            // Scepters
            'Driftwood Sceptre',
            'Darkwood Sceptre',
            'Bronze Sceptre',
            'Quartz Sceptre',
            'Iron Sceptre',
            'Ochre Sceptre',
            'Ritual Sceptre',
            'Shadow Sceptre',
            'Grinning Fetish',
            'Horned Sceptre',
            'Sekhem',
            'Crystal Sceptre',
            'Lead Sceptre',
            'Blood Sceptre',
            'Royal Sceptre',
            'Abyssal Sceptre',
            'Stag Sceptre',
            'Karui Sceptre',
            'Tyrant\'s Sekhem',
            'Opal Sceptre',
            'Platinum Sceptre',
            'Vaal Sceptre',
            'Carnal Sceptre',
            'Void Sceptre',
            'Sambar Sceptre',
            // Swords
            'Rusted Spike',
            'Whalebone Rapier',
            'Battered Foil',
            'Basket Rapier',
            'Jagged Foil',
            'Antique Rapier',
            'Elegant Foil',
            'Thorn Rapier',
            'Smallsword',
            'Wyrmbone Rapier',
            'Burnished Foil',
            'Estoc',
            'Serrated Foil',
            'Primeval Rapier',
            'Fancy Foil',
            'Apex Rapier',
            'Courtesan Sword',
            'Dragonbone Rapier',
            'Tempered Foil',
            'Pecoraro',
            'Spiraled Foil',
            'Vaal Rapier',
            'Jewelled Foil',
            'Harpy Rapier',
            'Dragoon Sword',
            'Rusted Sword',
            'Copper Sword',
            'Sabre',
            'Broad Sword',
            'War Sword',
            'Ancient Sword',
            'Elegant Sword',
            'Dusk Blade',
            'Hook Sword',
            'Variscite Blade',
            'Cutlass',
            'Baselard',
            'Battle Sword',
            'Elder Sword',
            'Graceful Sword',
            'Twilight Blade',
            'Grappler',
            'Gemstone Sword',
            'Corsair Sword',
            'Gladius',
            'Legion Sword',
            'Vaal Blade',
            'Eternal Sword',
            'Midnight Blade',
            'Tiger Hook',
            // Wands
            'Driftwood Wand',
            'Goat\'s Horn',
            'Carved Wand',
            'Quartz Wand',
            'Spiraled Wand',
            'Sage Wand',
            'Pagan Wand',
            'Faun\'s Horn',
            'Engraved Wand',
            'Crystal Wand',
            'Serpent Wand',
            'Omen Wand',
            'Heathen Wand',
            'Demon\'s Horn',
            'Imbued Wand',
            'Opal Wand',
            'Tornado Wand',
            'Prophecy Wand',
            'Profane Wand',
            'Convoking Wand',
            // Flasks
            'Life Flask',
            'Mana Flask',
            'Hybrid Flask',
            'Quicksilver Flask',
            'Bismuth Flask',
            'Stibnite Flask',
            'Amethyst Flask',
            'Ruby Flask',
            'Sapphire Flask',
            'Topaz Flask',
            'Silver Flask',
            'Aquamarine Flask',
            'Granite Flask',
            'Jade Flask',
            'Quartz Flask',
            'Sulphur Flask',
            'Basalt Flask',
            'Diamond Flask',
        ],
        size: {
            width: 1,
            height: 3
        }
    }
]

/**
 * Find items that are greater then 1x1
 */

export class ChatListener {
    private ipcMain: IpcMain;
    private webContents: Electron.WebContents;

    private clientFileLocation: string = null;
    private lastFilePostion: number = 0;
    private debounced_readLastLines: any;

    private started: boolean = false;

    constructor(ipcMain: IpcMain, webContents: Electron.WebContents) {
        this.ipcMain = ipcMain;
        this.webContents = webContents;

        this.debounced_readLastLines = debounce(this.readLastLines, 500);
    }

    public setLogFilePath(filePath: string): void {
        this.clientFileLocation = filePath;

        stat(this.clientFileLocation, (err, infos) => {
            if (err) {
                console.info('Cannot get Client.txt stats.');
                return;
            }

            this.lastFilePostion = infos.size;
        });
    }

    public isStarted(): boolean {
        return this.started;
    }

    private parse(line: string): void {
        if (line) {
            if (line.match(regTradeOfferWhisper)) {
                this.parseOfferLine(line);
            } else if (line.match(regBuyerJoined)) {
                this.parseBuyerJoinedLine(line);
            } else if (line.match(regTradeAccepted)) {
                this.webContents.send('trade-accepted');
            } else if (line.match(regTradeCancelled)) {
                this.webContents.send('trade-cancelled');
            }
        }
    }

    public start(): void {
        this.started = true;

        watchFile(this.clientFileLocation, {
            persistent: true,
            interval: 1000
        }, (current, previous) => {
            this.debounced_readLastLines();
        });
    }

    private readLastLines(): void {
        stat(this.clientFileLocation, (err, fileInfos) => {
            open(this.clientFileLocation, 'r', (err, fd) => {
                const buffer: Buffer = Buffer.alloc(fileInfos.size - this.lastFilePostion);

                read(fd, buffer, 0, buffer.length, this.lastFilePostion, (err, bytesRead, buffer) => {
                    const lines: string = buffer.toString();
                    this.lastFilePostion = fileInfos.size;

                    lines.split(EOL).forEach(l => this.parse(l));
                });
            });
        });
    }

    private parseOfferLine(line: string): void {
        var buyerName = line.match(regGuild) ? line.substring(line.indexOf('> ') + 2, line.lastIndexOf(' Hi, ')) : line.substring(line.indexOf('@From ') + 6, line.match(regTwoDots) ? line.lastIndexOf(': Hi, ') : line.lastIndexOf(' Hi, '));

        if (buyerName.lastIndexOf(':') == buyerName.length) {
            buyerName = buyerName.substring(0, buyerName.length - 1);
        }

        var item = line.substring(line.lastIndexOf('buy your ') + 9, line.lastIndexOf(' listed for'));

        var price = line.substring(line.lastIndexOf('listed for ') + 11, line.lastIndexOf(' in '));
        const priceSplit = price.split(' ');

        var currency = "";
        var priceValue = "";

        if (priceSplit.length >= 2) {
            currency = priceSplit[1];
            priceValue = priceSplit[0];
        }

        var time = line.substring(0, 19);

        var stashTabName = "",
            left = "",
            top = "";

        if (line.match(regItemLocation)) {
            stashTabName = line.substring(line.lastIndexOf('(stash tab "') + 12, line.lastIndexOf('"; position:'));
            left = line.substring(line.lastIndexOf('; position: left ') + 17, line.lastIndexOf(', top '));
            top = line.substring(line.lastIndexOf(', top ') + 6, line.lastIndexOf(')'));
        }

        var size = {
            width: 1,
            height: 1
        };

        for(let type of itemTypes){
            for(let base of type.bases){
                if(item.indexOf(base) != -1){
                    size = type.size;
                    break;
                }
            }
        }

        this.webContents.send('new-trade-offer', {
            buyerName,
            itemName: item,
            time,
            price: {
                currency,
                value: priceValue,
                image: currencyNameToImage[currency]
            },
            itemLocation: {
                stashTabName,
                left: Number(left),
                top: Number(top),
                ...size
            }
        });
    }

    private parseBuyerJoinedLine(line: string): void {
        var buyerName = line.substring(line.lastIndexOf(': ') + 2, line.indexOf(' has joined the area.'));
        this.webContents.send('buyer-joined', buyerName);
    }
}

export function register(ipcMain: IpcMain, webContents: Electron.WebContents): void {
    const chatListener = new ChatListener(ipcMain, webContents);

    ipcMain.on('logs-file-found', (filePath) => {
        if (!chatListener.isStarted() && filePath) {
            chatListener.setLogFilePath(String(filePath));
            chatListener.start();
        }
    });
}