angular.module('MyApp')
  .controller('MainCtrl', function($scope, $rootScope, $location, $window, $auth, $http) {

	 console.log("main controller loaded");
	 $scope.albumResults  = [];
	 $scope.showModal     = false;
	 $scope.selectedAlbum = {};

     var accessToken = window.location.search.split("&")[0].split("access_token=")[1];
     $http.defaults.headers.common['Authorization'] = "Bearer " + accessToken; // set accessToken on allrequests
     console.log("spotify accessToken", accessToken);

   


	var fetchTracks = function (albumId, callback) {
	    $.ajax({
	        url: 'https://api.spotify.com/v1/albums/' + albumId,
	        success: function (response) {
	            callback(response);
	        }
	    });
	};

	$scope.openDetail = function(album){
		console.log("called openDetail", album);
		$scope.showModal = true;
		$scope.selectedAlbum = album;
	}

	$scope.closeModal = function(){
		$scope.showModal = false;
	}


    $scope.searchSpotify = function(albumORartist, query){

        $http.get('https://api.spotify.com/v1/search?q=' + query + '&type=' + albumORartist , {}, {headers: {
        	'Content-Type': 'application/json'} })
        .then(function (response) {
            console.log("search albums response", response);
            var response = response.data;
	        $scope.albumResults = $scope.albumResults.concat(response[albumORartist + "s"].items);
	        console.log("$scope.albumResults", $scope.albumResults);
        });          	
    }




		results.addEventListener('click', function (e) {
		    var target = e.target;
		    if (target !== null && target.classList.contains('cover')) {
		        if (target.classList.contains(playingCssClass)) {
		            audioObject.pause();
		        } else {
		            if (audioObject) {
		                audioObject.pause();
		            }
		            fetchTracks(target.getAttribute('data-album-id'), function (data) {
		                audioObject = new Audio(data.tracks.items[0].preview_url);
		                audioObject.play();
		                target.classList.add(playingCssClass);
		                audioObject.addEventListener('ended', function () {
		                    target.classList.remove(playingCssClass);
		                });
		                audioObject.addEventListener('pause', function () {
		                    target.classList.remove(playingCssClass);
		                });
		            });
		        }
		    }
		});

        $scope.doSearch = function(searchText){
		   $scope.searchSpotify('album', searchText);
           $scope.searchSpotify('artist', searchText);
        }




  });


