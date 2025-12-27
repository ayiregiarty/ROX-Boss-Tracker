export type BossType = "MVP" | "Mini"

export type Boss = {
    id: string
    name: string
    type: BossType
}

export const BOSSES: Boss[] = [
    { id: "mistress", name: "Mistress", type: "MVP" },
    { id: "phreeoni", name: "Phreeoni", type: "MVP" },
    { id: "eddga", name: "Eddga", type: "MVP" },
    { id: "kraken", name: "Kraken", type: "MVP" },
    { id: "maya", name: "Maya", type: "MVP" },
    { id: "orc_hero", name: "Orc Hero", type: "MVP" },
    { id: "orc_lord", name: "Orc Lord", type: "MVP" },
    { id: "pharaoh", name: "Pharaoh", type: "MVP" },
    { id: "doppelganger", name: "Doppelganger", type: "MVP" },
    { id: "amon_ra", name: "Amon Ra", type: "MVP" },
    { id: "time_holder", name: "Time Holder", type: "MVP" },
    { id: "morroc", name: "Morroc", type: "MVP" },
    { id: "lost_dragon", name: "Lost Dragon", type: "MVP" },
    { id: "tao_gunka", name: "Tao Gunka", type: "MVP" },
    { id: "lord_of_the_death", name: "Stormy Knight", type: "MVP" },
    { id: "fallen_bishop", name: "Fallen Bishop", type: "MVP" },
    { id: "arc_angeling", name: "Arc Angeling", type: "MVP" },
    { id: "gioia", name: "Gioia", type: "MVP" },
    { id: "nidhoggrs_shadow", name: "Nidhoggr's Shadow", type: "MVP" },
    { id: "rsx", name: "RSX-0806", type: "MVP" },
    { id: "retribution", name: "retribution", type: "MVP" },
    { id: "gloom_under_night", name: "Gloom Under Night", type: "MVP" },
    { id: "shadow_chaser_gertie", name: "Shadow Chaser Gertie", type: "MVP" },
    { id: "genetic_flamel", name: "Genetic Flamerl", type: "MVP" },
    { id: "dragon_fly", name: "Dragon Fly", type: "Mini" },
    { id: "eclipse", name: "Eclipse", type: "Mini" },
    { id: "ghostring", name: "Ghostring", type: "Mini" },
    { id: "mastering", name: "Mastering", type: "Mini" },
    { id: "king_dramoh", name: "King Dramoh", type: "Mini" },
    { id: "toad", name: "Toad", type: "Mini" },
    { id: "angeling", name: "Angeling", type: "Mini" },
    { id: "deviling", name: "Deviling", type: "Mini" },
    { id: "dark_priest", name: "Dark Priest", type: "Mini" },
    { id: "vagabond_wolf", name: "Vagabond Wolf", type: "Mini" },
    { id: "chimera", name: "Chimera", type: "Mini" },
    { id: "mysteltainn", name: "Mysteltainn", type: "Mini" },
    { id: "necromancer", name: "Necromancer", type: "Mini" },
    { id: "ogretooth", name: "Ogretooth", type: "Mini" },
    { id: "skeggiold", name: "Skeggiold", type: "Mini" },
    { id: "faceworm_queen", name: "Faceworm Queen", type: "Mini" },
    { id: "queen_scaraba", name: "Queen Scaraba", type: "Mini" },
    { id: "ktullanux", name: "Ktullanux", type: "Mini" },
    { id: "shelter", name: "Shelter", type: "Mini" },
    { id: "ranger_cecil", name: "Ranger Cecil", type: "Mini" },
]