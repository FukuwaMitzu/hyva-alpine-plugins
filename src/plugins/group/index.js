let groupMap = new Map();

function getClosestGroup(el) {
    const closetGroupElement = Alpine.findClosest(el, current => {
        if (current._x_bssGroup) return true;
        return false;
    });
    if (closetGroupElement) return closetGroupElement._x_bssGroup;
}

export default function Group() {
    Alpine.directive('group', function (el, {expression, value}, {evaluate, cleanup}) {
        if (!expression) {
            expression = Symbol();
        }
        if (!value) {
            if (!groupMap.has(expression)) {
                groupMap.set(expression, new Map([['$root', Alpine.closestDataStack(el)]]));
            }
            el._x_bssGroup = expression;
            cleanup(() => {
                groupMap.delete(expression);
            });
            return;
        }

        let group;
        if (typeof expression === typeof Symbol()) {
            const closetGroup = getClosestGroup(el);
            if (closetGroup) group = closetGroup;
        } else group = expression;

        //Start setting members
        Alpine.nextTick(() => {
            const groupSet = groupMap.get(group);
            if (!groupSet) return;
            groupSet.set(value, Alpine.closestDataStack(el));
        });
    }).before('init');

    Alpine.magic('group', function (el) {
        const group = getClosestGroup(el);
        return new Proxy({}, {
            get(target, prop) {
                const groupMemberStack = groupMap.get(group);
                if (!groupMemberStack) return;
                const groupDataStack = groupMemberStack.get(prop);
                if (!groupDataStack) return;
                return Alpine.mergeProxies(groupDataStack);
            }
        });
    });
}
