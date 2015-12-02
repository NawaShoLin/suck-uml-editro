var ClassObject = (function () {
    'use strict';
    let makeLine = function(coordinates) {
        let defaultStyle = {
            fill: '#000',
            stroke: '#000',
            strokeWidth: 2,
            selectable: false
        };

        return new fabric.Line(coordinates, defaultStyle);
    };

    /**
     * @param {Array} positions - list of line-coordinates
     * @returns {Array} new lines
     */
    let makeLines = (positions) => {
        return positions.map(makeLine);
    };

    let genLinePositions = (rect) => {
        //  ----a----
        //  |---e---|
        //  b       c
        //  |---f---|
        //  ----d----
        let x1 = rect.getLeft();
        let x2 = x1 + rect.getWidth();
        let y1 = rect.getTop();
        let y2 = y1 + rect.getHeight();

        let yE = y1 + (1/3) * rect.getHeight();
        let yF = y1 + (2/3) * rect.getHeight();

        let a = [x1, y1, x2, y1];
        let b = [x1, y1, x1, y2];
        let c = [x2, y1, x2, y2];
        let d = [x1, y2, x2, y2];
        let e = [x1, yE, x2, yE];
        let f = [x1, yF, x2, yF];

        return [a, b, c, d, e, f];
    };

    let makeClassGraph = (width, height) => {
        let defaultSize = 100;
        width = width || defaultSize;
        height = height || defaultSize;

        let rect = new fabric.Rect({
            top:0, left:0,
            width: width,
            height: height,
            fill: '#DDD',
            opacity: 1
        });

        let objects = [rect];
        let lines = makeLines(genLinePositions(rect));
        lines.forEach(e => objects.push(e));

        return new fabric.Group(objects);
    };

    // constructor
    return (width, height) => {
        return UmlNode(makeClassGraph(width, height));
    };
})();
