var UmlLink = (function() {
    'use strict';
    var makeLine = function (positions) {
        return new fabric.Line(positions, {
            fill: '#444',
            stroke: '#444',
            strokeWidth: 2,
            selectable: false
        })
    };

    var UmlLink = function (fromPort, toPort, canvas, iconGen) {
        if (fromPort === toPort) {
            return null;
        }

        let endIcon = iconGen();

        var link = { fromPort: fromPort, toPort:toPort };
        link.update = function() {
            link.line.set({
                x1: fromPort.getPos().x,
                y1: fromPort.getPos().y,
                x2: toPort.getPos().x,
                y2: toPort.getPos().y
            });

            if (link.endIcon) {
                endIcon.setLeft(toPort.getPos().x - 4);
                endIcon.setTop(toPort.getPos().y - 4);
            }
        };

        link.endIcon = endIcon;
        link.line = makeLine([0,0,0,0]);
        link.update();

        canvas.add(link.line);
        if (link.endIcon) {
            canvas.add(endIcon);
        }

        link.hide = () => {
            link.line.set('visible', false);
            link.endIcon && link.endIcon.set('visible', false);
        };

        link.show = () => {
            link.line.set('visible', true);
            link.endIcon && link.endIcon.set('visible', true);
        };

        return link;
    };

    return UmlLink;
})();