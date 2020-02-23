import tinycolor from 'tinycolor2'

const rgbPref = figma.root.getPluginData('rgb');
const hexPref = figma.root.getPluginData('hex');
const hsvPref = figma.root.getPluginData('hsv');
const hslPref = figma.root.getPluginData('hsl');

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
            let returnColor = '#000'
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
                case 'copy':
                    // Pull in preferences
                    // Use them to copy the color
                    // The end!
                    break;
                case 'copy-multiple':
                    const rgbColor = baseColor.toRgbString();
                    const hexColor = baseColor.toHexString();
                    const hsvColor = baseColor.toHsvString();
                    const hslColor = baseColor.toHslString();
                    figma.showUI(__html__, {
                        width: 300,
                        height: 250
                    })

                    figma.ui.postMessage({
                        type: 'format-color',
                        message: {
                            formats: {
                                rgbColor,
                                hexColor,
                                hsvColor,
                                hslColor,
                            },
                            preferences: {
                                rgb: rgbPref,
                                hex: hexPref,
                                hsv: hsvPref,
                                hsl: hslPref
                            }
                        }
                    })
                    break;
                case 'copy-as-rgb':
                    returnColor = baseColor.toRgbString()
                    figma.showUI(__html__, { width: 1, height: 1 });

                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            color: returnColor
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
                case 'copy-as-hex':
                    returnColor = baseColor.toHexString()
                    figma.showUI(__html__, { width: 1, height: 1 });

                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            color: returnColor
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
                case 'copy-as-hsl':
                    returnColor = baseColor.toHslString()
                    figma.showUI(__html__, { width: 1, height: 1 });

                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            color: returnColor
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
                case 'copy-as-hsv':
                    returnColor = baseColor.toHsvString()
                    figma.showUI(__html__, { width: 1, height: 1 });

                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            color: returnColor
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
                case 'copy-as-filter':
                    returnColor = baseColor.toFilter()
                    figma.showUI(__html__, { width: 1, height: 1 });

                    figma.ui.postMessage({
                        type: 'copy-color',
                        message: {
                            color: returnColor
                        }
                    })
                    figma.notify('Copied to clipboard')
                    break;
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
        // Update the preferences
        // Close the plugin?
    }

    if (msg.type === 'close-plugin') {
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

        figma.ui.hide();
        figma.closePlugin();
    }
}