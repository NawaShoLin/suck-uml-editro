var UmlNodePort = (function() {
    'use strict';
    let makeIcon = (x, y, radius) => {
        return new fabric.Circle({
            left: x - radius,
            top: y - radius,
            strokeWidth: 4,
            radius: radius,
            fill: '#fff',
            stroke: '#666'
        })
    };

    return (pos, parent) => {
        let self = { parent: parent };

        let init = () => {
            self.icon = makeIcon(pos.x, pos.y, 12)
        };

        self.getPos = () => {
            let portPos = self.icon.getCenterPoint();
            let parentPos = parent.getPos();
            return {
                x: parentPos.x + portPos.x,
                y: parentPos.y + portPos.y
            };
        };

        self.hide = () => {
            self.icon.setVisible(false);
        };

        self.show = () => {
            self.icon.setVisible(true);
        };

        init();
        return self;
    };
})();
