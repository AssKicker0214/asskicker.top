/**
 * Created by ian0214 on 18/1/9.
 */




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
            format: function () {

                var date = new Date(this.timeStamp);
                console.log("in format "+this.timeStamp);
                // return date.get
                return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
            },
            timeStamp: 0
        },
        content: "",
        disableSave: false,
        action: "保存"
    },
    methods:{
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
                this.linkTo.text = "实验室"
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
        console.log(e);
        selected.date.timeStamp = e.date.getTime();
    });
})();