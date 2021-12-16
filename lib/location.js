/*Created on 07/23/2021 14:16:58.*/


/* todo: delete this file, it was for testing, but I'm not sure if I used somewhere.
exports.getLocation = async function getLocation(){
  
   // Getting location
  var whereClause = "placeId = 'ChIJj6eAWCEXHxURtDaY6bqCkXI'";
  var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
  var locations =  await Backendless.Data.of("location").find(queryBuilder);
  
  if (locations.length > 0){
    return locations[0];
  }
  
  return null;
}

exports.saveLocation = async function saveLocation(loc){
    return await location.save(loc);
}


exports.saveLocationFromPos = async function saveLocation(lat, long){
    var point2 = 'POINT(' + lat + ' ' + long + ')';
    
    var location;
    location.position = point2;
    
    return await Backendless.Data.of("location").save(location);
}
*/