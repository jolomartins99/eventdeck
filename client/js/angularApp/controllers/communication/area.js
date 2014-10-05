"use strict";

eventdeckController.controller("CommunicationAreaController", function ($rootScope, $scope, $http, $routeParams, CommunicationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    $scope.communicationData = {
      markdown: ""
    };

    $scope.me = JSON.parse($scope.meJson);
    $scope.members = JSON.parse($scope.membersJson);
    $scope.roles = JSON.parse($scope.rolesJson);

    loadCommunications();

    function loadCommunications() {
      $scope.loading = true;

      if ($scope.thread.split("-")[1] === "") {
        setTimeout(loadCommunications, 500);
        return;
      }

      var pageId = $scope.thread.substring($scope.thread.indexOf("-") + 1);

      if ($scope.thread.indexOf("company-") != -1) {
        CommunicationFactory.Company.getAll( {id: pageId}, gotCommunications);
        $scope.kinds=['Email To', 'Email From', 'Meeting', 'Phone Call'];
      }
      else if ($scope.thread.indexOf("speaker-") != -1) {
        CommunicationFactory.Speaker.getAll( {id: pageId}, gotCommunications);
      }

      function gotCommunications(communications) {
        $scope.communications = communications;

        $scope.loading = false;

        if ($scope.thread.indexOf("speaker-") != -1) {
          if(communications.filter(function(o) {
            return o.kind.indexOf('Paragraph') != -1;
          }).length != 0) {
            $scope.kinds=['Email To', 'Email From', 'Meeting', 'Phone Call'];
          } else {
            $scope.kinds=['Inital Email Paragraph','Email To', 'Email From', 'Meeting', 'Phone Call'];
          }
        }
      }
    }

    $scope.postCommunication = function () {
      if (!$scope.communicationData.kind || $scope.communicationData.kind== ""){
        $scope.emptyCommunication = true;
        return;
      }
      if (!$scope.communicationData.text || $scope.communicationData.text== ""){
        $scope.emptyCommunication = true;
        return;
      }

      var date = Date.now();

      //console.log($scope.event);

      CommunicationFactory.Communication.create({
        thread: $scope.thread,
        member: $scope.me.id,
        kind: $scope.communicationData.kind,
        text: $scope.communicationData.text,
        event: $scope.event.id,
        posted: date,
        updated: date
      }, function (response) {
        $scope.communicationData.text = "";
        $scope.communicationData.kind = "";
        $scope.communicationForm.$setPristine();
        loadCommunications();
      });
    }

    $scope.saveCommunication = function (communication) {
      if (communication.buffer === "") {
        return;
      }

      communication.text = communication.buffer;
      communication.updated = Date.now();

      CommunicationFactory.Communication.update({id: communication._id}, communication, function (response) {
        communication.editing = false;
      });
    }

    $scope.deleteCommunication = function (communication) {
      CommunicationFactory.Communication.delete({id: communication._id}, function () {
        loadCommunications();
      });
    };

    $scope.approveCommunication = function (communication) {
      CommunicationFactory.Communication.approve({id: communication._id}, null, function (response) {
        loadCommunications();
      });
    };

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function(o) {
        return o.id == memberId;
      })[0];
    };

    $scope.checkPermission = function (communication) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && communication.member != $scope.me.id) {
        return false;
      }

      return true;
    }

    $scope.timeSince =function (date) {
      date = new Date(date);
      var seconds = Math.floor((Date.now() - date) / 1000);

      var suffix = 'ago';
      if(seconds < 0){
        seconds = Math.abs(seconds);
        suffix = 'to go';
      }

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
          return interval + " years " + suffix;
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
          return interval + " months " + suffix;
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + " days " + suffix;
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + " hours " + suffix;
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + " minutes " + suffix;
      }
      return Math.floor(seconds) + " seconds " + suffix;
    };

    $scope.convertURLs = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>");
    }
  }

});