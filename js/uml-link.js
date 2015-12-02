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

    return (fromPort, toPort, canvas, iconGen) => {
        if (fromPort === toPort) {
            return null;
        }

        let endIcon = iconGen();

        let self = { fromPort: fromPort, toPort:toPort };

        let init = () => {
            self.endIcon = endIcon;
            self.line = makeLine([0,0,0,0]);
            self.update();

            canvas.add(self.line);
            if (self.endIcon) {
                canvas.add(endIcon);
            }
        };

        let updateLine = () => {
            self.line.set({
                x1: fromPort.getPos().x,
                y1: fromPort.getPos().y,
                x2: toPort.getPos().x,
                y2: toPort.getPos().y
            });
        };

        let updateEndIcon = () => {
            let icon = self.endIcon;
            if (icon) {
                icon.setLeft(toPort.getPos().x - 4);
                icon.setTop(toPort.getPos().y - 4);
            }
        };

        self.update = () => {
            updateLine();
            updateEndIcon();
        };

        self.hide = () => {
            self.line.set('visible', false);
            self.endIcon && self.endIcon.set('visible', false);
        };

        self.show = () => {
            self.line.set('visible', true);
            self.endIcon && self.endIcon.set('visible', true);
        };

        init();
        return self;
    };
})();
