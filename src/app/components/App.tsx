import * as React from 'react';
import '../styles/ui.css';

const App = ({ }) => {

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;
            if (type === 'copy-color') {
                const el = document.createElement('textarea');
                el.value = message.color;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                parent.postMessage(
                    {
                        pluginMessage: {
                            type: 'close-plugin',
                            data: {}
                        }
                    },
                    '*'
                )
            };
        }
    }, []);

    return null
};

export default App;
