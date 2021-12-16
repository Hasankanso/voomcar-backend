/*Created on 06/26/2020 02:20:29.*/
/*'use strict'
class Schedule extends Backendless.ServerCode.PersistenceItem {}
class ScheduleRide extends Backendless.ServerCode.PersistenceItem {}
class Location extends Backendless.ServerCode.PersistenceItem {}
class Ride extends Backendless.ServerCode.PersistenceItem {}

class ScheduleRideBusiness {
    /**
     * @description add ScheduleRideBusiness
     * @route POST /AddSchedule 
     *  @param {Schedule} schedule
     */
/* async addSchedule(schedule) {
     var ride = schedule.ride;
     var user = schedule.user;
     delete schedule.ride;
     delete schedule.user;
     //parse variables to boolean and save schedule
     schedule.monday = schedule.Days[0];
     schedule.tuesday = schedule.Days[1];
     schedule.wednesday = schedule.Days[2];
     schedule.thursday = schedule.Days[3];
     schedule.friday = schedule.Days[4];
     schedule.saturday = schedule.Days[5];
     schedule.sunday = schedule.Days[6];
     //save schedule
     var savedSchedule = await Schedule.save(schedule);

     //get driver
     var personQueryBuilder = Backendless.DataQueryBuilder.create();
     personQueryBuilder.setRelated("person");
     var userFound = await Backendless.Data.of("Users").findById(user, personQueryBuilder);
     var personFound = userFound.person;
     var whereClause = "person='" + personFound.objectId + "'";
     var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
     var driverFound = await Backendless.Data.of("driver").find(queryBuilder);
     driverFound = driverFound[0];
     //save schedule ride
     var scheduleRide = await ScheduleRide.save();
     var scheduleRideData = Backendless.Data.of("scheduleRide");
     
     var rides = [];
     var startDate = new Date(schedule.startDate);
     var endDate = new Date(schedule.endDate);

     //avoid repetition of data
     // points
     var fromPoint = 'POINT(' + ride.from.longitude + ' ' + ride.from.latitude + ')';
     var toPoint = 'POINT(' + ride.to.longitude + ' ' + ride.to.latitude + ')';
     var rideFromName = ride.from.name;
     var rideToName = ride.to.name;
     var fromPlaceId = ride.from.placeId;
     var toPlaceId = ride.to.placeId;
     var from = {
         position: fromPoint,
         name: rideFromName,
         placeId: fromPlaceId
     };
     var to = {
         position: toPoint,
         name: rideToName,
         placeId: toPlaceId
     };
     var fromLocation = await Location.save(from);
     var toLocation = await Location.save(to);

     ////map 
     //var counter = await Backendless.Counters.incrementAndGet("mapImageCounter");
     //var data = ride.map;
     //data = Buffer.from(data, 'base64'); //convert base64 to byte array
     //ride.map = await Backendless.Files.saveFile("images/RideMaps", "ride" + counter + ".png", data, false);
     //max luggage seats
     ride.maxSeats = ride.availableSeats;
     ride.maxLuggages = ride.availableLuggages;

     // loop for every day
     for (var day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
         if (schedule.Days[day.getDay()]) {
             //add ride
             ride.leavingDate = day;
             var driverId = driverFound.objectId
             //saving ride
             var saveRide = await Ride.save(ride)
             var rideData = Backendless.Data.of("ride")
             await Promise.all([
                 rideData.setRelation(saveRide, "from", [fromLocation.objectId]),
                 rideData.setRelation(saveRide, "to", [toLocation.objectId]),
                 rideData.setRelation(saveRide, "driver", [driverId]),
                 rideData.setRelation(saveRide, "car", [ride.car])
             ]);
             var personFoundWhereClause = "objectId='" + personFound.objectId + "'";
             await Backendless.Data.of("person").bulkUpdate(personFoundWhereClause, {
                 "acomplishedRides": personFound.acomplishedRides + 1
             });

             var queryBuilder = Backendless.DataQueryBuilder.create();
             queryBuilder.setRelated(["car", "driver", "from", "to", "driver.person", "driver.person.countryInformations"]);
             var r = await Backendless.Data.of("ride").findById(saveRide.objectId, queryBuilder);
             rides.push(r);
         }
     }
     //set realtion driver and schedule to schedule ride
     await Promise.all([
         scheduleRideData.setRelation(scheduleRide, "driver", [driverFound.objectId]),
         scheduleRideData.setRelation(scheduleRide, "schedule", [savedSchedule.objectId]),
         scheduleRideData.setRelation(scheduleRide, "ride", rides)
     ]);
     return rides;
 }*/

/**
 * @description add delete schedule
 * @route POST /DeleteSchedule 
 *  @param {Schedule} schedule
 */
/* async deleteSchedule(schedule) { //ToDo
        var personQueryBuilder = Backendless.DataQueryBuilder.create();
        personQueryBuilder.setRelated("person");
        var userFound = await Backendless.Data.of("Users").findById(schedule.user, personQueryBuilder);

        var personFound = userFound.person;
        var whereClause = "person='" + personFound.objectId + "'"
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var driverFound = await Backendless.Data.of("driver").find(queryBuilder);
        driverFound = driverFound[0];
        //get scheduleRide
        var whereClause = "schedule='" + schedule.id + "' AND driver='"+driverFound.objectId+"'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated([ "ride","ride.from","ride.to"]);
        var scheduleRide = await Backendless.Data.of("scheduleRide").find(queryBuilder);
        scheduleRide=scheduleRide[0];
        //delete rides map 
                await Backendless.Data.of("ride").remove( "scheduleRide[ride].objectId ='"+ scheduleRide.objectId+"'");

        await Backendless.Files.remove(scheduleRide.ride[0].map); 
        //delete from and to
        await Backendless.Data.of("location").remove({
            objectId: scheduleRide.ride[0].from.objectId
        });
        await Backendless.Data.of("location").remove({
            objectId: scheduleRide.ride[0].to.objectId
        });
        //delete rides
        //delete schedule
        await Backendless.Data.of( "schedule" ).remove( { objectId:schedule.id } );
        //delete schedule rides
        await Backendless.Data.of("scheduleRide").bulkDelete("objectId='" + scheduleRide.objectId + "'");
        return "true";
    }
}*/
//Backendless.ServerCode.addService(ScheduleRideBusiness);
/*{
"startDate":"05/13/2020 05:17 AM",
"endDate":"05/25/2020 05:17 AM",
"monday":"true",
"saturday":"true",
"friday":"true",
"wednesday":"true",
"tuesday":"true",
"sunday":"true",
"thursday":"true",
"user":"79EAECD2-B036-4A30-A7ED-36571B10EFA5"
}*/