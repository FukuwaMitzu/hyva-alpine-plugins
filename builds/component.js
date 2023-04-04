import Component from '../src/plugins/component/index.js'

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(Component)
});
