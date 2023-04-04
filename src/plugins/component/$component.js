import ComponentManager from "./utils/contentManager";
import {componentScopeToken} from "./utils/constants";

function getNearestComponentName(el) {
    return Alpine.$data(el)[componentScopeToken];
}

function startTracking(componentName) {
    return ComponentManager.getDataTracking(componentName);
}

export function initMagic(){
    Alpine.magic('component', function (el) {
        let proxy = new Proxy(function (otherName) {
            return startTracking(otherName);
        }, {
            get(target, prop) {
                if (prop === target) {
                    return target.bind(this);
                }
                const componentName = getNearestComponentName(el);
                return Reflect.get(startTracking(componentName), prop);
            },
            set(target, prop, value) {
                const componentName = getNearestComponentName(el);
                return Reflect.set(startTracking(componentName), prop, value);
            }
        });
        return proxy;
    });
}
