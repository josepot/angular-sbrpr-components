describe('groupBy filter', function () {    
  var $filterProvider, $compile, $scope, $filter;

  beforeEach(function(){
    module('sbrpr.groupBy');
    inject(function (_$filter_, _$rootScope_, _$compile_) {
      $filter = _$filter_;
      $compile = _$compile_;
      $scope = _$rootScope_;
    });
    
   jasmine.addMatchers({
        toEqualData: function(angular) {
          return{
            compare: function(actual, expected){
              if (expected === undefined) 
                expected = '';
              var result = {};
              result.pass = angular.equals(actual, expected);
              return result;
            }
          }
        }
    });
    
    $scope.students = [
        {ID: 1,  name: 'Josep',  class: 'A'},
        {ID: 2,  name: 'Carles', class: 'B'},
        {ID: 3,  name: 'Xavi',   class: 'A'},
        {ID: 4,  name: 'Pere',   class: 'B'},
        {ID: 5,  name: 'Adrià',  class: 'C'}
    ];
  });

  it('should group students by class', function(){
    var grouppedStudents = $filter('groupBy')($scope.students, 'class');
    var expectedResult = {
      'A': [
        {ID: 1,  name: 'Josep',  class: 'A'},
        {ID: 3,  name: 'Xavi',   class: 'A'}
        ],
      'B': [
        {ID: 2,  name: 'Carles', class: 'B'},
        {ID: 4,  name: 'Pere',   class: 'B'}
        ],
      'C': [
        {ID: 5,  name: 'Adrià',  class: 'C'}
        ],
    };
    expect(grouppedStudents).toEqualData(expectedResult);
  });
  
  it('should work in a template', function() {    
    var elem = angular.element("<p>{{students | groupBy: 'class'}}</p>");
    $compile(elem)($scope);
    expect($scope.$digest.bind($scope)).not.toThrow();    
  });
  
  it('should be able to $watchCollection for an expression using the groupBy', 
  function() {    
    $scope.$watchCollection("students|groupBy:'class'", function(collection){});
    expect($scope.$digest.bind($scope)).not.toThrow();
  });
  
  it('should work inside an ngRepeat', function() {    
    var elem = angular.element(
      "<ul>" +
       "<li ng-repeat=\"(class, classStudents) in (students | groupBy: 'class')\">" +
          "{{class}}" +
          "<ul>" +
            "<li ng-repeat=\"student in classStudents\">" +
              "{{student.name}}" +
            "</li>" +
          "</ul>" +
        "</li>" +
      "</ul>");
    $compile(elem)($scope);
    expect($scope.$digest.bind($scope)).not.toThrow();
    expect(elem.children().length).toBe(3);
    expect(elem.children().children().children().length).toBe(5);
  });
  
  it('should work inside an ngRepeat in combination with other filters', function() {    
    var elem = angular.element(
      "<ul>" +
       "<li ng-repeat=\"(class, classStudents) in (students|filter:'e' | groupBy:'class')\">" +
          "{{class}}" +
          "<ul>" +
            "<li ng-repeat=\"student in classStudents\">" +
              "{{student.name}}" +
            "</li>" +
          "</ul>" +
        "</li>" +
      "</ul>");
    $compile(elem)($scope);
    expect($scope.$digest.bind($scope)).not.toThrow();    
    expect(elem.children().length).toBe(2);
    expect(elem.children().children().children().length).toBe(3);
  });
});