angular.module('emailTracker').controller('readController', ['$q', '$scope', function ($q, $scope) {

    function getParameterByName(name, string) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(string);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


    function hasOpened(email_id, callback) {
        var keen_client = new Keen({
            projectId: "55cdde1546f9a76970825c62", // String (required always)
            readKey: "288fcbf5659ea47d675d791d5dae7d2d9048e6a18df1ffe561364b8f4672c57ef976bb1567da4f3020046982baf4d586c7c8c99f71ce70e31a647948dd6eb3446fc0e4fe48c5f2ef68c27d79f87990f9680874552a333b7c9133aaa6c66cae6de366bab827f6b80bf4066f38fe8b06cd", // String (required for querying data)
            protocol: "auto", // String (optional: https | http | auto)
            host: "api.keen.io/3.0", // String (optional)
            requestType: "jsonp" // String (optional: jsonp, xhr, beacon)
        });

        var count_query = new Keen.Query("count", {
            eventCollection: "email_opened",
            groupBy: "email_id",
            filters: [
              {
                  "property_name": "email_id",
                  "operator": "eq",
                  "property_value": email_id
              }]
        });

        // Send query
        keen_client.run(count_query, function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                callback(res.result[0].result > 1);
            }
        });
    };

    function getKeenIdFromEmail() {
        var deferred = $q.defer();

        try {
            var currentEmail = Office.cast.item.toItemRead(Office.context.mailbox.item);

            deferred.resolve(currentEmail.getRegExMatches().KeenId[0]);
        } catch (error) {
            deferred.reject(error);
        }

        return deferred.promise;
    }

    getKeenIdFromEmail().then(function (keenId) {
        var url = $(keenId).attr('src');
        var obj = JSON.parse(window.atob(getParameterByName('data', url)));
        hasOpened(obj.email_id, function (result) {
            $scope.result = result ? "opened" : "not opened";
            console.log(result);
        });
    });




}]);
