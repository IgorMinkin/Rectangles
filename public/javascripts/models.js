/**
 * Created by Igor on 8/25/14.
 */

function Rectangle(width, height, color, top, left) {
    this.id = uuid.v4();
    this.width = width;
    this.height = height;
    this.color = color;
    this.top = top;
    this.left = left;
}

Rectangle.prototype = {
    setPosition: function(top, left) {
        this.top = top;
        this.left = left;
    }
}

function Canvas(width, height, color, top, left) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.top = top;
    this.left = left;
    this.rectangles = [];
}

Canvas.prototype = {
    addRectangle: function(rectangle, offsetTop, offsetLeft) {
        rectangle.setPosition(offsetTop, offsetLeft);
        this.rectangles.push(rectangle);
    }
}

