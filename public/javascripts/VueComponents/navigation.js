/**
 * Created by ian0214 on 17/12/3.
 */
// var navComponent = {
//     template: '<nav class="my-nav" id="my-nav">'+
//     '<ul>'+
//     '<li :class="{active: items.Me}">'+
//     '<div class="big">我</div>'+
//     '<small class="small">Me</small>'+
//     '</li>'+
//     '<li :class="{active: items.Blog}">'+
//     '<div class="big">博客</div>'+
//     '<small class="small">Blog</small>'+
//     '</li>'+
//     '<li :class="{active: items.Lab}">'+
//     '<div class="big">实验室</div>'+
//     '<small class="small">Lab</small>'+
//     '</li>'+
//     '<!--<li>哈哈</li>-->'+
//     '</ul>'+
//     '<div id="like">Like&nbsp;<span class="glyphicon" :class="[isVoted? \'glyphicon-heart\':\'glyphicon-heart-empty\']"></span> </div>'+
//     '</nav>'
// };

var nav = new Vue({
    el: "#my-nav",
    // components: {
    //     'my-nav': navComponent
    // },
    data: {
        isVoted: false,
        items: {
            Index: false,
            Blog: false,
            Lab: false,
            Me: false,
        },
        likeCnt: "?"
    },
    
    computed: {
        text: function () {
            return this.isVoted?'Thanks!': 'Like it!';
        }  
    },

    methods: {
        likeClick: function () {
            var self = this;
            if(this.isVoted){
                console.info("喜欢过了")
            }else{
                $.ajax({
                    url: "/i-like-it",
                    type: 'post',
                    success: function (res) {
                        if(!res['liked'])
                            self.likeCnt = res['like-cnt'];
                        self.isVoted = true;
                    },
                    error: function (res) {
                        console.error("投票时发生错误")
                    }
                });
            }
        },

        getLikeCnt: function () {
            var self = this;
            $.ajax({
                url: "/like-cnt",
                type: "get",
                success: function (res) {
                    self.likeCnt = res.likeCnt;
                    self.isVoted = res.liked;
                }
            })
        },

        activate: function (active) {
            for(var item in nav.items){
                console.log(item+":"+active+"="+(item===active));
                nav.items[item] = (item === active);
            }

        }
    },

    created: function () {
        this.getLikeCnt();
    }
});