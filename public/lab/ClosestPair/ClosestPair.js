/**
 * Created by ian0214 on 18/1/2.
 */
function Canvas(id) {
    this.context = document.getElementById(id).getContext("2d");
    this.width = document.getElementById(id).getAttribute("width");
    this.height = document.getElementById(id).getAttribute("height");


    this.mapCoordinate = function (x, y) {

    }
}