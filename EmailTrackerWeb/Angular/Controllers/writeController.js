angular.module('emailTracker').controller('writeController', ['$scope', function ($scope) {

    $scope.isTracking = "No";
    $scope.addImage = function () {
        if ($scope.isTracking == "No") {
            $scope.isTracking = "Yes";
            var emailIdentifier = guid();
            var encodedData = window.btoa(JSON.stringify({
                "email_id": emailIdentifier

            })); // encode a string

            console.log(Office.context.mailbox.item.itemId);

            var imageTag = '<img src="https://api.keen.io/3.0/projects/55cdde1546f9a76970825c62/events/email_opened?api_key=' +
            'd43f2f8926f3133330fc321a0ba2dc579b3e4fd2fd59ce30723baad94eae187ce2e4060df706ca73e647cd7c5c51ef0dc837e139ca9a47e4ce33a245344969622edacca1bea635c1ab17b7ee03e44c74f3846cf229739420702b15be4572b9dd78707dcf121c5e5b3369beade3134507' +
            '&data=' + encodedData + '" class="keenImg" data-keen-id="' + emailIdentifier + '"/>'

            Office.cast.item.toItemCompose(Office.context.mailbox.item).body.setSelectedDataAsync(imageTag, {
                coercionType: Office.CoercionType.Html
            });
        }
    };

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }


}]);
