angular.module('app.controllers', [])

.run(function($rootScope, $state) {
    // globals
    if (window.localStorage.getItem("favs"))
    {
        $rootScope.favs = JSON.parse(window.localStorage.getItem("favs"));
    }
    else
    {
        $rootScope.favs = [];
        window.localStorage.setItem("favs", JSON.stringify($rootScope.favs));
    }
    if (window.localStorage.getItem("results"))
    {
        $rootScope.results = JSON.parse(window.localStorage.getItem("results"));
    }
    else
    {
        $rootScope.results = [];
        window.localStorage.setItem("results", JSON.stringify($rootScope.results));
    }
    
    // get API key for channel search
    $rootScope.getSearchKey = (function() {
        var keys = [ "AIzaSyAkedClIJENM-lKk5Hwziprb_E9G5bKopc", "AIzaSyDdck0LEAXOCBVKDpN4ZgxC0Gk6zBedOTM", "AIzaSyBiwDi5co4t3Fopz9oEcfoisthYZz_kivM", "AIzaSyAm3hJqTq1L1wcz-cz_4zLUNs2PD37hLuY", "AIzaSyC_oqi_gbXaI29dkJJMRs0a82OWcl-h3tU" ];
        index = Math.round(Math.random() * 5);
        return function() {
            index %= 5;
            return keys[index++];
        }
    })();
    
    // changes the channel
    $rootScope.goToChannel = function(channel) {
        $state.go('tabsController.livecounts');
        $rootScope.$broadcast("channelChange", channel);
    }
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})
  
.controller('livecountsCtrl', ['$scope', '$stateParams', '$http', '$ionicPopup', '$rootScope', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $rootScope, $ionicLoading) {
    // globals (sorta)
    var updateId;
    /*$scope.name = $stateParams.name;
    $scope.channelId = $stateParams.id;*/
    
    /*if (!$scope.name || !$scope.channelId || !$scope.thumbnail)
    {
        $scope.name = "PsychoSoprano";
        $scope.channelId = "UCR-QYzXrZF8yFarK8wZbHog";
        $scope.thumbnail = "https://yt3.ggpht.com/-5nmY1TTxeVQ/AAAAAAAAAAI/AAAAAAAAAAA/PberiphHWm4/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
    }*/
    
    if (window.localStorage.getItem("currChannel"))
    {
        $scope.currChannel = JSON.parse(window.localStorage.getItem("currChannel"));
    }
    else
    {
        $scope.currChannel = {
            channelTitle: "PsychoSoprano",
            channelId: "UCR-QYzXrZF8yFarK8wZbHog",
            thumbnail: "https://yt3.ggpht.com/-5nmY1TTxeVQ/AAAAAAAAAAI/AAAAAAAAAAA/PberiphHWm4/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
        }
        
        window.localStorage.setItem("currChannel", JSON.stringify($scope.currChannel));
    }
    
    // get API key for subscriber count
    var getSubKey = (function() {
        var keys = [ "AIzaSyCRtJ2uhgYe7p3J-QkC6kHsm7KZz0bDIok", "AIzaSyCo-PwQAtlrchgSAY0hLnE2HYSRhqdsPXk", "AIzaSyC7asPTom1oZVPmZu7UcttGNFvqzRWQiRM", "AIzaSyDmUVXdKMQfp1428NsX0GuBHEp3Hh6VnRQ", "AIzaSyB0uq8HHarCnpYG4pZxYPwE8wLAtM_gBN0", "AIzaSyCgp_Uc2jj1mAd7HW9AzAATt33rGkvttVQ", "AIzaSyDUUfmvtaHY3lQ11CbkF8gplSJSXwgLe2g", "AIzaSyDzUqDdCGrb5g5YU0fo0pB9QbqurkK3GSc", "AIzaSyBgcyeGD9VK-Nu2pnlP5VQaLWqYSIPWZRk", "AIzaSyAGry7aVXPytGcqt-GrOb4HkIXVGbuL4As", "AIzaSyAiWjUpPAvVy1fLj2VTJitH56Gs-2PBMLY", "AIzaSyA2bieaAnufzw9YNibt0R2WI14L8uU9tbw", "AIzaSyDpTfaINBOTi_1YgYSmk25DPS8ex-duZsQ", "AIzaSyAGFMcByfMdsbQbpK7FE8MfHLZNjMDIWsw", "AIzaSyCLuua085lVPXp0Jmqb_AIePC0hG66N_5U", "AIzaSyDGu5pdf-_0cNIZdNkcLKtdpn0UNulX7hU", "AIzaSyDY8suw3_q3zMX6ZDhdr7IDpPLQ6CbEsoY", "AIzaSyCE9cyVSRDrn0nCjO_ajRDSHXUr3yqLnT0", "AIzaSyACVbv1wiiFdYQsaMQkthBJAUi-Ek-ZNkc", "AIzaSyANLBp5fHf-XEsQnksu_-ygJMHviGQO7TY", "AIzaSyCQXeXdjhu5SKnvLJeYz9SgyKbzT8fnQko", "AIzaSyBlSrOJ-ajuFM4cRpbPbuBnI1Fn3BPFrbg", "AIzaSyC9jt3y7ygY5qTToSUEanHCyMYonkCXz1w", "AIzaSyA5dmZA8HwtRCI24FDlf4E0atZ5KjYxzWA", "AIzaSyBBjLqNnzhnJ5xqRGwfdCmIVG13YNNNk2w", "AIzaSyACZdXbrIijp3kLgAGNIdSCe7uxxIvo9wY", "AIzaSyBKDw28djiaVr2rFLUUHEO2gNoa4SBa5Eo" ];
        var index = Math.round(Math.random() * 27);
        return function() {
            index %= 27;
            return keys[index++];
        }
    })();
    
    // search for YouTube channel and get first result
    $scope.searchChannel = function(t, callback) {
        url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + t + "&type=channel&fields=items/snippet&key=";
        $http({
            method: "GET",
            url: url + $rootScope.getSearchKey()
        }).then(function(response) {
            //$scope.channelId = response.data.items[0].snippet.channelId;
            //$scope.name = response.data.items[0].snippet.title;
            //update($scope.channelId);
            if (response.data.items.length > 0)
            {
                $rootScope.$broadcast("channelChange", { channelId: response.data.items[0].snippet.channelId, channelTitle: response.data.items[0].snippet.title, thumbnail: response.data.items[0].snippet.thumbnails.default.url});
                callback(true);
            }
            else
                callback(false);
        });        
    }
    
    // get subscriber count
    function getSubCount(t) {
        var e = t.length < 24 ? "forUsername" : "id";
        url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&" + e + "=" + t + "&fields=items/statistics/subscriberCount&key=";
        $http({
            method: "GET",
            url: url + getSubKey()
        }).then(function(response) {
            //console.log(response);
            $scope.subs = response.data.items[0].statistics.subscriberCount;
        });
    }
    
    // update subscriber count every 2 seconds
    function update(id) {
        clearInterval(updateId);
        getSubCount(id);
        updateId = setInterval(function() { getSubCount(id); }, 2000);
    }
    
    // change YouTube channel
    $scope.changeChannel = function() {
        $scope.data = {};
        
        popup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.channel" ng-enter="searchAndClose(data.channel)" autofocus>',
            title: "Enter channel name, username, ID, or URL",
            scope: $scope,
            buttons: [
                { text: "Cancel" },
                {
                    text: "<b>Change</b>",
                    type: "button-positive",
                    onTap: function(e) {
                        return $scope.data.channel;
                    }
                }
            ]
        });
        
        popup.then(function(res) {
            if (res)
            {
                $scope.searchChannel(res, function(success) {
                    if (!success)
                        $ionicLoading.show({ template: "Error: channel not found", noBackdrop: true, duration: 1000 });
                });
            }
        })
    }
    
    // search for channel and close the prompt
    $scope.searchAndClose = function(res) {
        popup.close();
        if (res)
        {
            $scope.searchChannel(res, function(success) {
                if (!success)
                    $ionicLoading.show({ template: "Error: channel not found", noBackdrop: true, duration: 1000 });
            });
        }
    }
    
    // adds a favorite
    $scope.newFav = function(channel) {
        var message;
        var exists = $rootScope.favs.some(function(item) {
            return channel.channelId == item.channelId;
        });
        if (!exists)
        {
            $rootScope.favs.push(channel);
            window.localStorage.setItem("favs", JSON.stringify($rootScope.favs));
            message = $scope.currChannel.channelTitle + " added to favorites";
        }
        else
        {
            message = $scope.currChannel.channelTitle + " already in favorites";
        }
        $ionicLoading.show({ template: message, noBackdrop: true, duration: 1000 });
    }
    
    update($scope.currChannel.channelId);
    
    $rootScope.$on("channelChange", function (event, args) {
        $scope.currChannel = args;
        if (args.thumbnails)
            $scope.currChannel.thumbnail = args.thumbnails.default.url;
        window.localStorage.setItem("currChannel", JSON.stringify($scope.currChannel));
        update(args.channelId);
    });
}])
   
.controller('settingsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('infoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('favoritesCtrl', ['$scope', '$stateParams', '$rootScope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope, $state) {
    // deletes a favorite
    $scope.deleteFav = function(fav) {
        $rootScope.favs.splice($rootScope.favs.indexOf(fav), 1);
        window.localStorage.setItem("favs", JSON.stringify($rootScope.favs));
    }
}])
   
.controller('searchCtrl', ['$scope', '$stateParams', '$rootScope', '$state', '$http', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope, $state, $http, $ionicLoading) {
    // initialize search textbox
    if (window.localStorage.getItem("searchQuery"))
    {
        $scope.query = window.localStorage.getItem("searchQuery");
    }
    
    // search for a channel
    $scope.search = function(t) {
        $rootScope.results = [];
        url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + t + "&type=channel&fields=items/snippet&maxResults=10&key=";
        $http({
            method: "GET",
            url: url + $rootScope.getSearchKey()
        }).then(function(response) {
            //$scope.channelId = response.data.items[0].snippet.channelId;
            //$scope.name = response.data.items[0].snippet.title;
            //update($scope.channelId);
            if (response.data.items.length > 0)
            {
                $rootScope.results = response.data.items;
                //console.log($rootScope.results);
                window.localStorage.setItem("searchQuery", t);
                window.localStorage.setItem("results", JSON.stringify($rootScope.results));
            }
            else
                $ionicLoading.show({ template: "Error: channel not found", noBackdrop: true, duration: 1000 });
        });
    }
}])