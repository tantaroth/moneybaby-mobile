'use strict';
/**
 * @ngdoc function
 * @name projv1App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('app')
    .controller('LoginCtrl', function($scope, $rootScope, Auth, $location, $q, Ref, $timeout, accountRedirectPath) {

        if (Auth.$requireAuth().$$state.status === 1) {
            $location.path(accountRedirectPath);
        } else $scope.logout();

        $scope.oauthLogin = function(provider) {
            $rootScope.loading(true);
            $scope.err = null;
            Auth.$authWithOAuthPopup(provider, {
                rememberMe: true
            }).then(redirect, showError);
        };

        $scope.anonymousLogin = function() {
            $rootScope.loading(true);
            $scope.err = null;
            Auth.$authAnonymously({
                rememberMe: true
            }).then(redirect, showError);
        };

        $scope.passwordLogin = function(email, pass) {
            $rootScope.loading(true);
            $scope.err = null;
            Auth.$authWithPassword({
                email: email,
                password: pass
            }, {
                rememberMe: true
            }).then(
                redirect, showError
            );
        };

        $scope.createAccount = function(email, pass, confirm) {
            $rootScope.loading(true);
            $scope.err = null;
            if (!pass) {
                $scope.err = 'Please enter a password';
            } else if (pass !== confirm) {
                $scope.err = 'Passwords do not match';
            } else {
                Auth.$createUser({
                        email: email,
                        password: pass
                    })
                    .then(function() {
                        // authenticate so we have permission to write to Firebase
                        return Auth.$authWithPassword({
                            email: email,
                            password: pass
                        }, {
                            rememberMe: true
                        });
                    })
                    .then(createProfile)
                    .then(redirect, showError);
            }

            function createProfile(user) {
                var ref = Ref.child('users', user.uid),
                    def = $q.defer();
                ref.set({
                    email: email,
                    name: firstPartOfEmail(email)
                }, function(err) {
                    $timeout(function() {
                        if (err) {
                            def.reject(err);
                        } else {
                            def.resolve(ref);
                        }
                    });
                });
                return def.promise;
            }
        };

        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }

        function redirect(data, user) {
            $location.path('/account');
            $rootScope.loading(false);
        }

        function showError(err) {
            $scope.err = err;
            $rootScope.loading(false);
        }


    });
