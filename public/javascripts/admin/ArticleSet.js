/**
 * Created by ian0214 on 17/11/14.
 */
function refreshSetList(isAsync) {
    $.ajax({
        url: "/admin/article/data/sets",
        type: "get",
        async: isAsync || false,
        dataType: "json",
        success: function (doc) {
            if (doc) {
                setList = doc.setList;
            }
        }
    });
}

function refreshArticleList(isAsync) {
    $.ajax({
        url: "/admin/article/data/articles",
        type: "get",
        async: isAsync || false,
        dataType: "json",
        success: function (doc) {
            if (doc) {
                articleList = doc.articleList;
                articleListModel.updateList(articleList)
            }
        }
    });
}
var setList = [];
var articleList = [];

var setDetailModel = new Vue({
    el: "#set-detail",
    data: {
        no: "-",
        disableSave: true,
        name: "test",
        description: "-",
        articles: [],
        action: "保存更新"
    },
    methods: {
        click: function (no) {
            var articles = setDetailModel.articles;
            var excludedNos = [];
            for (var i = 0; i < articles.length; i++) {
                if (no === articles[i].no) {
                    articles.splice(i, 1);
                    i --;
                } else {
                    excludedNos.push(articles[i].no);
                }
            }
            articleListModel.updateList(excludedNos);
        },
        addArticle: function (no) {
            for (var i = 0; i < articleList.length; i++) {
                if (no === articleList[i].no) {
                    setDetailModel.articles.push(articleList[i]);
                    console.log(articleList[i]);
                }
            }
        },
        setData: function (name, no, description, articleNos, action) {
            var articlesFilled = articleListModel.updateList(articleNos.map(function (articleNo) {
                return articleNo.articleNo;
            }));

            setDetailModel.articles = articlesFilled;
            setDetailModel.name = name;
            setDetailModel.no = no;
            setDetailModel.description = description;
            setDetailModel.action = action;
        },
        save: function () {
            if (!setDetailModel.no || !setDetailModel.name) {
                console.error("saving error, check set's no and name");
                return
            }
            var articles = [];
            setDetailModel.articles.forEach(function (article) {
                articles.push({articleNo: article.no})
            });
            setDetailModel.disableSave = true;
            setDetailModel.action = "正在保存";
            $.ajax({
                url: "/admin/article/set/save",
                type: "post",
                async: true,
                dataType: "json",
                data: {
                    no: setDetailModel.no,
                    name: setDetailModel.name,
                    description: setDetailModel.description,
                    createTime: new Date().getTime(),
                    articles: JSON.stringify(articles)
                },
                success: function () {
                    refreshSetList(false);
                    setListModel.updateList();
                    console.info("主题保存成功");
                },
                complete: function () {
                    setDetailModel.disableSave = false;
                    setDetailModel.action = "保存更新";
                }
            });
        }
    }
});

refreshSetList();
var setListModel = new Vue({
    el: "#set-list",
    data: {
        list: setList,
        selectedNo: null
    },
    methods: {
        create: function () {
            $.ajax({
                url: "/admin/article/set/precreate",
                type: "get",
                async: true,
                dataType: "json",
                success: function (res) {
                    setDetailModel.setData("", res.no, "", [], "保存新建");
                }
            });
        },

        updateList: function () {
            setListModel.list = setList.map(function (set) {
                set.size = set.articles.length;
                return set;
            });
        },

        click: function (set) {
            setDetailModel.setData(set.name, set.no, set.description, set.articles, "更新主题");
            setListModel.selectedNo = set.no;
        }
    }
});
setListModel.updateList();

// 右侧列表页
var articleListModel = new Vue({
    el: "#article-list",
    data: {
        articleList: []
    },
    methods: {
        click: function (no) {
            setDetailModel.addArticle(no);
            var articleList = articleListModel.articleList;
            for (var i = 0; i < articleList.length; i++) {
                if (no === articleList[i].no) {
                    articleList.splice(i, 1);
                    break;
                }
            }
        },

    }
});
articleListModel.updateList = function (excludedNos) {
    articleListModel.articleList = [];
    var filledArticles = [];
    articleList.forEach(function (item) {
        var exclude = false;
        for (var i = 0; i < excludedNos.length; i++) {
            if (item.no === excludedNos[i]) {
                exclude = true;
            }
        }
        if (!exclude) {
            articleListModel.articleList.push(item);
        }else{
            filledArticles.push({title: item.title, no: item.no, keywords: item.keywords})
        }
    });
    return filledArticles;
};


refreshArticleList();