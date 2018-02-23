/**
 * Created by ian0214 on 18/2/6.
 */
var resumark = {};
(function () {
    var LayoutPrototype = {
        joint: function (components) {
            if (components && components.length && components.length > 0) {
                return components.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            } else {
                return components;
            }
        },
    };
    resumark.LayoutPrototype = LayoutPrototype;

    var rules = {
        cmd: /^; /,
        mount: /^; (\w*)/,
        hr: /^-{3,}/,
        ability: /^\[(.+)](=+_*)(\((.*)\))?/,
        header: /^(#+)\s+(.+)$/,
        blockquote: /^> (.*)/,

        inline: {
            lineThrough: /~~([^~]+)~~/g,
            lineUnder: /__([^_]+)__/g,
            // boldAndItalic: /\*{3}([^*]+)\*{3}/g,
            bold: /\*{2}([^*]+)\*{2}/g,
            italic: /\*([^*]+)\*/g,
            image: /!\[(.+)]\((.*)\)(?:((?:\d*\.)?\d+)x((?:\d*\.)?\d+))?/g,
            link: /\[(.+)]\((.+)\)/g,
            tab: /\\t/g,
            space: /\\s/g
        },

        multiline: {
            panel: /(^|\n)```\n([^`]*)```($|\n)/g,
            // panel: /(^|\n)```\n([^(:?```)]*)```($|\n)/g,
        }
    };

    // 🏆d
    var parser = {
        // renderer: new Renderer(),
        lexer: new Lexer(),

        stmts: [],
        states: {
            code: false
        },
        builder: null,//new Builder(new TestLayout()),
        LayoutConstructor: BasicLayout,
        html: "<!--resumark, has not been built-->",

        debug: false,

        useLayout: function (LayoutConstructor) {
            this.LayoutConstructor = LayoutConstructor;
        },

        split: function (src) {
            src = src.replace(/\r\n|\r/g, '\n');
            // console.log(src);
            this.stmts = src.split("\n");
        },
        parse: function (src) {
            // process multiline
            src = this.lexer.panel(src);

            var self = this;
            self.split(src);
            var _i = 0;
            var nextStmt = function (peek) {
                var stmt = false;
                if (_i < self.stmts.length) {
                    stmt = self.stmts[_i];
                    if (!peek) {
                        _i++;
                    }
                }
                return stmt;
            };

            var stmt;
            this.builder = new Builder(new this.LayoutConstructor());
            while ((stmt = nextStmt()) !== false) {
                this.log(stmt);
                stmt = this.lexer.inline(stmt);

                var tmp = null;
                if ((tmp = this.lexer.mount(stmt)) !== false) {
                    this.log("-> mounting to " + tmp);
                    this.builder.mount(tmp);
                    continue;
                }
                if ((tmp = this.lexer.break(stmt)) !== false) {
                    this.builder.push(tmp);
                    continue;
                }
                if ((tmp = this.lexer.hr(stmt)) !== false) {
                    this.builder.push(tmp);
                    continue;
                }
                if ((tmp = this.lexer.ability(stmt)) !== false) {
                    this.builder.push(tmp);
                    continue;
                }
                if ((tmp = this.lexer.header(stmt)) !== false) {
                    this.builder.push(tmp);
                    continue;
                }
                if ((tmp = this.lexer.blockquote(stmt)) !== false) {
                    this.builder.push(tmp);
                    continue;
                }

                this.builder.push(new Paragraph(stmt));
            }

            if (!this.builder.isEmpty()) {
                return this.builder.build();
            } else {
                this.log("builder is empty");
                return "<!-- nothing -->";
            }

        },

        log: function (msg) {
            if (this.debug) {
                console.log("[resumark]" + msg);
            }
        }
    };

    function Builder(layout) {
        // this.components = [new GlobalStyle()];
        this.layout = layout || new BasicLayout();
        this.mountPoint = this.layout.getMountPoint();
        this.multilineContainer = null;
        this.push = function (itm) {
            // if(this.multilineContainer){
            //     this.multilineContainer.push(itm);
            // }else{
            this.mountPoint.push(itm);
            // }
        };
        this.isEmpty = function () {
            // return this.components.length === 0;
            return false;
        };
        this.build = function () {
            // var html = this.components.filter(it => it !== false).map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            var html = this.layout.build();
            // console.log(html);
            return html;
        };
        this.mount = function (area) {
            this.mountPoint = this.layout.getMountPoint(area);
        };
        // this.createMultilineContainer = function (mc) {
        //     this.mountPoint.push(mc);
        //     this.multilineContainer = mc;
        // };
        // this.endMultilineContainer = function () {
        //     this.multilineContainer = null;
        // }
    }


    function BasicLayout() {
        this.root = [new GlobalStyle()];
        this.getMountPoint = function (area) {
            return this.root;
        };
        this.build = function () {
            return this.root.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
        };
    }

    function TestLayout() {
        this.root = [new GlobalStyle()];
        this.left = [];
        this.right = [];
        this.build = function () {
            // var rootContent = this.root.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            // var leftContent = this.left.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            // var rightContent = this.right.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            var rootContent = this.joint(this.root);
            var leftContent = this.joint(this.left);
            var rightContent = this.joint(this.right);
            //language=HTML
            return `
<div class="">
${rootContent}
<div>
<div style="background-color: #00AAAA;position: relative;float:left;width: 33%;">${leftContent}</div>
<div style="background-color: #0C9A9A;position: relative;float:left;width: 65%">${rightContent}</div>
</div></div>`
        };
        this.getMountPoint = function (area) {
            var mountPoint = this.root;
            if (area === 'left') {
                mountPoint = this.left;
                console.log("-> return 'left' mp")
            } else if (area === 'right') {
                mountPoint = this.right;
                console.log("-> return 'right' mp")
            } else {
                console.log("-> return 'root' mp");
            }
            return mountPoint;
        }
    }

    TestLayout.prototype = LayoutPrototype;

    function GlobalStyle() {
        this.render = function () {
            //language=HTML
            return `
                <style>

                    /* 不支持flex布局 */
                    html {
                        /*font-size: 18pt;*/
                        /*font-family: "Microsoft YaHei", 'SimHei', serif;*/
                    }

                    #rendered {

                        /*font-size: 18pt;*/
                        font-family: "Microsoft YaHei", 'SimHei', serif;
                    }

                    #rendered a {
                        /*text-decoration: none;*/
                        color: #13174c;
                        font-weight: bolder;
                    }
                    
                    hr{
                        margin-top: 10px;
                        margin-bottom: 10px;
                        border: 0;
                        border-top: 1px solid #eee;
                    }

                    h1 {
                        font-size: 40pt;
                        margin-bottom: 10px;
                        margin-top: 10px;
                        /*font-size: 72pt;*/
                    }

                    h2 {
                        margin-bottom: 20px;
                        margin-top: 10px;
                        font-size: 36pt;
                    }

                    h3 {
                        margin-bottom: 20px;
                        margin-top: 10px;
                        font-size: 24pt;
                    }

                    h4 {
                        margin-bottom: 10px;
                        margin-top: 10px;
                        font-size: 20pt;
                    }

                    h5 {
                        margin-bottom: 10px;
                        margin-top: 10px;
                        font-size: 16pt;
                    }

                    h6 {
                        margin-bottom: 10px;
                        margin-top: 10px;
                        font-size: 14pt;
                    }

                    blockquote {
                        font-size: 11pt;
                        line-height: 30pt;
                        border-left: #189d99 solid 5pt;
                        background-color: rgba(100, 100, 100, .1);
                        font-style: italic;
                        padding: 5pt 5pt;
                        word-break: break-all;
                        margin: 2pt 0;
                    }

                    p {
                        /*text-indent: 2;*/
                        word-break: break-all;
                        font-size: 10pt;
                        /*line-height: 16pt;*/
                        margin: 0;
                        padding: 0 0 2pt 0;
                    }

                    .line-through {
                        text-decoration-line: line-through;
                    }

                    .line-under {
                        text-decoration-line: underline;
                    }

                    .ability {
                        position: relative;
                    }

                    .ability-name {
                        position: relative;
                        font-size: 11pt;
                        font-weight: bolder;
                    }

                    .ability-remark {
                        position: absolute;
                        right: 0;
                        text-align: right;
                        font-size: 10pt;
                    }

                    .measure {
                        height: 6pt;
                        margin-bottom: 10pt;
                        overflow: hidden;
                        background-color: #f5f5f5;
                        border-radius: 4px;
                        -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
                        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
                    }

                    .measurebar {
                        height: 100%;
                        background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
                        background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
                        background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
                        -webkit-background-size: 40px 40px;
                        background-size: 40px 40px;
                        background-color: #5cb85c;
                    }

                    .panel {
                        padding: 2pt 10pt;
                        border-radius: 5px;
                        box-shadow: 0 1pt 5pt darkgrey;
                        margin: 0;
                    }
                </style>
            `
        }
    }
    resumark.GlobalStyle = GlobalStyle;

    function Lexer() {
        // this.inPanel = false;

        this.inline = function (stmt) {
            var rendered = stmt
            // .replace(rules.inline.boldAndItalic, "<b><i>$1</i></b>")
                .replace(rules.inline.bold, "<b>$1</b>")
                .replace(rules.inline.italic, "<i>$1</i>")
                .replace(rules.inline.lineThrough, "<span class='line-through'>$1</span>")
                .replace(rules.inline.lineUnder, "<span class='line-under'>$1</span>")
                .replace(rules.inline.image, "<img src='$2' alt='$1' width='$3' height='$4'>")
                .replace(rules.inline.link, "<a href='$2' target='_blank'>$1</a>")
                .replace(rules.inline.tab, "&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(rules.inline.space, "&nbsp;")
            return rendered;
        };

        this.cmd = function (stmt) {
            if (rules.cmd.test(stmt)) {
                // console.log(stmt);
                return stmt;
            } else {
                return false
            }
        };

        this.mount = function (stmt) {
            if (rules.mount.test(stmt)) {
                return stmt.match(rules.mount)[1];
            } else {
                return false;
            }
        };

        this.break = function (stmt) {
            if (stmt === "") {
                return new Break();
            } else {
                return false;
            }
        };

        this.hr = function (stmt) {
            if (rules.hr.test(stmt)) {
                return new HorizontalRule();
            } else {
                return false;
            }
        };

        this.ability = function (stmt) {
            if (rules.ability.test(stmt)) {
                var elements = stmt.match(rules.ability);
                // console.log(elements);
                var percentage = (elements[2].lastIndexOf("=") + 1.0) / elements[2].length;
                // console.log(percentage);
                return new AbilityBar(elements[1], percentage, elements[4]);
            } else {
                return false;
            }
        };

        this.header = function (stmt) {
            if (rules.header.test(stmt)) {
                var elements = stmt.match(rules.header);
                // console.log(elements[2]);
                return new Header(elements[2], elements[1].length);
            } else {
                return false;
            }
        };

        this.blockquote = function (stmt) {
            if (rules.blockquote.test(stmt)) {
                // console.log("blockquote"+stmt.match(rules.blockquote)[1]);
                return new Blockquote(stmt.match(rules.blockquote)[1]);
            } else {
                return false;
            }
        };

        // 多行匹配
        this.panel = function (src) {
            // console.log(src);
            if (rules.multiline.panel.test(src)) {
                return src.replace(rules.multiline.panel, "$1<div class='panel'>\n$2</div>$3");
            } else {
                // console.log("not panel");
                return src;
            }
        }
    }

    function Break() {
        this.render = function () {
            return "<br />";
        }
    }

    function HorizontalRule() {
        this.render = function () {
            return "<hr />";
        }
    }

    function AbilityBar(ability, percentage, remark) {
        this.ability = ability || "";
        this.percentage = percentage || 0;
        this.remark = remark || "";

        this.render = function () {
            var percentageText = (this.percentage * 100) ^ 0 + "";
            //language=HTML
            var html =
                `<div class="ability">
                        <div>
                            <span class="ability-name">${this.ability}</span>
                            <span class="ability-remark">${this.remark}</span>
                        </div>
                        <div class="measure">
                            <div role="progressbar" class="measurebar" style="
                                width: ${percentageText}%;">
                            </div>
                        </div>
                    </div>`;
            return html;
        }
    }

    function Header(text, level) {
        this.text = text;
        this.level = level || 1;
        if (this.level > 6) {
            this.level = 6;
        } else if (this.level < 1) {
            this.level = 1;
        }

        this.render = function () {
            var html = "<h" + this.level + ">" + this.text + "</h" + this.level + ">";
            // console.log(html);
            return html;
        }
    }

    function Paragraph(text) {
        this.text = text || '';

        this.render = function () {
            return `<p>${this.text}</p>`;
        }
    }

    function Blockquote(text) {
        this.text = text || "";
        this.render = function () {
            return `<blockquote>${this.text}</blockquote>`;
        }
    }
    
    function Image(src, alt, width, height) {
        this.src = src;
        this.alt = alt;
        this.width = width || 50;
        this.height = height || 50;
        this.render = function () {
            return `<img src="${src}" alt="${alt}" width="${this.width}" height="${this.height}">`;
        }
    }

    // function MultilineContainer() {
    //     this.components = [];
    //     this.buildComponents = function () {
    //         return this.components.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
    //     };
    //     this.push = function (itm) {
    //         this.components.push(itm)
    //     }
    // };

    // function Panel() {
    //     this.build = function () {
    //         return `<div class="well">${this.buildComponents()}</div>`;
    //     }
    // }
    // Panel.prototype = new MultilineContainer();

    resumark.parser = parser;
})();

