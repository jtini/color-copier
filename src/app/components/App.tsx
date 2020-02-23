import * as React from 'react';
import '../styles/figma-plugin-ds.min.css'
import '../styles/ui.css';

const App = ({ }) => {
    const [formats, setFormats] = React.useState({
        rgbColor: '',
        hexColor: '',
        hsvColor: '',
        hslColor: ''
    })
    const [defaultsChecked, setDefaultsChecked] = React.useState([])
    const [formatPrefs, setFormatPrefs] = React.useState(null)

    const handleSubmit = React.useCallback((e, { formats }) => {
        e.preventDefault()
        const formEl = document.forms.formatsForm;
        const formData = new FormData(formEl)
        const rgb = formData.get('rgb')
        const hex = formData.get('hex')
        const hsv = formData.get('hsv')
        const hsl = formData.get('hsl')
        const el = document.createElement('textarea');
        el.value = '';
        if (rgb === 'on') {
            el.value += formats.rgbColor
        }
        if (hex === 'on') {
            el.value += `${rgb === 'on' ? '\n' + formats.hexColor : formats.hexColor}`
        }
        if (hsv === 'on') {
            el.value += `${(rgb === 'on' || hex === 'on') ? '\n' + formats.hsvColor : formats.hsvColor}`
        }
        if (hsl === 'on') {
            el.value += `${(rgb === 'on' || hex === 'on' || hsv === 'on') ? '\n' + formats.hslColor : formats.hslColor}`
        }
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-preferences',
                    data: {
                        rgb: rgb || 'off',
                        hex: hex || 'off',
                        hsv: hsv || 'off',
                        hsl: hsl || 'off'
                    }
                }
            },
            '*'
        )
    }, [])

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;

            if (type === 'set-preferences') {
                setFormatPrefs(message.preferences)
            }

            if (type === 'copy-color') {
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
                            data: {}
                        }
                    },
                    '*'
                )
            };

            if (type === 'format-color') {
                setFormats(message.formats)
                const defaults = Object.keys(message.preferences).map(key => {
                    return message.preferences[key] === 'on'
                })
                setDefaultsChecked(defaults)
            }
        }
    }, []);

    return (
        <div>
            <h2 className="section-title">Which formats would you like to copy?</h2>
            <form onSubmit={e => handleSubmit(e, { formats })} id="formatsForm">
                <div className="checkbox">
                    <input className="checkbox__box" type="checkbox" name="rgb" id="rgb" defaultChecked={formatPrefs && formatPrefs.rgb === 'on'} />
                    <label className="checkbox__label" htmlFor="rgb">RGB{`${formats.rgbColor ? `: ${formats.rgbColor}` : ''}`}</label>
                </div>
                <div className="checkbox">
                    <input className="checkbox__box" type="checkbox" name="hex" id="hex" defaultChecked={formatPrefs && formatPrefs.hex === 'on'} />
                    <label className="checkbox__label" htmlFor="hex">HEX{`${formats.hexColor ? `: ${formats.hexColor}` : ''}`}</label>
                </div>
                <div className="checkbox">
                    <input className="checkbox__box" type="checkbox" name="hsv" id="hsv" defaultChecked={formatPrefs && formatPrefs.hsv === 'on'} />
                    <label className="checkbox__label" htmlFor="hsv">HSV{`${formats.hsvColor ? `: ${formats.hsvColor}` : ''}`}</label>
                </div>
                <div className="checkbox">
                    <input className="checkbox__box" type="checkbox" name="hsl" id="hsl" defaultChecked={formatPrefs && formatPrefs.hsl === 'on'} />
                    <label className="checkbox__label" htmlFor="hsl">HSL{`${formats.hslColor ? `: ${formats.hslColor}` : ''}`}</label>
                </div>
                <div className="divider" />
                <button className="button button--primary" type="submit">Save Preferences</button>
            </form>
        </div>
    )
};

export default App;
