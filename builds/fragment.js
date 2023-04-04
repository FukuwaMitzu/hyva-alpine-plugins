import Fragment from '../src/plugins/fragment/index.js'

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(Fragment)
});
