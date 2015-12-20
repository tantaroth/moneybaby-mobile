'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:GeneralCtrl
 * @description
 * # GeneralCtrl
 * Provides rudimentary general management functions.
 */
angular.module('app')
    .controller('GeneralCtrl', function($scope, $rootScope, $timeout, $interval, $location, Auth, Ref, $firebaseObject, localStorageService, loginRedirectPath) {
        localStorageService.set('sync', (localStorageService.get('sync') || []));

        var profile = {
            name: 'Nombre',
            picture: 'images/yeoman.png'
        };
        $scope.logout = function() {
            $scope.profile = profile;

            Auth.$unauth();
            $location.path(loginRedirectPath);
        };

        $scope.profile = profile;

        $interval(function() {
            $scope.onLine = navigator.onLine;
            var authData = Auth.$getAuth();

            if (Auth.$requireAuth().$$state.status === 1 && navigator.onLine) {
                var userLogged = $firebaseObject(Ref.child('users/' + authData.uid));

                userLogged.$loaded()
                    .then(function(data) {
                        $scope.profile = data;
                        $scope.profile.picture = Auth.$getAuth().password.profileImageURL;
                        $scope.profile.status = Auth.$requireAuth().$$state.status;
                        $scope.profile.$save();
                    });
            }
        }, 1000);
        $scope.$on('$viewContentLoaded', function() {});
        $rootScope.loading = function(status) {
            if (status) {
                $('body').prepend(
                    $('<div></div>')
                    .addClass('loading')
                    .css({
                        height: $(window).innerHeight()
                    })
                    .append(
                        $('<div></div>')
                        .append(
                            $('<div><img src="images/loader.gif" width="100"/></div>')
                        )
                    )
                );
            } else {
                $('.loading').remove();
            }
        }
    });
