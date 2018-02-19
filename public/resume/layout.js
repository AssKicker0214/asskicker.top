function BorderLayout() {
    this.north = [new resumark.GlobalStyle()];
    // this.head = [];
    this.west = [];
    this.east = [];
    this.south = [];
    this.portrait = [];

    this.build = function (hint) {
        var northContent = hint?"north":this.joint(this.north);
        var westContent = hint?"left":this.joint(this.west);
        var eastContent = hint?"right":this.joint(this.east);
        var southContent = hint?"south":this.joint(this.south);
        var portrait = hint?"portrait":this.joint(this.portrait);

        return `<div>
                    <div style="padding: 5pt 10pt; background-color: #16aeb5; color: black;overflow: hidden;">
                        <div style="float:left;">${portrait}</div>
                        <div style="float:left; padding-left: 20pt;">${northContent}</div>
                        
                    </div>
                    <div style="overflow:hidden;">
                        <div style="padding: 5pt 10pt;position: relative;float:left;width: 48%;">${westContent}</div>
                        <div style="padding: 5pt 10pt;position: relative;float:left;width: 48%;">${eastContent}</div>
                    </div>
                    <div style="padding: 5pt 10pt; background-color: #1c9aa0; color: snow">${southContent}</div>
</div>`
    };

    this.getMountPoint = function (area) {
        var mountPoint = this.north;
        if(area === "west"){
            mountPoint = this.west;
        }else if(area === "east"){
            mountPoint = this.east;
        }else if(area === "south"){
            mountPoint = this.south;
        }else if(area === "portrait"){
            mountPoint = this.portrait;
        }
        return mountPoint;
    }
}
BorderLayout.prototype = resumark.LayoutPrototype;