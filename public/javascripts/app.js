/**
 * Created by Igor on 8/25/14.
 */
var rectanglesApp = angular.module('rectanglesApp', ['LocalStorageModule']);

rectanglesApp.controller('CanvasController', function($scope, localStorageService) {
    //initialize
    var canvas = readFromStore();
    if(canvas) {
        $scope.canvas = canvas;
    } else {
        $scope.canvas = getDefaultCanvas();
    }

    //event handlers
    $scope.save = function() {
        writeToStore($scope.canvas);
        toastr.success("Canvas saved..");
    }

    function readFromStore() {
        return localStorageService.get('canvas');
    }

    function writeToStore(canvas) {
        localStorageService.set('canvas', JSON.stringify(canvas));
    }

    function getDefaultCanvas() {
        return new Canvas(800, 400, '#FFE900', 10, 10);
    }

    //debug
    window.scope = $scope;
});

rectanglesApp.controller('ToolbarController', function($scope) {
    //Initialize
    $scope.newRectangle = {};

    $scope.addRectangle = function() {
        $scope.canvas.rectangles.push(
            new Rectangle(
                $scope.newRectangle.width,
                $scope.newRectangle.height,
                $scope.newRectangle.color));

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
                    rectangleWidth = parseInt(rectangle.width);

                return rectangle.top + rectangleHeight > 0
                        && rectangle.left + rectangleWidth > 0;
            };

            this.onRectangleMoved = function(rectangle) {
                if(!isInsideCanvas(rectangle)) {
//                    var remaining = _.filter(canvas.rectangles, function(r) {
//                        return r.id !== rectangle.id;
//                    });
//
//                    $scope.$apply(function() {
//                        canvas.rectangles = remaining;
//                    });
                }
            }
        },
        templateUrl: '/templates/canvas.html'
    }
});

rectanglesApp.directive('rectangle', function($document) {
    return {
        restrict: 'E',
        require: '^rectangleCanvas',
        scope: {
            rectangle: '=model'
        },
        templateUrl: '/templates/rectangle.html',
        link: function(scope, element, attrs, canvasCtrl) {
            var rectangle = scope.rectangle;
            $(element).draggable({stop: dragStop, containment: "parent"});

            function dragStop(e, ui) {
                console.log(ui);
                console.log(e);

                rectangle.top = ui.position.top;
                rectangle.left = ui.position.left;
                console.log(rectangle);
                canvasCtrl.onRectangleMoved(rectangle);
            }
        }
    };
});

rectanglesApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            function stop(e) {
                e.stopImmediatePropagation();
            }
            //element.bind('click', stop);
            element.bind('mousedown', stop);
            element.bind('mouseup', stop);

        }
    };
});

rectanglesApp.directive('specialButton', function() {
    return {
        restrict: 'A',
        scope: {
            click: '&'
        },
        link: function(scope, element) {
            function stop(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                scope.click();
            }

            element.bind('click',stop);
        }
    }
})