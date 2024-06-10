
// Name all elements and possible auras
export const elementNames = [
    "Pyro",
    "Hydro",
    "Electro",
    "Cryo",
    "Geo",
    "Anemo",
    "Dendro",
    "Burning",
    "Quicken",
    "Frozen"
] as const;

export type ElementName = typeof elementNames[number];