/**
 * Created by ian0214 on 2017/8/15.
 */
function outline(contentId, outlineId) {
    var regexp = new RegExp(/h|H\d+/);
    var i = 0;
    var outlineHtml = '';
    var currentLevel = 0;
    $("#"+contentId).contents().each(function () {
        var nodeName = this.nodeName;
        if(regexp.test(nodeName)){
            i ++;
            var level = parseInt(nodeName.substring(1));
            var text = $(this).text();
            // var text = $(this).prop("id");
            $(this).prop("id", i);
            if(level > currentLevel){
                outlineHtml += '<ol>\n<li><a href="#'+i+'">'+text+'</a></li>\n';
                currentLevel = level;
            }else if(level === currentLevel){
                outlineHtml += '<li><a href="#'+i+'">'+text+'</a></li>\n';
            }else{
                // console.log(nodeName+",currentLevel "+currentLevel+",level "+level);
                for(let j=level;j<currentLevel;j++){
                    outlineHtml += '</ol>\n';
                }
                outlineHtml += '<li><a href="#'+i+'">'+text+'</a></li>';
                currentLevel = level;
            }
        }else{

        }
    });
    // console.log(outlineHtml);
    $("#"+outlineId).html(outlineHtml);
}