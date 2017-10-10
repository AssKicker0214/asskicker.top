/**
 * Created by ian0214 on 2017/10/7.
 */
function makeTimePanel(direction, time, content, firstOfWhat) {
    var html = "<div class='panel " + direction + "-panel row'>";
    html += "<div class='col-xs-4'>";
    html += "<div class='digit-font xs-time-font'>";
    html += time;
    html += "</div><hr /><div class='cursive-font'>";
    html += content;
    html += "</div></div>";
    html += "<div class='col-xs-8 first-of-what'>";
    html += firstOfWhat;
    html += "</div>";
    html += "</div>";
    return html;
}