var UmlNode = (function() {
    'use strict';

    // helpers
    let dist = (p1 ,p2) => {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    };

    return (baseObject) => {
        let node = {};

        let init = () => {
            node.base = baseObject;
            node.links = [];
            node.giveName("");

            node.createPorts();
            node.hidePorts();
            node.disableSelect();
        };

        node.createPorts = () => {
            let base = node.base;

            // radius of base object
            let rx = base.getWidth() / 2;
            let ry = base.getHeight() / 2;

            let leftPort = UmlNodePort({x: -rx, y: 0}, node);
            let rightPort = UmlNodePort({x: rx, y: 0}, node);
            let topPort = UmlNodePort({x:0, y: -ry}, node);
            let bottomPort = UmlNodePort({x: 0, y: ry}, node);

            node.ports = [leftPort, rightPort, topPort, bottomPort];

            // add ports to node object
            node.ports.forEach(port => base.add(port.icon));
        };

        node.hidePorts = () => {
            node.ports.forEach(p => p.hide());
        };

        node.showPorts = () => {
            node.ports.forEach(p => p.show());
        };

        node.getClosestPort = (pos) => {
            let ports = node.ports;
            if (node.ports.length === 0) {
                throw "Node have no ports.";
            }

            let minDist = dist(pos, ports[0].getPos());
            let closest = ports[0];
            ports.forEach(port => {
                let d = dist(pos, port.getPos());
                if (d < minDist) {
                    minDist = d;
                    closest = port;
                }
            });

            return closest;
        };

        node.getPos = () => {
            return node.base.getCenterPoint();
        };

        node.on = (evn, callback) => {
            node.base.on(evn, callback);
        };

        node.enableSelect = () => {
            node.base.set('selectable', true);
        };

        node.disableSelect = () => {
            node.base.set('selectable', false);
        };

        node.giveName = (name) => {
            let text = new fabric.Text(name, {
                top: -baseObject.getHeight() * 0.5 + 4,
                left: -baseObject.getWidth() * 0.5 + 4,
                fontSize:20
            });
            node.base.add(text);
            node.name = text;
        };

        node.rename = (name) => {
            node.base.remove(node.name);
            node.giveName(name);
        };

        init();
        return node;
    };
})();