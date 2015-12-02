var UmlNode = (function() {
    'use strict';

    // helpers
    let dist = (p1 ,p2) => {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    };

    var UmlNode = function(baseObject) {
        let node = {};

        let init = function() {
            node.base = baseObject;
            node.links = [];
            node.giveName("GGG");

            node.createPorts();
            node.hidePorts();
            node.disableSelect();
        };

        node.createPorts = function() {
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

        node.hidePorts = function() {
            node.ports.forEach(p =>
                p.icon.setVisible(false));
        };

        node.showPorts = function() {
            node.ports.forEach(p =>
                p.icon.setVisible(true));
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

        var updateLinks = function() {
            node.links.forEach(function(link) {
                link.update();
            });
        };

        baseObject.on('moving', function() {
            console.log('moving!');
        });

        node.on = function(evn, callback) {
            node.base.on(evn, callback);
        };

        node.enableSelect = function() {
            node.base.set('selectable', true);
        };

        node.disableSelect = function() {
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

    return UmlNode;
})();