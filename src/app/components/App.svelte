<script>
    import '../styles/figma-plugin-ds.min.css';
    import '../styles/ui.css';

    let rgb = false;
    let hex = false;
    let hsl = false;
    let hsv = false;

    onmessage = event => {
        const {type, message} = event.data.pluginMessage;
        console.log({type, message});

        switch (type) {
            case 'format-color':
                console.log('format-color');
                return;
            case 'set-preferences':
                console.log('set-preferences');
                rgb = message.preferences.rgb === 'on';
                hex = message.preferences.hex === 'on';
                hsl = message.preferences.hsl === 'on';
                hsv = message.preferences.hsv === 'on';
                return;
            case 'copy-color':
                console.log(message.str);
                const el = document.createElement('textarea');
                el.value = message.str;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                parent.postMessage(
                    {
                        pluginMessage: {
                            type: 'close-plugin',
                            data: {},
                        },
                    },
                    '*'
                );
                return;
            default:
                return;
        }
    };

    const handleClick = () => {
        console.log('handleClick', {rgb, hex, hsl, hsv});
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-preferences',
                    data: {
                        rgb: rgb || 'off',
                        hex: hex || 'off',
                        hsv: hsv || 'off',
                        hsl: hsl || 'off',
                    },
                },
            },
            '*'
        );
    };
</script>

<h2 class="section-title">Which formats would you like to copy?</h2>

<div class="checkbox">
    <input class="checkbox__box" type="checkbox" id="rgb" bind:checked={rgb} />
    <label class="checkbox__label" for="rgb">RGB</label>
</div>
<div class="checkbox">
    <input class="checkbox__box" type="checkbox" id="hex" bind:checked={hex} />
    <label class="checkbox__label" for="hex">Hex</label>
</div>
<div class="checkbox">
    <input class="checkbox__box" type="checkbox" id="hsl" bind:checked={hsl} />
    <label class="checkbox__label" for="hsl">HSL</label>
</div>
<div class="checkbox">
    <input class="checkbox__box" type="checkbox" id="hsv" bind:checked={hsv} />
    <label class="checkbox__label" for="hsv">HSV</label>
</div>
<button class="button button--primary" type="button" on:click={handleClick}>Save Preferences</button>
