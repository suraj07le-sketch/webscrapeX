import tinycolor from 'tinycolor2';

export function extractColors(cssContent: string): string[] {
    const hexPattern = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
    const rgbPattern = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)/g;
    const hslPattern = /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/g;

    const hexMatches = cssContent.match(hexPattern) || [];
    const rgbMatches = cssContent.match(rgbPattern) || [];
    const hslMatches = cssContent.match(hslPattern) || [];

    const allMatches = [...hexMatches, ...rgbMatches, ...hslMatches];
    const colorSet = new Set<string>();

    for (const match of allMatches) {
        const color = tinycolor(match);
        if (color.isValid()) {
            colorSet.add(color.toHexString());
        }
    }

    return Array.from(colorSet).slice(0, 25);
}
