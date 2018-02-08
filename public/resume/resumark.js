/**
 * Created by ian0214 on 18/2/6.
 */
var resumark = {};
(function () {
    var rules = {
        cmd:   /^; /,
        ability: /^\[(.+)](=+_*)(\((.*)\))?/,
        header: /^(#+)\s+(.+)$/
    };

    var parser = {
        renderer: new Renderer(),
        lexer: new Lexer(),

        stmts: [],
        states: {
            code: false
        },
        builders: [],
        html: "<!--resumark, has not been built-->",

        debug: true,

        split: function (src) {
            src = src.replace(/\r\n|\r/g, '\n');
            this.stmts = src.split("\n");
        },
        parse: function (src) {
            var self = this;
            self.split(src);
            var _i = 0;
            var nextStmt = function (peek) {
                var stmt = false;
                if(_i<self.stmts.length){
                    stmt = self.stmts[_i];
                    if(!peek){
                        _i ++;
                    }
                }
                return stmt;
            };

            var stmt;
            this.builders = [];
            while(stmt=nextStmt()){
                // var builder = new Paragraph(stmt);
                var tmp = null;
                if((tmp = this.lexer.cmd(stmt))!==false){
                    this.builders.push(tmp);
                    continue;
                }
                if((tmp = this.lexer.ability(stmt)) !== false){
                    this.builders.push(tmp);
                    continue;
                }
                if((tmp = this.lexer.header(stmt)) !== false){
                    this.builders.push(tmp);
                    continue;
                }

                this.builders.push(new Paragraph(stmt));
            }

            if(this.builders.length>0){
                this.render();
            }

        },
        render: function () {
            this.html = this.builders.map(b=>b.render()).reduce((b1, b2) => b1+"\n"+b2);
            return this.html;
        },

        log: function (msg) {
            if(this.debug){
                console.log("[resumark]"+msg);
            }
        }
    };

    function Renderer() {

    }

    function Lexer() {
        this.cmd = function (stmt) {
            if(rules.cmd.test(stmt)){
                console.log(stmt);
                return stmt;
            }else{
                return false
            }
        };
        
        this.ability = function (stmt) {
            if(rules.ability.test(stmt)){
                var elements = stmt.match(rules.ability);
                console.log(elements);
                var percentage = (elements[2].lastIndexOf("=")+1.0)/elements[2].length;
                // console.log(percentage);
                return new AbilityBar(elements[1], percentage, elements[4]);
            }else{
                return false;
            }
        };

        this.header = function (stmt) {
            if(rules.header.test(stmt)){
                var elements = stmt.match(rules.header);
                console.log(elements[2]);
                return new Header(elements[2], elements[1].length);
            }else{
                return false;
            }
        }
    }

    function AbilityBar(ability, percentage, remark) {
        this.ability = ability || "";
        this.percentage = percentage || 0;
        this.remark = remark || "";

        this.render = function () {
            var percentageText = (this.percentage*100)^0+"";
            //language=HTML
            var html =
                    `<div class="ability">
                        <div style="display: flex;justify-content: space-between;align-items: flex-end;">
                            <span class="ability-name" style="font-size: 1rem">${this.ability}</span>
                            <span class="ability-remark" style="font-size: 0.8rem;">${this.remark}</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style="width: ${percentageText}%">
                                <span class="sr-only">${percentageText}</span>
                            </div>
                        </div>
                    </div>`;
            return html;
        }
    }

    function Header(text, level) {
        this.text = text;
        this.level = level || 1;
        if(this.level>5){
            this.level = 5;
        }else if(this.level<1){
            this.level = 1;
        }

        this.render = function () {
            var html = "<h"+this.level+">"+this.text+"</h"+this.level+">";
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

    resumark.parser = parser;
})();

