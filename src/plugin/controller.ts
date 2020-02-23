import tinycolor from 'tinycolor2'

// Default to have hex
let hexPref = 'on'
const rgbPref = figma.root.getPluginData('rgb');
const hsvPref = figma.root.getPluginData('hsv');
const hslPref = figma.root.getPluginData('hsl');

// Only set hex accurately if at least one other preference is set
if (
    rgbPref === 'on' ||
    hsvPref === 'on' ||
    hslPref === 'on'
) {
    hexPref = figma.root.getPluginData('hex')
}

// Preferences only
if (figma.command === 'set-preferences') {
    figma.showUI(__html__, {
        width: 300,
        height: 250
    })
    figma.ui.postMessage({
        type: 'set-preferences',
        message: {
            preferences: {
                rgb: rgbPref,
                hex: hexPref,
                hsv: hsvPref,
                hsl: hslPref
            }
        }
    })
} else {
    // For the copying
    const currentSelection = figma.currentPage.selection;

    if (currentSelection.length === 0) {
        figma.notify('Please select a layer with a fill');
        figma.closePlugin();
    }

    if (currentSelection.length > 1) {
        figma.notify('Too many layers selected, please select only one');
        figma.closePlugin();
    }

    const layer = currentSelection[0];

    if (
        layer.type === 'BOOLEAN_OPERATION' ||
        layer.type === 'COMPONENT' ||
        layer.type === 'ELLIPSE' ||
        layer.type === 'FRAME' ||
        layer.type === 'INSTANCE' ||
        layer.type === 'LINE' ||
        layer.type === 'POLYGON' ||
        layer.type === 'RECTANGLE' ||
        layer.type === 'STAR' ||
        layer.type === 'TEXT' ||
        layer.type === 'VECTOR'
    ) {
        const paints =
            layer.type === 'FRAME' ? layer.backgrounds :
                layer.type === 'LINE' ? layer.strokes : layer.fills;

        if (paints !== figma.mixed && paints.length === 1) {
            const fill = paints[0];
            let baseColor = tinycolor('#000')
            if (fill.type !== "SOLID") {
                figma.notify(`Please select a ${layer.type === 'FRAME' ? 'frame' : 'layer'} with a color ${layer.type === 'FRAME' ? 'background' : 'fill'}.`)
                figma.closePlugin();
            } else {
                baseColor = tinycolor({
                    r: fill.color.r * 255,
                    g: fill.color.g * 255,
                    b: fill.color.b * 255,
                    a: fill.opacity
                })
                baseColor.getAlpha();
            }

            switch (figma.command) {
                case 'copy': {
                    let str = ''
                    if (
                        (!rgbPref || rgbPref === 'off') &&
                        (!hexPref || hexPref === 'off') &&
                        (!hsvPref || hsvPref === 'off') &&
                        (!hslPref || hslPref === 'off')
                    ) {
                        figma.notify('Please choose a format from Preferences')
                    } else {
                        if (rgbPref === 'on') {
                            str += baseColor.toRgbString();
                        }
                        if (hexPref === 'on') {
                            str += rgbPref === 'on' ?
                                '\n' + baseColor.toHexString() :
                                baseColor.toHexString()
                        }
                        if (hsvPref === 'on') {
                            str += (hexPref === 'on' || rgbPref === 'on') ?
                                '\n' + baseColor.toHsvString() :
                                baseColor.toHsvString()
                        }
                        if (hslPref === 'on') {
                            str += (hsvPref === 'on' || hexPref === 'on' || rgbPref === 'on') ?
                                '\n' + baseColor.toHslString() :
                                baseColor.toHslString()
                        }
                    }

                    figma.showUI(__html__, { width: 1, height: 1 });
                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            str
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
                }
                default:
                    figma.notify(`No command matched: ${figma.command}`)
                    figma.closePlugin()
            }

        } else {
            figma.notify(`Please select a ${layer.type === 'FRAME' ? 'frame' : 'layer'} with one ${layer.type === 'FRAME' ? 'background' : 'fill'}.`)
            figma.closePlugin()
        }
    } else {
        figma.notify('Please select a layer or a frame')
        figma.closePlugin()
    }
}

figma.ui.onmessage = (msg) => {
    if (msg.type === 'set-preferences') {
        if (
            msg.data.rgb === 'off' &&
            msg.data.hex === 'off' &&
            msg.data.hsv === 'off' &&
            msg.data.hsl === 'off'
        ) {
            figma.notify('Please select at least one format')
        } else {
            if (msg.data && msg.data.rgb) {
                figma.root.setPluginData('rgb', msg.data.rgb)
            }
            if (msg.data && msg.data.hex) {
                figma.root.setPluginData('hex', msg.data.hex)
            }
            if (msg.data && msg.data.hsv) {
                figma.root.setPluginData('hsv', msg.data.hsv)
            }
            if (msg.data && msg.data.hsl) {
                figma.root.setPluginData('hsl', msg.data.hsl)
            }

            figma.notify('Preferences updated')

            figma.ui.hide();
            figma.closePlugin();
        }
    }

    if (msg.type === 'close-plugin') {
        figma.ui.hide();
        figma.closePlugin();
    }
}