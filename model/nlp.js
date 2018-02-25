/**
 * Created by ian0214 on 2017/8/17.
 */
// let hanzi = require("hanzi");
let natural = require("natural");
let Segment = require("segment");
let path = require('path');

class NLP {
    constructor() {
        // hanzi.start();
        this.tfidf = new natural.TfIdf();
        this.seg = new Segment();
        this.seg.useDefault();
        // console.log(__dirname);
        this.seg.loadDict(path.join(__dirname, 'extension.txt'));
        this.seg.loadStopwordDict(path.join(__dirname, "stopword.txt"));
    }

    segment(sentence) {
        // ////////////// hanzi 分词，不支持词性标注，不支持中英混合////////
        // console.log("remove english word");
        // let cnSentence = sentence.replace(/[^\u4e00-\u9fa5]+/g, '');
        // console.log("segmenting...");
        // return hanzi.segment(cnSentence);
        ////////////////////////////////////////////////////////////////

        let segments = this.seg.doSegment(sentence, {stripPunctuation: true});
        let rs = [];
        // console.log(segments);
        segments.forEach(function (item) {
            let word = item.w;
            let pos = item.p;
            if (pos === undefined || pos === Segment.POSTAG.D_N || pos === Segment.POSTAG.A_NR || pos === Segment.POSTAG.A_NZ || pos ===Segment.POSTAG.A_NT) {

                rs.push(word);
            }
        });
        // console.log(rs);
        return rs;
    }

    // natural 对于中文的tfidf计算可能存在错误，这里使用自己的算法
    getTfidf(targetIndex, documents, top) {
        // console.log(documents);
        this.tfidf = new natural.TfIdf();
        for (let i = 0; i < documents.length; i++) {
            this.tfidf.addDocument(documents[i]);
        }
        // console.log("加入文档=" + this.tfidf.documents.length);
        // console.log("目标文档序号" + targetIndex);
        // return this.tfidf.documents;

        let doc = this.tfidf.documents[targetIndex];
        // console.log(this.tfidf.documents);
        let tfidfs = [];
        for (let word in doc) {
            if (word !== "__key") {
                let tf = doc[word];
                let idf = this.tfidf.idf(word, false);
                console.log(word + ":" + tf + " x " + idf + " = " + (tf * idf));
                tfidfs.push({"term": word, "tfidf": tf * idf});
            }
        }
        tfidfs.sort(function (x, y) {
            return y.tfidf - x.tfidf;
        });

        if(top){
            tfidfs = tfidfs.slice(0, top);
        }
        return tfidfs;
    }
}

// test


module.exports = NLP;
// POSTAG.D_A  = 0x40000000; // 形容词 形语素
// POSTAG.D_B  = 0x20000000; // 区别词 区别语素
// POSTAG.D_C  = 0x10000000; // 连词 连语素
// POSTAG.D_D  = 0x08000000; // 副词 副语素
// POSTAG.D_E  = 0x04000000; // 叹词 叹语素
// POSTAG.D_F  = 0x02000000; // 方位词 方位语素
// POSTAG.D_I  = 0x01000000; // 成语
// POSTAG.D_L  = 0x00800000; // 习语
// POSTAG.A_M  = 0x00400000; // 数词 数语素
// POSTAG.D_MQ = 0x00200000; // 数量词
// POSTAG.D_N  = 0x00100000; // 名词 名语素
// POSTAG.D_O  = 0x00080000; // 拟声词
// POSTAG.D_P  = 0x00040000; // 介词
// POSTAG.A_Q  = 0x00020000; // 量词 量语素
// POSTAG.D_R  = 0x00010000; // 代词 代语素
// POSTAG.D_S  = 0x00008000; // 处所词
// POSTAG.D_T  = 0x00004000; // 时间词
// POSTAG.D_U  = 0x00002000; // 助词 助语素
// POSTAG.D_V  = 0x00001000; // 动词 动语素
// POSTAG.D_W  = 0x00000800; // 标点符号
// POSTAG.D_X  = 0x00000400; // 非语素字
// POSTAG.D_Y  = 0x00000200; // 语气词 语气语素
// POSTAG.D_Z  = 0x00000100; // 状态词
// POSTAG.A_NR = 0x00000080; // 人名
// POSTAG.A_NS = 0x00000040; // 地名
// POSTAG.A_NT = 0x00000020; // 机构团体
// POSTAG.A_NX = 0x00000010; // 外文字符
// POSTAG.A_NZ = 0x00000008; // 其他专名
// POSTAG.D_ZH = 0x00000004; // 前接成分
// POSTAG.D_K  = 0x00000002; // 后接成分
// POSTAG.UNK  = 0x00000000; // 未知词性
// POSTAG.URL  = 0x00000001; // 网址、邮箱地址