angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.livecounts', {
    url: '/livecounts',
    views: {
      'tab4': {
        templateUrl: 'templates/livecounts.html',
        controller: 'livecountsCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'tab2': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('tabsController.info', {
    url: '/info',
    views: {
      'tab3': {
        templateUrl: 'templates/info.html',
        controller: 'infoCtrl'
      }
    }
  })

  .state('tabsController.favorites', {
    url: '/favorites',
    views: {
      'tab5': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })

  .state('tabsController.notifications', {
    url: '/notifications',
    views: {
      'tab6': {
        templateUrl: 'templates/notifications.html',
        controller: 'notificationsCtrl'
      }
    }
  })

  /*.state('tabsController.search', {
    url: '/search',
    views: {
      'tab6': {
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl'
      }
    }
  })*/

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/livecounts')

  

});