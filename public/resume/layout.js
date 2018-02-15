function BorderLayout() {
    this.north = [new resumark.GlobalStyle()];
    // this.head = [];
    this.west = [];
    this.east = [];
    this.south = [];

    this.build = function (hint) {
        var northContent = hint?"north":this.joint(this.north);
        var westContent = hint?"left":this.joint(this.west);
        var eastContent = hint?"right":this.joint(this.east);
        var southContent = hint?"tail":this.joint(this.south);

        return `<div>
                    <div style="padding: 5pt 10pt">${northContent}</div>
                    <div>
                        <div style="padding: 5pt 10pt;position: relative;float:left;width: 50%;">${westContent}</div>
                        <div style="padding: 5pt 10pt;position: relative;float:left;width: 50%;">${eastContent}</div>
                    </div>
                    <div style="padding: 5pt 10pt">${southContent}</div>
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
        }
        return mountPoint;
    }
}
BorderLayout.prototype = resumark.LayoutPrototype;