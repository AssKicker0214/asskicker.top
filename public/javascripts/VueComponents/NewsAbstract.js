/**
 * Created by ian0214 on 17/12/6.
 */
console.log("load vue's news-abstract");
Vue.component('news-abstract', {

    props: ['data'],
    //language=HTML
    template:
`<article class="news-abstract">
    <div class="time-line">
        <div class="text">{{data.date.formatted}}</div>
        <div class="line">
            <div class="dot"></div>
            <div class="link"></div>
        </div>
    </div>
    <div class="abstract">
        <div class="triangle"></div>
        <div class="detail">
            <h4>{{data.title}}</h4>
            <pre style="background-color: transparent; color: whitesmoke; border: none;">{{data.content}}</pre>
        </div>
    </div>
</article>`,

});


// function NewsAbstractFactory() {
//     var newsAbstractTemplate =
//         `<article class="blog-abstract">
//     <div class="time-line">
//         <div class="text">100天前</div>
//         <div class="line">
//             <div class="dot"></div>
//             <div class="link"></div>
//         </div>
//     </div>
//     <div class="abstract">
//         <div class="triangle"></div>
//         <div class="detail">
//             <h4>{{title}}</h4>
//             <div>这里是内容</div>
//         </div>
//     </div>
// </article>`;
//
//     this.newsVues = [];
//
//     this.newsListVue = new Vue({
//         el: "#news-list",
//         data: {
//             newsList: [{
//                 title: 'test',
//                 id: 111,
//                 content: 'testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'
//             }, {
//                 title: 'test2',
//                 id: 222,
//                 content: 'asdfasdfasdfsadfasdfsadfaskldjfffffffffffalllllllllllllllllll'
//             }]
//         }
//     });
//
//     this.getList = function () {
//
//     };
//
//     this.getTest = function () {
//         var self = this;
//         this.newsVues = [];
//         this.newsListVue.newsList.forEach(function (blog) {
//             self.newsVues.push(new Vue({
//                 el: "#blog-" + blog.id,
//                 components: {
//                     'news-abstract': newsAbstractTemplate
//                 },
//                 data: {
//                     // title: function () {
//                     //     return blog.title;
//                     // },
//                     title: 'ttt',
//                     content: function () {
//                         return blog.content;
//                     }
//                 }
//             }))
//         })
//     }
// }