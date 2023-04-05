import Group from "../src/plugins/group/index.js";

document.addEventListener('alpine:init', function (){
    window.Alpine.plugin(Group);
});
