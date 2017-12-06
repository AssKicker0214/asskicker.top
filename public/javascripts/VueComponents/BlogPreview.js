/**
 * Created by ian0214 on 17/12/6.
 */
Vue.component('blog-preview', {
    //language=HTML
    template:
`<article class="blog-preview">
    <div class="time-line">
        <div class="text">100天前</div>
        <div class="line">
            <div class="dot"></div>
            <div class="link"></div>
        </div>
    </div>
    <div class="preview">
        <div class="triangle"></div>
        <div class="detail">
            <h4>{{title}}</h4>
            <div>这里是内容</div>
        </div>
    </div>
</article>`
});
function BlogPreviewFactory() {

    this.blogVues = [];

    this.blogList = new Vue({
        el: "#blog-list",
        data: {
            blogs: [{
                title: 'test',
                id: 111,
                content: 'testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'
            },{
                title: 'test2',
                id: 222,
                content: 'asdfasdfasdfsadfasdfsadfaskldjfffffffffffalllllllllllllllllll'
            }]
        }
    });
    
    this.getList = function () {
        
    };
    
    this.getTest = function () {
        var self = this;
        this.blogVues = [];
        this.blogList.blogs.forEach(function (blog) {
            self.blogVues.push(new Vue({
                el: "#blog-"+blog.id,
                data: {
                    title: function () {
                        return blog.title;
                    },
                    content: function () {
                        return blog.content;
                    }
                }
            }))
        })
    }
}