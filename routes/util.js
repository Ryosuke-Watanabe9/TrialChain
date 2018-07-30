//set color from systemNo
module.exports.getColor = function (systemNo) {
    var color
    switch (systemNo) {
        case "VSC000":
            color = "#FF0000"
            break
        case "VSB000":
            color = "#800000"
            break
        case "VSH000":
            color = "#0901FC"
            break
        case "VTB000":
            color = "#00FC11"
            break
        case "VTD000":
            color = "#FD9400"
            break
        case "VSW000":
            color = "#F2FE02"
            break
        case "VSY000":
            color = "#FB02A7"
            break
        case "VSZ000":
            color = "#190707"
            break
    }
    return color
}
//set shape from type ... is not used
module.exports.getShape = function (type) {
    var shape
    // ellipse(○),triangle(△),rectangle(□),octagon(8角)
    if (type == "normal") {
        shape = "ellipse"
    } else if ((type == "StartJob") || (type == "EndJob")) {
        shape = "octagon"
    } else if (type == "file") {
        shape = "rectangle"
    }
    return shape
}
//set weight from type
module.exports.getWeight = function (type) {
    var weight
    switch (type) {
        case "critical":
            weight = 100
            break
        case "normal":
            weight = 50
            break
        /*
        case "end":
            weight = 80
            break
        */
    }
    return weight
}