/* jshint -W097 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.on = on;
exports.default = toggle;
function on(id) {
    var e = 'swtched on ';
    console.log(e + id);
    exports.lastid = lastid = id;
}

function toggle(id) {
    var e = 'toggled ';
    console.log(e + id);
    exports.lastid = lastid = id;
}

var lastid = exports.lastid = 0;