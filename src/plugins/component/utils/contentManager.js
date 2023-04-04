import {componentPolicyToken, readOnlyProps} from "./constants";

function encodeComponentPolicy(name) {
    return (componentPolicyToken + '_' + name).trim();
}

function decodeComponentPolicy(policyToken) {
    return policyToken.replace(componentPolicyToken + '_', '').trim();
}

/**
 * Wrap component data to a policy proxy. To prevent any update of read-only fields
 */
function wrapComponentPolicy(reactiveData) {
    return new Proxy(reactiveData, {
        get(target, prop) {
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if (readOnlyProps.includes(prop)) {
                return;
            }
            if (prop.startsWith(componentPolicyToken)) {
                const readOnlyField = decodeComponentPolicy(prop);
                if (!readOnlyField.length) return;
                if (readOnlyProps.includes(readOnlyField))
                    Reflect.set(target, readOnlyField, value);
            }
            return Reflect.set(target, prop, value);
        }
    });
}

const ComponentManager = new (function () {
    let self = this,
        dataTrackingTable = {};

    self.initComponentPolicy = function (componentName, policyData) {
        let componentProxy = self.getDataTracking(componentName);
        if (!componentProxy) {
            componentProxy = wrapComponentPolicy(Alpine.reactive({}));
            self.setDataTracking(componentName, componentProxy);
            self.updateComponentPolicy(componentName, policyData);
        }
    };

    /**
     * Add a data to the tracking table
     */
    self.updateComponentPolicy = function (componentName, policyData) {
        let componentProxy = self.getDataTracking(componentName);
        if (!componentProxy) {
            self.initComponentPolicy();
        } else {
            Object.entries(policyData).forEach(([prop, value]) => {
                const policyProp = encodeComponentPolicy(prop);
                componentProxy[policyProp] = value;
            });
        }
    };

    /**
     * This function is for subscribe reactive data to the component
     */
    self.subscribe = function (componentName, data) {
        if (!self.getDataTracking(componentName)) {
            self.initComponentPolicy(componentName, {subscribed: true, data});
        } else {
            self.updateComponentPolicy(componentName, {subscribed: true, data});
        }
    };

    self.getDataTracking = function (componentName) {
        const component = dataTrackingTable[componentName];
        return component;
    };
    self.setDataTracking = function (componentName, value) {
        dataTrackingTable[componentName] = value;
    };


    self.subscribe = self.subscribe.bind(this);
    self.initComponentPolicy = self.initComponentPolicy.bind(this);
    self.updateComponentPolicy = self.updateComponentPolicy.bind(this);
    self.getDataTracking = self.getDataTracking.bind(this);
    self.setDataTracking = self.setDataTracking.bind(this);
});


export default ComponentManager;
