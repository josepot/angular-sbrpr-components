angular.module("sbrpr.groupBy", [])
.filter('groupBy', function () {
  var results={};
    return function (data, key) {
        if (!(data && key)) return;
        
        var result;
        if(!this.$id){
            result={};
        }else{
            var scopeId = this.$id;
            if(!results[scopeId]){                
                results[scopeId]={};
                this.$on("$destroy", function() {
                    delete results[scopeId];
                });
            }
            result = results[scopeId];
        }
        
        for(var k in result)
          result[k].splice(0,result[k].length);
        
        for (var i=0; i<data.length; i++) {
            if (!result[data[i][key]])
                result[data[i][key]]=[];
            result[data[i][key]].push(data[i]);
        }
        
        var keys = Object.keys(result);
        for(var i=0; i<keys.length; i++){
          if(result[keys[i]].length===0)
            delete result[keys[i]];
        }
        return result;
    };
});