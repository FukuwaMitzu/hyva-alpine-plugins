import MageUrl from '../src/plugins/mageUrl/index.js'

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(MageUrl);
});
