/**
 * Created by Igor on 8/25/14.
 */
var rectanglesApp = angular.module('rectanglesApp', []);

rectanglesApp.controller('CanvasController', function($scope) {
    //initialize
    var canvas = $scope.canvas = new Canvas(800, 400, '#FFE900', 10, 10);

    //debug
    window.scope = $scope;
});

rectanglesApp.controller('ToolbarController', function($scope) {
    //Initialize
    $scope.newRectangle = {};

    $scope.addRectangle = function() {
        $scope.canvas.addRectangle(
            new Rectangle(
                $scope.newRectangle.width,
                $scope.newRectangle.height,
                $scope.newRectangle.color), 10, 50);

        $scope.newRectangle = {};
    };
});

rectanglesApp.directive('rectangleCanvas', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            canvas: '=model'
        },
        controller: function($scope) {
            var canvas = $scope.canvas;
            var isInsideCanvas = function(rectangle) {
                var rectangleHeight = parseInt(rectangle.height),
                    rectangleWidth = rectangle.left + parseInt(rectangle.width);

                return rectangle.top + rectangleHeight > 0
                        && rectangle.left + rectangleWidth > 0;
            };

            this.rectangleMoved = function(rectangle) {
                if(!isInsideCanvas(rectangle)) {
                    var remaining = _.filter(canvas.rectangles, function(r) {
                        return r.id !== rectangle.id;
                    });

                    $scope.$apply(function() {
                        canvas.rectangles = remaining;
                    });
                }
            }
        },
        templateUrl: '/templates/canvas.html'
    }
})

rectanglesApp.directive('rectangle', function($document) {
    return {
        restrict: 'E',
        require: '^rectangleCanvas',
        scope: {
            rectangle: '=model'
        },
        templateUrl: '/templates/rectangle.html',
        link: function(scope, element, attrs, canvasCtrl) {
            var startX = 0, startY = 0, x = 0, y = 0;

            element.css({
                position: 'relative',
                cursor: 'pointer'
            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }

            function mouseup(e) {
                console.log(e);
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
                scope.rectangle.setPosition(y, x);
                console.log(scope.rectangle);
                canvasCtrl.rectangleMoved(scope.rectangle);
            }
        }
    };
});