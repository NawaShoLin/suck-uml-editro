var ClassObject = (function () {
    'use strict';
    var makeLine = function(coordinates) {
        return new fabric.Line(coordinates, {
            fill: '#000',
            stroke: '#000',
            strokeWidth: 2,
            selectable: false
        });
    };

    var makeLines = function(positions) {
        var lines = [];
        for (var i = 0; i < positions.length; i += 1) {
            lines.push(makeLine(positions[i]));
        }

        return lines;
    };

    var genLinePositions = function(rect) {
        //  ----a----
        //  |---e---|
        //  b       c
        //  |---f---|
        //  ----d----
        var x1 = rect.getLeft();
        var x2 = x1 + rect.getWidth();
        var y1 = rect.getTop();
        var y2 = y1 + rect.getHeight();

        var yE = y1 + (1/3) * rect.getHeight();
        var yF = y1 + (2/3) * rect.getHeight();

        var a = [x1, y1, x2, y1];
        var b = [x1, y1, x1, y2];
        var c = [x2, y1, x2, y2];
        var d = [x1, y2, x2, y2];
        var e = [x1, yE, x2, yE];
        var f = [x1, yF, x2, yF];

        return [a, b, c, d, e, f];
    };

    var ClassObject = function(width, height) {

        width = width || 100;
        height = height || 100;
        var baseRect = new fabric.Rect({
            top:0, left:0,
            width: width,
            height: height,
            fill: '#DDD',
            opacity: 1
        });

        var objs = [baseRect];
        var lines = makeLines(genLinePositions(baseRect));
        lines.forEach(function(e) {
            objs.push(e);
        });

        var base = new fabric.Group(objs);

        return UmlNode(base);
    };


    return ClassObject;
})();