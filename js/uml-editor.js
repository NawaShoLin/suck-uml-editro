var UmlEditor = (function() {
    'use strict';
    let BaseState = function(editor) {
        let s = { editor: editor };

        let handlers = [
            'enterState', 'exitState',
            'mouseDown', 'mouseUp', 'mouseMove',
            'objectMoving'];
        let doNothing = () => {};

        for (let handler of handlers) {
            s[handler] = doNothing;
        }

        s.getPos = function(options) {
            return s.editor.canvas.getPointer(options.e);
        };

        return s;
    };

    let CreateClassState = function(editor) {
        let s = BaseState(editor);

        s.mouseDown = (opt) => {
            var pos = s.getPos(opt);
            s.editor.createClassObject(pos);
        };

        return s;
    };

    let CreateUseCase = (editor) => {
        let s = BaseState(editor);

        s.mouseDown = (opt) => {
            var pos = s.getPos(opt);
            s.editor.createUseCase(pos);
        };

        return s;
    };

    let SelectState = function(editor) {
        let s = BaseState(editor);

        s.enterState = () => {
            editor.nodes.forEach(node => node.enableSelect());
        };

        s.exitState = () => {
            let nodes = s.editor.nodes;
            nodes.forEach(node => node.disableSelect());
            nodes.forEach(node => node.hidePorts());
            editor.canvas.renderAll();
        };

        s.mouseDown = (e) => {
            let target = e.target;
            let nodes = s.editor.nodes;

            nodes.forEach(node => node.hidePorts());
            nodes.filter(node => node.base === target)
                 .forEach(node => {
                     node.showPorts();
                     s.editor.selectedNode = node;
                 });
            editor.canvas.renderAll();
        };

        s.objectMoving = () => {
            s.editor.links.forEach(link => link.update());
        };

        return s;
    };

    let LinkMode = (editor, endIcon) => {
        let s = BaseState(editor);
        let fromEvn = null;

        s.enterState = () => {
            fromEvn = null;
        };

        s.mouseDown = (e) => {
            let node = editor.nodes.find(n => n.base === e.target);
            if (node !== undefined) {
                fromEvn = e;
            }
        };

        s.mouseUp = (e) => {
            if (!fromEvn) {
                return;
            }
            let node = editor.nodes.find(n => n.base === e.target);
            if (node !== undefined) {
                s.editor.createLink(fromEvn, e, endIcon);
            }

            fromEvn = null;
        };

        return s;
    };


    let AssociationLine = (editor) => {
        return LinkMode(editor, () => null);
    };

    let GeneralizationLine = (editor) => {
        return LinkMode(editor, () => {
            return new fabric.Triangle({ width: 16, height: 16, fill: '#000'});
        });
    };

    let CompositionLine = (editor) => {
        return LinkMode(editor, () => {
            return new fabric.Rect({width:16, height:16,
                fill:'#000', angle: 45});
        });
    };

    let Group = (editor) => {
        let s = BaseState(editor);

        s.enterState = () => {
            editor.nodes.forEach(node => node.enableSelect());
            editor.links.forEach(link => link.hide());
        };

        s.exitState = () => {
            editor.nodes.forEach(node => node.disableSelect());
            s.editor.links.forEach(link => link.update());
            s.editor.links.forEach(link => link.show());
            s.editor.canvas.renderAll();
        };

        return s;
    };

    let bindEvents = (editor, canvas) => {
        let eventMap = new Map([
            ['mouse:down', 'mouseDown'],
            ['mouse:up', 'mouseUp'],
            ['mouse:move', 'mouseMove'],
            ['object:moving', 'objectMoving']
        ]);

        eventMap.forEach((handler, evn) => {
            canvas.on(evn, opt =>
                editor.state[handler](opt) );
        });
    };

    return (canvas) => {
        let editor = { canvas: canvas };

        let states = {
            'base': BaseState(editor),
            'createClass': CreateClassState(editor),
            'createUseCase': CreateUseCase(editor),
            'select': SelectState(editor),
            'associationLine': AssociationLine(editor),
            'generalizationLine': GeneralizationLine(editor),
            'compositionLine': CompositionLine(editor),
            'group': Group(editor)
        };

        editor.states = states;

        editor.nodes = [];
        editor.links = [];

        editor.init = function() {
            editor.state = states['createClass'];
            editor.selectedNode = null;

            canvas.setBackgroundColor('#EFE');
            bindEvents(editor, editor.canvas);
            canvas.renderAll();
        };


        editor.switchState = function(stateName) {
            if (! (stateName in states)) {
                throw "State not found" + stateName;
            }


            editor.state.exitState();
            editor.state = states[stateName];
            editor.state.enterState();
        };


        editor.createClassObject = function(pos) {
            let node = ClassObject();
            editor.nodes.push(node);

            let obj = node.base;
            obj.setLeft(pos.x);
            obj.setTop(pos.y);
            obj.set('selectable', false);

            canvas.add(obj);
        };

        editor.createUseCase = function(pos) {
            let node = UseCase();
            editor.nodes.push(node);

            let obj = node.base;
            obj.setLeft(pos.x);
            obj.setTop(pos.y);
            obj.set('selectable', false);

            canvas.add(obj);
        };

        editor.createLink = (fromEvn, toEvn, endIcon) => {
            let findPort = (opt) => {
                let node = editor.nodes.find(n => n.base === opt.target);
                if (node === undefined) {
                    throw "No match node.";
                }

                let pos = editor.canvas.getPointer(opt.e);
                return node.getClosestPort(pos);
            };

            let link = UmlLink(findPort(fromEvn), findPort(toEvn),
                editor.canvas, endIcon);
            link && editor.links.push(link);
        };

        editor.rename = (name) => {
            let node = editor.selectedNode;
            if (node) {
                node.rename(name);
                canvas.renderAll();
            }
        };

        return editor;
    };
})();