/**
 * Created by ian0214 on 18/1/9.
 */

var newsList = new Vue({
    el: "#news-list",
    data: {
        list: []
    },
    methods: {
        updateList: function () {
            $.ajax({
                url: "/news/list",
                type: "get",
                dataType: "json",
                success: function (res) {
                    newsList.list = res.list;
                },
                error: function (err) {
                    console.error(err);

                }
            })
        },
        
        create: function () {
            
        }
    }
});
newsList.updateList();

var selected = new Vue({
    el: "#news-detail",
    data: {
        title: "",
        imgName: "",
        linkTo: {
            text: "不关联",
            type: "plain",
            no: ""
        },
        date: {
            formatted: "",
            timeStamp: new Date().getTime()
        },
        content: "",
        disableSave: false,
        action: "保存"
    },
    methods:{
        format: function () {

            var date = new Date(this.date.timeStamp);
            // console.log("in format "+this.date.timeStamp);
            var formatted = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
            this.date.formatted = formatted;
            // return date.get
            return formatted;
        },
        save: function () {
            var newsObj = {
                title: this.title,
                abstract: this.content,
                linkNo: this.linkTo.no,
                type: this.linkTo.type,
                time: this.timeStamp,
                posterName: this.imgName
            };
            $.ajax({
                url: "/admin/news/save",
                type: "post",
                data: newsObj,
                dataType: "json",
                success: function (res) {
                    console.info(res);
                },
                error: function (err) {
                    console.error(err);
                }
            })
        },

        selectType: function (type) {
            this.linkTo.type = type;
            if(type === "plain"){
                this.linkTo.text = "不关联";
            }else if(type === "article"){
                this.linkTo.text = "博客";
            }else if(type === "lab"){
                this.linkTo.text = "实验室";
            }
        },

        getTimeText: function () {
        }
    }
});

// 放在vue实例化之前会出错
(function() {
    $("#bg-img").fileinput({
        uploadUrl: "/admin/news/upload-bg-img",
        maxFileCount: 1,
        showPreview: false,

        msgUploadBegin: "开始上传",
        msgUploadThreshold: "正在上传...",
        msgUploadEnd: "上传成功"

    }).on('fileuploaded', function (event, data, previewId, index) {
        // console.log(data.response.url);
        var pathArray = data.response.url.split("/");
        selected.imgName = pathArray[pathArray.length-1];
    });

    $('#date').datepicker({
        todayBtn: true,
        clearBtn: true,
        language: "zh-CN",
        autoclose: true,
        todayHighlight: true
    }).on('changeDate', function (e) {
        // console.log(e);
        selected.date.timeStamp = e.date.getTime();
    });
})();