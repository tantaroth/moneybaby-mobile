angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, $rootScope, Auth, $location, $q, Ref, $timeout, $ionicLoading, loginRedirectPath, accountRedirectPath) {

    $scope.logout = function() {
        Auth.$unauth();
        $location.path(loginRedirectPath);
    };

    $scope.oauthLogin = function(provider) {
        $scope.err = null;
        Auth.$authWithOAuthPopup(provider, {
            rememberMe: true
        }).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
        $scope.err = null;
        Auth.$authAnonymously({
            rememberMe: true
        }).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
		$ionicLoading.show({
			template: 'Loading...'
		});
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
            var ref = Ref.child('users/'+user.uid),
                def = $q.defer();
        	console.log('>>> ', ref, user.uid);	
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
    	$scope.alert = {
    		message: JSON.stringify(data)
    	};
        $location.path('/page9/page10');
        $ionicLoading.hide();
    }

    function showError(err) {
    	$scope.alert = {
    		message: JSON.stringify(err)
    	};
        console.error('>>> ', err);
        $scope.err = err;
        $ionicLoading.hide();
    }

})

.controller('cameraTabDefaultPageCtrl', function($scope, $rootScope, $location, Auth) {
    $scope.logout = function() {$location, 
        Auth.$unauth();
        $location.path('/page3');
    };

	$scope.profile = {
		picture: Auth.$getAuth().password.profileImageURL,
		email: Auth.$getAuth().password.email
	};
})

.controller('cartTabDefaultPageCtrl', function($scope) {

})

.controller('cloudTabDefaultPageCtrl', function($scope) {

})
