/*Created on 06/26/2020 02:21:21.*/
/*'use strict'
class Alert extends Backendless.ServerCode.PersistenceItem {}
class location extends Backendless.ServerCode.PersistenceItem {}
class Ride extends Backendless.ServerCode.PersistenceItem {}
class Reserve extends Backendless.ServerCode.PersistenceItem {}
class Driver extends Backendless.ServerCode.PersistenceItem {}



var radius = 10000; //in meter
class AlertBusiness {

    /**
     * @description add alert
     * @route POST /AddAlert 
     *  @param {Alert} alert
     */
/*  async addAlert(alert) {
        //Get user
        var userId = alert.user
        var queryBuilder = Backendless.DataQueryBuilder.create();
        queryBuilder.setRelated("person");
        var loggedInUser = await Backendless.Data.of("Users").findById(userId, queryBuilder);
        var personFound = loggedInUser.person;

        var point1 = "'POINT(" + alert.from.longitude + " " + alert.from.latitude + ")'";
        var whereClause = "distanceOnSphere(region1.position, " + point1 + ") <= " + radius + " Or distanceOnSphere(region2.position, " + point1 + ") <= " + radius +
            " Or distanceOnSphere(region3.position, " + point1 + ") <= " + radius;
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var driversFound = await Driver.find(queryBuilder);


        if (driversFound[0] == null) {
            return {
                "message": "No available drivers for your alert!!",
                "code": -406
            };
        }


        //save newAlert without parameters in json
        var newAlert = {
            "leavingDate": alert.leavingDate,
            "price":alert.price,
           
        };
        
        var savedAlert = await Alert.save(newAlert);
        
        
        var fromLocation = await location.save(alert.from);
        var toLocation = await location.save(alert.to);
        
        //set relations 
        var alertData = Backendless.Data.of("alert");
        await Promise.all([
            alertData.setRelation(savedAlert, "from", [fromLocation.objectId]),
            alertData.setRelation(savedAlert, "to", [toLocation.objectId]),
            alertData.setRelation(savedAlert, "passenger", [personFound.objectId])
        ]);
        
        //this ride should be sent to founded drivers
        var ride = {};
        ride.price = alert.price;
        ride.leavingDate=alert.leavingDate;
        ride.availableSeats = 0;
        ride.availableLuggages = 0;
        ride.maxLuggages = alert.maxLuggage;
        ride.maxSeats = alert.maxSeats
        ride.comment = alert.comment;
        ride.from=fromLocation;
        ride.to=toLocation;
        
        //Here we should make a push notification for all drivers in the radius defined above
        return {
            "message": "Broadcasted_successfully!"
        }

    }
}
Backendless.ServerCode.addService(AlertBusiness);
*/