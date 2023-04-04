const initEvent = "bssComponent:init";
const globalName = "bssComponent";

/**
 * Define a scope for reactive data of alpine component
 */
const componentScopeToken = "_x_componentScope";

/**
 * Define a policy token for a component
 */
const componentPolicyToken = "_x_componentProxyPolicy";

/**
 * Declare the read-only props. Which will be added to '$component' magic
 */
const readOnlyProps = ["subscribed", "name", "data"];

export {initEvent, globalName, componentPolicyToken, readOnlyProps, componentScopeToken};
