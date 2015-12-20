'use strict';
/**
 * @ngdoc function
 * @name projv1App.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('app')
    .controller('StockCtrl', function($scope, $firebaseArray, $firebaseObject, $interval, Ref, Auth, localStorageService) {
        var objRef = 'stock';

        $scope.temp = {};
        $scope.msg = {};
        $scope.onLine = navigator.onLine;
        $scope.iter = 0;

        if (navigator.onLine) {
            $scope.list = $firebaseArray(Ref.child(objRef));
        } else {
            $scope.sync = localStorageService.get('sync') || [];
            $scope.list = $scope.sync;
        }

        $scope.reset = function() {
            $scope.data = {};
            $scope.temp = {};
        }
        $scope.addData = function() {
            if (navigator.onLine) {
                $scope.list.$add($scope.data);
            } else {
                $scope.sync.unshift($scope.data);
                localStorageService.set('sync', $scope.sync);
            }

            $scope.reset();
        }
        $scope.syncFn = function() {
            var sync = localStorageService.get('sync');

            if (sync.length > 0) {
                if (!sync[$scope.iter].$id) {
                    $scope.data = sync[++$scope.iter];
                    $scope.addData();
                }
            }
        }

        $scope.syncFn();
        $scope.reset();

        localStorageService.set('sync', (localStorageService.get('sync') || []));
    });
