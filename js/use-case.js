var UseCase = (function() {
    'use strict';

    let UseCase = (radius) => {
        radius = radius || 50;
        let circle = new fabric.Circle({
            radius: radius,
            fill: '#DDD',
            stroke: '#444',
            strokeWidth: 4
        });

        let base = new fabric.Group([circle]);
        return UmlNode(base);
    };

    return UseCase;
})();