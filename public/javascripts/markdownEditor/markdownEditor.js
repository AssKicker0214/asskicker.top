/**
 * Created by ian0214 on 2017/7/19.
 */
var TEXT_NODE = 3;
var ELEMENT_NODE = 1;
function Editor(options) {
    var container = $("#" + options.containerId);

    this.getPureText = function () {
        var text = '';
        getText(container);

        function getText(parent) {
            parent.contents().each(function () {
                // console.log("this->"+this.tagName+" | "+this.nodeName+" | "+this.nodeType);
                if (this.nodeType === TEXT_NODE) {
                    var tmpText = this.textContent || this.innerText || '';
                    tmpText = tmpText.replace(/\n/g, '');
                    text += tmpText;
                } else if (this.nodeType === ELEMENT_NODE) {
                    // console.log(this.nodeName);
                    if (this.nodeName === 'BR') {
                        // text += "\n";
                    } else if (this.nodeName === 'SPAN') {
                        getText($(this));
                    } else if (this.nodeName === 'DIV') {
                        getText($(this));
                        text += "\n";
                    } else {
                        console.error("没有识别的标签")
                    }
                }
            });
        }

        // console.log("getPureText return:\n"+text);
        return text;
    };

    this.scrollChain = function () {
        container.on('scroll', function (e) {
            // console.log(e);
        })
    };

    this.setOnEditHandler = function (handler) {
        document.execCommand('insertBrOrReturn', false, 'return');
        var renderHandler = function (e) {
            // console.log('haha');
        };
        container.on("keyup", handler)
            .on("paste", function (e) {
                if (options.pastePlainText) {
                    // cancel original paste
                    e.preventDefault();
                    // 粘贴纯文本不能使用以下方式，原因是：
                    // 1. 粘贴内容中的代码<script><...>会被getData("text/plain")直接删除
                    // 2. 每一行粘贴的内容都是文本节点，没有元素包裹，不好单独处理（如高亮当前行）
                    // var plainText = e.originalEvent.clipboardData.getData("text");
                    // plainText = plainText.replace(/\n/g, "<br />");
                    // console.log(plainText);
                    // document.execCommand("insertHTML", false, plainText);
                    // ////////////////////////////////////////////////////////////////////
                    var pasting = e.originalEvent.clipboardData.getData('text');
                    pasting = pasting.replace(/</g, "&lt;");
                    pasting = pasting.replace(/>/g, "&gt;");
                    var formatted = '<div class="editor-line">';
                    var lines = pasting.split('\n');
                    formatted += lines.join('</div><div class="editor-line">');
                    formatted += '</div>';
                    // console.log('formatted:\n' + formatted);
                    document.execCommand("insertHTML", false, formatted);
                } else {
                    handler(e);
                }

            })
            .on("cut", handler);
    };

    this.init = function () {
        setInterval(this.renderEditor, 1000);
    };

    this.renderEditor = function () {
        // console.info("rendering editor");
        if (true) {
            container.contents().filter(function () {
                var isTextNode = this.nodeType === TEXT_NODE;
                // console.log("filter " + isTextNode);
                return isTextNode;
            }).wrap('<div class="editor-line"></div>').end();
        }

        var id = 0;
        container.children().each(function () {
            var elem = $(this);
            elem.prop("id", "index-"+id);
            id += 1;
            var hasClass = elem.hasClass("editor-line");
            // console.log(hasClass);
            if(!hasClass){
                elem    .addClass("editor-line");
            }
        })
    }
}

function Controller(options) {
    var opt = options;
    var self = this;
    var model = {

    };
    var editor = new Editor({
        containerId: opt.editId,
        pastePlainText: true
    });

    var preview = $("#"+opt.previewId);

    this.init = function () {
        var handler = function (e) {
            // console.log(e.target);
            var pureText = editor.getPureText();
            self.render(pureText);
            // console.info(pureText);
        };
        editor.scrollChain();
        editor.setOnEditHandler(handler);
        editor.init();
    };

    this.getPureTextFromEditor = function () {
        return editor.getPureText();
    };

    this.render = function (rawMD) {
        var raw = '';
        if(arguments.length === 0){
            raw = editor.getPureText();
        }else{
            raw = rawMD;
        }
        var html = marked(raw);
        preview.html(html);
    }
}