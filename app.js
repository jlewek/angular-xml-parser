angular.module('ex2', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('ex2').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        views: {
            '': {
                templateUrl: 'partial/home/home.html',
                controller: 'HomeCtrl'
            }
        }
    });

    
    $urlRouterProvider.otherwise('/');

});