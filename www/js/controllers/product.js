'use strict';
/**
 * @ngdoc function
 * @name projv1App.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('app')
    .controller('ProductCtrl', function($scope, $firebaseArray, $firebaseObject, $interval, Ref, localStorageService) {
        var objRef = 'stock';
        localStorageService.set('sync', (localStorageService.get('sync') || []));
        $scope.temp = {};
        $scope.msg = {};
        $scope.reset = function() {
            $scope.onLine = navigator.onLine;
            if ($scope.onLine) {
                $scope.list = $firebaseArray(Ref.child(objRef));
            } else {
                $scope.list = localStorageService.get('sync');
                $scope.sync = localStorageService.get('sync');
            }
            $scope.data = {};
            $scope.temp = {};
            $scope.editing = false;
        }
        $scope.addData = function(synchronizing) {
            var index = $scope.temp.index;
            if (typeof index == 'number') {
                if ($scope.onLine) {
                    if (index >= 0) {
                        $scope.list[index] = $scope.data;
                        $scope.msg = {
                            saving: ''
                        };
                        $scope.list.$save(index).then(function(ref) {
                            ref.key() === $scope.list[index].$id; // true
                        });
                    }
                }
            } else {
                if ($scope.onLine) {
                    if (typeof $scope.list.$add == 'undefined') {
                        $scope.list = $firebaseArray(fb.ref(objRef));
                    }
                    $scope.list.$add($scope.data);
                } else {
                    $scope.list.unshift($scope.data);
                    $scope.sync = localStorageService.get('sync') || [];
                    $scope.sync.unshift($scope.data);
                    localStorageService.set('sync', $scope.sync);
                }
            };
            if (typeof $scope.synchronizing == 'number') {
                $scope.sync.splice($scope.synchronizing, 1);
                localStorageService.set('sync', $scope.sync);
            }
            $scope.reset();
        }
        $scope.viewData = function(index) {
            $scope.onLine = $scope.onLine;
            $scope.editing = true;
            $scope.msg = {
                saving: 'Editando..'
            };
            $scope.data = $scope.list[index];
            $scope.temp.index = index;
        }
        $scope.removeData = function(index) {
            $scope.onLine = $scope.onLine;
            var index = $scope.temp.index,
                item = $scope.list[index],
                confirmed = (!$scope.removed) ? confirm("Seguro que desea remover este elemento?") : true;
            if (confirmed) {
                if ($scope.onLine) {
                    $scope.list.$remove(item).then(function(ref) {
                        ref.key() === item.$id; // true
                    });
                } else {
                    $scope.list.splice(index, 1);
                    $scope.sync.splice(index, 1);
                    localStorageService.set('sync', $scope.sync);
                }
                $scope.msg = {
                    saving: ''
                };
            };
            $scope.reset();
        }
        $scope.syncFn = function() {
            $scope.onLine = navigator.onLine;
            if ($scope.onLine) {
                if (localStorageService.get('sync')) {
                    if (localStorageService.get('sync').length > 0) {
                        var objSync = localStorageService.get('sync');
                        angular.forEach(localStorageService.get('sync'), function(value, key) {
                            if ($scope.synchronizing < key) return false;
                            objSync.splice(key, 1);
                            $scope.data = value;
                            $scope.synchronizing = key;
                            $scope.addData();
                        });
                    }
                }
            }
        }
        $interval(function() {
            if (localStorageService.get('sync').length > 0 && navigator.onLine) {
                $scope.loading = true;
            } else $scope.loading = false;
            $scope.syncFn();
        }, 1000);
        $scope.reset();
    });
