import tinycolor from 'tinycolor2'

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
            case 'copy-as-rgb':
                returnColor = baseColor.toRgbString()
                figma.showUI(__html__, { width: 1, height: 1 });

                figma.ui.postMessage({
                    type: 'copy-color',
                    message: {
                        color: returnColor
                    }
                })
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

figma.ui.onmessage = (msg) => {
    if (msg.type === 'close-plugin') {
        figma.ui.hide();
        figma.closePlugin();
    }
}

// figma.closePlugin()