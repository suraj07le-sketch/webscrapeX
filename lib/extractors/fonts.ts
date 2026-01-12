export function extractFonts(cssContent: string, htmlContent: string = ''): string[] {
    const fonts = new Set<string>();

    // 1. Detect Google Fonts URLs
    const googleFontPattern = /https:\/\/fonts\.googleapis\.com\/css(?:\d?)\?family=([^&"'>\s]+)/g;
    let gfMatch;
    while ((gfMatch = googleFontPattern.exec(htmlContent + cssContent)) !== null) {
        const families = gfMatch[1].split('|').map(f => f.replace(/\+/g, ' '));
        families.forEach(f => fonts.add(f));
    }

    // 2. Detect @font-face family names
    const fontFaceBlocks = cssContent.match(/@font-face\s*{[^}]*}/g) || [];
    fontFaceBlocks.forEach(block => {
        const match = block.match(/font-family:\s*['"]?([^;'"}\s]+)['"]?/);
        if (match) fonts.add(match[1].replace(/['"]/g, '').trim());
    });

    // 3. Detect standard font-family declarations
    const fontFamilyPattern = /font-family:\s*([^;!}\n]+)/g;
    let match;
    while ((match = fontFamilyPattern.exec(cssContent)) !== null) {
        const rawFamilies = match[1].split(',')[0];
        const family = rawFamilies.trim().replace(/['"]/g, '');
        if (family && !['inherit', 'initial', 'unset', 'serif', 'sans-serif', 'monospace'].includes(family.toLowerCase())) {
            fonts.add(family);
        }
    }

    return Array.from(fonts).slice(0, 30);
}
