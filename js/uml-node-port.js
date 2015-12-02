var UmlNodePort = (function() {
    'use strict';
    var UmlNodePort = function(pos, parent) {
        var x = pos.x;
        var y = pos.y;

        var port = { parent: parent };
        var radius = 12;
        var strokeWidth = 4;

        port.icon = new fabric.Circle({
            left: x - radius,
            top: y - radius,
            strokeWidth: strokeWidth,
            radius: radius,
            fill: '#fff',
            stroke: '#666'
        });

        port.getPos = function() {
            let portPos = port.icon.getCenterPoint();
            let parentPos = parent.getPos();
            return {
                x: parentPos.x + portPos.x,
                y: parentPos.y + portPos.y
            };
        };

        return port;
    };

    return UmlNodePort;
})();