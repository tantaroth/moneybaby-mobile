angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('signup', {
      url: '/sign-up',
      templateUrl: 'templates/signup.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('login', {
      url: '/page3',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('tabsController.cameraTabDefaultPage', {
      url: '/page10',
      views: {
        'tab4': {
          templateUrl: 'templates/cameraTabDefaultPage.html',
          controller: 'cameraTabDefaultPageCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.cartTabDefaultPage', {
      url: '/page11',
      views: {
        'tab5': {
          templateUrl: 'templates/cartTabDefaultPage.html',
          controller: 'cartTabDefaultPageCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.cloudTabDefaultPage', {
      url: '/page12',
      views: {
        'tab6': {
          templateUrl: 'templates/cloudTabDefaultPage.html',
          controller: 'cloudTabDefaultPageCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/page9',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    
      
    .state('menu', {
      url: '/side-menu24',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page3');

});