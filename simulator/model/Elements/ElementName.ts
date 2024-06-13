
// Name all elements and possible auras
export const elementNames = [
    "Pyro",
    "Hydro",
    "Electro",
    "Cryo",
    "Dendro",
    "Geo",
    "Anemo",
    "Burning",
    "Quicken",
    "Frozen"
] as const;

export type ElementName = typeof elementNames[number];