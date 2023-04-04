/**
 * Walk function allow to walk every alpine js node
 * @link https://github.com/alpinejs/alpine/blob/main/packages/alpinejs/src/utils/walk.js
 * @param el
 * @param callback
 */
function walk(el, callback) {
    if (typeof ShadowRoot === 'function' && el instanceof ShadowRoot) {
        Array.from(el.children).forEach(el => walk(el, callback));
        return
    }
    let skip = false;
    callback(el, () => skip = true);
    if (skip) return
    let node = el.firstElementChild;
    while (node) {
        walk(node, callback);
        node = node.nextElementSibling;
    }
}

export default function Fragment() {
    Alpine.directive('fragment', (el, {expression}, {cleanup}) => {
        /**
         * Start by cloning content from fragment template
         */
        let clone = el.content.cloneNode(true).children;
        /**
         * Get the list of children from the cloned node
         */
        const cloneList = Array.from(clone);

        /**
         * Check if we are current in cleanup stage
         */
        let duringCleanup = false;

        const container = document.createDocumentFragment();
        cloneList.forEach(clone => {
            container.appendChild(clone);
        });

        Alpine.mutateDom(() => {
            el.after(container);

            cloneList.forEach(clone => {
                Alpine.addScopeToNode(clone, {});
                /**
                 * Start render the child
                 */
                Alpine.initTree(clone);
            })

            /**
             * The schedule inside alpine js core has not been published in the official alpine api. So we need a way to modify its behaviour
             * - Why?
             * When an element is deleted, their effect callbacks still haven't been removed from schedule queue.
             * By access to each effect's scheduler, we can stop the effects from occurring.
             * The odds behaviour is that the effect have to be executed after every tick. But It's okay, since it's safer.
             */
            walk(container, ((node) => {
                if (!node._x_effects) return;
                node._x_effects.forEach(a => {
                    const defaultScheduler = a.options.scheduler;
                    a.options.scheduler = (task) => {
                        setTimeout(() => {
                            defaultScheduler(() => {
                                if (!duringCleanup)
                                    task();
                            });
                        });
                    };
                });
            }));
        });
        /**
         * When the parent node is remove, or when this node is no longer appeared to the DOM,
         * remove any side effects on that node and its descendants
         */
        cleanup(() => {
            duringCleanup = true;
            /**
             * Walk every node and then remove all the effects
             */
            cloneList.forEach(node => {
                walk(node, ((node) => {
                    if (!!node._x_effects) {
                        node._x_effects.forEach(effect => {
                            Alpine.release(effect);
                        });
                    }
                    node.remove();
                }));
            });
        });
    })
};
