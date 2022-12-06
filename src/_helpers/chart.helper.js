export const chartsHelper = {
    fromLabelToColor
};

const sourcesColors = {
    'Sites affluents': '#F7A600',
    'Accès Direct': '#FFA5DA',
    'Moteurs': '#E40087',
    'Courriel': '#F8D38F',
    'Réseaux sociaux': '#BCBDC0',
};

function fromLabelToColor(englishLabel) {
    return sourcesColors[englishLabel];
}
