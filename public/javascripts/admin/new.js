/**
 * Created by ian0214 on 18/1/9.
 */




var selected = new Vue({
    el: "#news-detail",
    data: {
        title: "",
        imgUrl: "",
        linkTo: {
            text: "不关联",
            type: "none",
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