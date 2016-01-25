angular.module('ex2').controller('HomeCtrl',function($scope, xmlparserService,$interval){

  $scope.phraseXml=function(){

  	// clear space with resolve after click button
	$scope.resolve='';
	$scope.jsonResult='';	

	// run methods to parse XML and return resolve to user
    var userObject=xmlparserService.parseXml($scope.userXml);
    var resolve=xmlparserService.generateParseArray(userObject);
    
    if(!resolve) // show message if xml string was bad
    {
      	$scope.errorMessage='Wrong XML string - parser error. Insert good xml.';
      	$interval(function(){$scope.errorMessage='';},3000);
    }
    else // show resolve if xml string was good
    {
	    $scope.resolve=resolve;
	    $scope.jsonResult= JSON.stringify(resolve);	
    }
  }
});