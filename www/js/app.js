// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var db = null;

angular.module('app', ['ionic', 'ionic.service.core', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ui.odometer', 'ngCordova'])

.config([
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|youtube):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
])

.run(function($ionicPlatform, $rootScope, $cordovaAppAvailability, $cordovaPushV5, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    window.handleOpenURL = function(url)
    {
        //alert("Received URL: " + url);
        //console.log("received", url)
        //window.localStorage.setItem("initialChannel", /\/channel\/(.*)/.exec(url)[1]);
        $rootScope.$broadcast("initialChannel", { channelId: /\/channel\/(.*)/.exec(url)[1] });
    }
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.cordova && cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString("#8799a5");
    }
    
    if (navigator && navigator.splashscreen) {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 100);
    }
    
    // get device token
    if (window.cordova)
	{
		var push = new Ionic.Push({
		  "debug": true,
          "canShowAlert": false,
          "canSetBadge": true,
          "canPlaySound": true,
          "canRunActionsOnWake": true,
          "onNotification": function(notif) {
              //alert("you just got a notification");
              //console.log(notif);
              $rootScope.getNameAndIcon(notif._payload.channelId).then(function(channel) {
                  var inAppNotif = {
                      channel: channel,
                      message: notif.text,
                  }
                  // if app was asleep, read the notification and go to channel
                  if (notif.app.asleep)
                  {
                      inAppNotif.read = true;
                      $rootScope.goToChannel(channel);
                  }
                  else
                  {
                      inAppNotif.read = false;
                      $rootScope.unreadNotifs++;
                      window.localStorage.setItem("unreadNotifs", $rootScope.unreadNotifs);
                  }
                  $rootScope.inAppNotifs.push(inAppNotif);
                  window.localStorage.setItem("inAppNotifs", angular.toJson($rootScope.inAppNotifs));
                  
                  /*$rootScope.inAppNotifs.push({
                      channel: channel,
                      message: notif.text,
                      read: false
                  });
                  window.localStorage.setItem("inAppNotifs", angular.toJson($rootScope.inAppNotifs));
                  $rootScope.unreadNotifs++;
                  window.localStorage.setItem("unreadNotifs", $rootScope.unreadNotifs);*/
              });
          },
          "pluginConfig": {
              "android": {
                  "icon": "ic_stat_notificon",
                  "iconColor": "grey"
              },
              "ios": {
                  "badge": true,
                  "sound": true,
                  "alert": true
              }
          }
		});

		push.register(function(token) {
		  //alert("Device token: " + token.token);
          $rootScope.token = token.token;
          //window.localStorage.setItem("token", token.token);
		  push.saveToken(token);  // persist the token in the Ionic Platform
		});
        
        // listen for notifications
          /*var options = {
            android: {
              senderID: "808442088794"
            },
            ios: {
              alert: "true",
              badge: "true",
              sound: "true"
            },
            windows: {}
          };
          
          // initialize
          $cordovaPushV5.initialize(options).then(function() {
            // start listening for new notifications
            $cordovaPushV5.onNotification();
            // start listening for errors
            $cordovaPushV5.onError();
            
            // register to get registrationId
            $cordovaPushV5.register().then(function(registrationId) {
              // save `registrationId` somewhere;
            })
          });*/
	}
    
    /*window.onerror = function(msg, url, linenumber) {
        alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
        return true;
    }*/
    
    // open database
    if (window.cordova)
    {
        db = $cordovaSQLite.openDB("app.db");
    }
  });
})

.service('$cordovaScreenshot', ['$q', function($q) {
    return {
        capture: function(filename, extension, quality) {
            extension = extension || 'jpg';
            quality = quality || '100';

            var defer = $q.defer();

            navigator.screenshot.save(function(error, res) {
                if (error) {
                    console.error(error);
                    defer.reject(error);
                } else {
                    console.log('screenshot saved in: ', res.filePath);
                    defer.resolve(res.filePath);
                }
            }, extension, quality, filename);

            return defer.promise;
        }
    };
}]);

/*.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});*/