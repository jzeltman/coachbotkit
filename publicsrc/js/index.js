import App from './app';
import Events from './utils/events';
import '../scss/index.scss';
import '../scss/botkit.scss';

document.addEventListener('DOMContentLoaded', () => {
    window.events = new Events(window.document);
    new App()
});