import ComponentManager from "./utils/contentManager";

export function initDirective() {
    Alpine.directive('component', Alpine.skipDuringClone(function (el, {expression}, {cleanup}) {
        let componentName = expression;

        const data = Alpine.reactive({
            [componentScopeToken]: componentName
        });

        const up = Alpine.addScopeToNode(el, data);

        if (!ComponentManager.getDataTracking(componentName))
            ComponentManager.initComponentPolicy(componentName, {subscribed: false, name: componentName});

        cleanup(up);
    }));
}
