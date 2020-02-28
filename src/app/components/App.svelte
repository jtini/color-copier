<script>
    import '../styles/figma-plugin-ds.min.css';
    import '../styles/ui.css';

    onmessage = event => {
        const {type, message} = event.data.pluginMessage;
        console.log({type, message});

        switch (type) {
            case 'set-preferences':
                console.log('set-preferences');
                return;
            case 'copy-color':
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
</script>

<h2 className="section-title">Which formats would you like to copy?</h2>
