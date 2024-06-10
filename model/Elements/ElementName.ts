const elementNames = ["Pyro", "Burning", "Hydro", "Electro", "Cryo", "Geo", "Anemo", "Dendro", "Quicken", "Frozen"] as const;
type ElementName = typeof elementNames[number]

export { ElementName, elementNames };