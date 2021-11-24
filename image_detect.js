function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// var colorList = []; //This will hold all our colors 
// function getColors(){
//         var canvas      = document.getElementById('img_canvas');
//         var context     = canvas.getContext('2d');
//         var imageWidth  = canvas.width;
//         var imageHeight = canvas.height;
//         var imageData   = context.getImageData(0, 0, imageWidth, imageHeight);
//         var data        = imageData.data;

//         // quickly iterate over all pixels
//         for(var i = 0, n = data.length; i < n; i += 4) {
//            var r  = data[i];
//            var g  = data[i + 1];
//            var b  = data[i + 2];
//            //If you need the alpha value it's data[i + 3]
//            var hex = rgb2hex("rgb("+r+","+g+","+b+")");
//            if ($.inArray(hex, colorList) == -1){
//                $('#list').append("<li>"+hex+"</li>");
//                colorList.push(hex);
//            }
//         }    
//         console.log(colorList)
// }

function hexColorDelta(hex1, hex2) {
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(1, 3), 16);
    var g1 = parseInt(hex1.substring(3, 5), 16);
    var b1 = parseInt(hex1.substring(5, 7), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(1, 3), 16);
    var g2 = parseInt(hex2.substring(3, 5), 16);
    var b2 = parseInt(hex2.substring(5, 7), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposit colors, 1 means same colors
    return (r + g + b) / 3;
}

function getClosestColor(hexDict, hex) {
    // console.log(hex)
    var diff = 0
    var legen_key = ''
    for (const [key, value] of Object.entries(hexDict)){
        
        var key_diff=hexColorDelta(key, hex)
        if (key_diff > diff) {
            diff = key_diff
            legen_key = key
        }
    }

    return legen_key
    
}

window.onload = function() {
var tooltipDiv= document.getElementById('tooltip');
var tooltip_value = document.getElementById("tooltip_value");
var tooltip_color_box = document.getElementById("tooltip_color_box");
var status = document.getElementById("status");
var img_canvas = document.getElementById("img_canvas");
var context = img_canvas.getContext("2d");
var img1 = new Image();
img1.setAttribute('crossOrigin', '');
img1.crossOrigin = "Anonymous";

img1.onload = function () {
    context.drawImage(img1, 0, 0);

};
img1.src = 'chlora.png';
window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
        tooltipDiv.style.top = (y + 10) + 'px';
        tooltipDiv.style.left = (x + 10) + 'px';
};


img_canvas.onmousemove = (function(e) {
    var legend = {
        "#730a00":  30.0,
        "#a81400":  15.0,
        "#e62000":  10.0,
        "#a83700":  5.0,
        "#e64c00":  2.5,
        "#ffaa00":  1.0,
        "#fffc00":  0.9,
        "#aafb02":  0.8,
        "#55fa00":  0.7,
        "#4ce601":  0.6,
        "#00a883":  0.5,
        "#004da8":  0.4,
        "#8420a8":  0.3,
        "#72104c":  0.2,
        "#320643":  0.1,
    };

    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    legen_key = getClosestColor(legend, hex) 
    // $('#status').html(coord + "<br>" + hex + "<br>value: " +legend[legen_key]);
    // $('#tooltip_value').html(legend[legen_key]);
    // $(color_box).css('background-color',hex)
    // $(tooltip_color_box).css('background-color',hex)
    
    tooltip_value.textContent = legend[legen_key];
    // status.html = coord + "<br>" + hex + "<br>value: " +legend[legen_key];

    color_box.style.backgroundColor = hex;
    tooltip_color_box.style.backgroundColor = hex;

});
};
