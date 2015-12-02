var UseCase = (function() {
    'use strict';

    let makeCircle = (radius) => {
        radius = radius || 50;
        let circle = new fabric.Circle({
            radius: radius,
            fill: '#DDD',
            stroke: '#444',
            strokeWidth: 4
        });

        return new fabric.Group([circle]);
    };

    return (radius) => {
        return UmlNode(makeCircle(radius));
    };
})();