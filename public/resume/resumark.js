/**
 * Created by ian0214 on 18/2/6.
 */
var resumark = {};
(function () {
    var LayoutPrototype = {
        joint: function (components) {
            if(components && components.length && components.length>0){
                return components.map(b => b.render()).reduce((b1, b2) => b1 + "\n" + b2);
            }else{
                return components;
            }
        }
    };

    var rules = {
        cmd: /^; /,
        mount: /^; mount=(\w*)/,
        ability: /^\[(.+)](=+_*)(\((.*)\))?/,
        header: /^(#+)\s+(.+)$/,
        blockquote: /^> (.*)/
    };

    var parser = {
        // renderer: new Renderer(),
        lexer: new Lexer(),

        stmts: [],
        states: {
            code: false
        },
        builder: null,//new Builder(new TestLayout()),
        html: "<!--resumark, has not been built-->",

        debug: true,

        useLayout: function (layout) {

        },

        split: function (src) {
            src = src.replace(/\r\n|\r/g, '\n');
            // console.log(src);
            this.stmts = src.split("\n");
        },
        parse: function (src) {
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
            this.builder = new Builder(new TestLayout());
            while (stmt = nextStmt()) {
                // console.log(stmt);
                // var builder = new Paragraph(stmt);
                var tmp = null;
                if ((tmp = this.lexer.mount(stmt)) !== false) {
                    this.log("-> mounting to "+tmp);
                    this.builder.mount(tmp);
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
        this.push = function (itm) {
            this.mountPoint.push(itm);
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
        }
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
            if(area === 'left'){
                mountPoint = this.left;
                console.log("-> return 'left' mp")
            }else if(area === 'right'){
                mountPoint = this.right;
                console.log("-> return 'right' mp")
            }else{
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
    font-size: 16pt;
}
h1 {
    font-size: 44pt;
}
h2 {
    font-size: 38pt;
}
h3 {
    font-size: 34pt;
}
h4 {
    font-size: 30pt;
}
h5 {
    font-size: 28pt;
}
h6 {
    font-size: 24pt;
}
blockquote {
    border-left: #8157ff solid 3pt;
    background-color: rgba(100, 100, 100, .1);
    font-style: italic;
    padding: 5pt;
    word-break: break-all;
}

p {
    word-break: break-all;
}

.ability {
    position: relative;
}

.ability-name {
    position: relative;

}

.ability-remark {
    position: absolute;
    right: 0;
    text-align: right;
}

.measure {
    height: 10pt;
    margin-bottom: 20pt;
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
</style>
            `
        }
    }

    function Lexer() {
        this.cmd = function (stmt) {
            if (rules.cmd.test(stmt)) {
                console.log(stmt);
                return stmt;
            } else {
                return false
            }
        };

        this.mount = function (stmt) {
            if (rules.mount.test(stmt)){
                return stmt.match(rules.mount)[1];
            }else{
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
                            <span class="ability-name" style="font-size: 16pt">${this.ability}</span>
                            <span class="ability-remark" style="font-size: 14pt;">${this.remark}</span>
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
            return `<p style="font-size: 20px;">${this.text}</p>`;
        }
    }

    function Blockquote(text) {
        this.text = text || "";
        this.render = function () {
            return `<blockquote>${this.text}</blockquote>`;
        }
    }

    resumark.parser = parser;
})();

