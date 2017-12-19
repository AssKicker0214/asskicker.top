/**
 * Created by ian0214 on 17/11/14.
 */
function refreshSetList(isAsync) {
    $.ajax({
        url: "/admin/article/data/topics",
        type: "get",
        async: isAsync || false,
        dataType: "json",
        success: function (doc) {
            if (doc) {
                topicList = doc.topicList;
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
var topicList = [];
var articleList = [];

var topicDetailModel = new Vue({
    el: "#topic-detail",
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
            var articles = topicDetailModel.articles;
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
                    topicDetailModel.articles.push(articleList[i]);
                    console.log(articleList[i]);
                }
            }
        },
        setData: function (name, no, description, articleNos, action) {
            var articlesFilled = articleListModel.updateList(articleNos.map(function (articleNo) {
                return articleNo.articleNo;
            }));

            topicDetailModel.articles = articlesFilled;
            topicDetailModel.name = name;
            topicDetailModel.no = no;
            topicDetailModel.description = description;
            topicDetailModel.action = action;
        },
        save: function () {
            if (!topicDetailModel.no || !topicDetailModel.name) {
                console.error("saving error, check topic's no and name");
                return
            }
            var articles = [];
            topicDetailModel.articles.forEach(function (article) {
                articles.push({articleNo: article.no})
            });
            topicDetailModel.disableSave = true;
            topicDetailModel.action = "正在保存";
            $.ajax({
                url: "/admin/article/topic/save",
                type: "post",
                async: true,
                dataType: "json",
                data: {
                    no: topicDetailModel.no,
                    name: topicDetailModel.name,
                    description: topicDetailModel.description,
                    createTime: new Date().getTime(),
                    articles: JSON.stringify(articles)
                },
                success: function () {
                    refreshSetList(false);
                    topicListModel.updateList();
                    console.info("主题保存成功");
                },
                complete: function () {
                    topicDetailModel.disableSave = false;
                    topicDetailModel.action = "保存更新";
                }
            });
        }
    }
});

refreshSetList();
var topicListModel = new Vue({
    el: "#topic-list",
    data: {
        list: topicList,
        selectedNo: null
    },
    methods: {
        create: function () {
            $.ajax({
                url: "/admin/article/topic/precreate",
                type: "get",
                async: true,
                dataType: "json",
                success: function (res) {
                    topicDetailModel.setData("", res.no, "", [], "保存新建");
                }
            });
        },

        updateList: function () {
            topicListModel.list = topicList.map(function (topic) {
                topic.size = topic.articles.length;
                return topic;
            });
        },

        click: function (topic) {
            topicDetailModel.setData(topic.name, topic.no, topic.description, topic.articles, "更新主题");
            topicListModel.selectedNo = topic.no;
        }
    }
});
topicListModel.updateList();

// 右侧列表页
var articleListModel = new Vue({
    el: "#article-list",
    data: {
        articleList: []
    },
    methods: {
        click: function (no) {
            topicDetailModel.addArticle(no);
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