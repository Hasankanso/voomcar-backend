/*Created on 05/10/2020 07:06:39.*/
'use strict'
class ride extends Backendless.ServerCode.PersistenceItem {}
class car extends Backendless.ServerCode.PersistenceItem {}
class currency extends Backendless.ServerCode.PersistenceItem {}
class location extends Backendless.ServerCode.PersistenceItem {}
class user extends Backendless.ServerCode.PersistenceItem {}
class Reserve extends Backendless.ServerCode.PersistenceItem {}

class RideBusiness extends Backendless.ServerCode.PersistenceItem {

    /**
     * @private
     */
    static validateAddRide(ride, countryInformation) {
        const {
            createError
        } = require('../lib/generalRoutines');
        var from = ride.from;
        var to = ride.to;
        var leavingDate = ride.leavingDate;
        var maxSeats = ride.maxSeats;
        var maxLuggages = ride.maxLuggages;
        var map = ride.map;
        var stopTime = ride.stopTime;
        var price = ride.price;
        var description = ride.comment;
        var car = ride.car.objectId;
        if (ride == null) {
            return createError(-8001, "No_ride_found");
        }
        if (from == null || to == null || leavingDate == null || map == null || price == null || description == null) {
            return createError(-1002, "Arguments_missing");
        }
        if (from.placeId != null && to.placeId != null) {
            if (from.placeId == to.placeId) {
                return createError(-8006, "Same_from_to");
            }
        } else if (from.longitude == to.longitude && from.latitude == to.latitude) {
            return createError(-8006, "Same_from_to");
        }
        var now = new Date();
        if (now.setMinutes(now.getMinutes() + 25) >= leavingDate) {
            return createError(-8007, "Adding_Early_Ride");
        }
        if (stopTime != null) {
            if (stopTime > 30 || stopTime < 5)
                return createError(-8008, "StopTime_Out_Of_Bound")
        }

        if (description.length < 3 || description.length > 400) {
            return createError(-8009, "Comment_Length_is_Not_Suitable");

        }
        if (price < countryInformation.minPrice || price > countryInformation.maxPrice) {
            return createError(-8010, "Price_Out_Of_Bound");
        }
        return null;

    }

    /**
     * @private
     */
    static validateDeleteRide(ride) {
        const {
            createError
        } = require('../lib/generalRoutines');
        if (ride == null) {
            return createError(-8001, "No_ride_found");
        }
    }
    /**
     * @description add a ride
     * @route POST /AddRide
     * @param {Ride} ride
     */

    async addRide(ride) {
        const {
            getUser
        } = require('../lib/user');
        const {
            createError
        } = require('../lib/generalRoutines');

        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userFound;
        }

        var whereClause = "ownerId='" + userFound.objectId + "'";
        var userQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        userQueryBuilder.setRelated(["countryInformations"]);
        var personFound = await Backendless.Data.of("Person").find(userQueryBuilder);
        personFound = personFound[0];

        var countryInformation = personFound.countryInformations;

        var error = RideBusiness.validateAddRide(ride, countryInformation);
        if (error != null) {
            return error;
        }

        var leave = ride.leavingDate;
        ride.leavingDate = new Date(leave);
        ride.maxSeats = ride.availableSeats;
        ride.maxLuggages = ride.availableLuggages;

        var fromLocation;
        var toLocation;
        //add from
        var whereClause = "placeId='" + ride.from.placeId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var locationFound = await Backendless.Data.of("location").find(queryBuilder);
        locationFound = locationFound[0];
        if (locationFound != null) {
            fromLocation = locationFound;
        } else {
            var from = {
                position: 'POINT(' + ride.from.longitude + ' ' + ride.from.latitude + ')',
                name: ride.from.name,
                placeId: ride.from.placeId
            };
            fromLocation = await location.save(from);
        }
        //add to
        var whereClause = "placeId='" + ride.to.placeId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var locationFound = await Backendless.Data.of("location").find(queryBuilder);
        locationFound = locationFound[0];
        if (locationFound != null) {
            toLocation = locationFound;
        } else {
            var to = {
                position: 'POINT(' + ride.to.longitude + ' ' + ride.to.latitude + ')',
                name: ride.to.name,
                placeId: ride.to.placeId
            };
            toLocation = await location.save(to);
        }

        var whereClause = "ownerId='" + userFound.objectId + "'";
        var userQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var statisticsFound = await Backendless.Data.of("userStatistics").find(userQueryBuilder);
        statisticsFound = statisticsFound[0];

        var driverFound = await RideBusiness.getDriver(userFound.objectId);


        var car = ride.car;
        var saveRide = await ride.save(ride);

        var rideData = Backendless.Data.of("ride");
        await Promise.all([
            rideData.setRelation(saveRide, "from", [fromLocation.objectId]),
            rideData.setRelation(saveRide, "to", [toLocation.objectId]),
            rideData.setRelation(saveRide, "driver", [driverFound.objectId]),
            rideData.setRelation(saveRide, "car", [car])
        ]);

        var personFoundWhereClause = "ownerId='" + userFound.objectId + "'";
        await Backendless.Data.of("userStatistics").bulkUpdate(personFoundWhereClause, {
            "acomplishedRides": statisticsFound.acomplishedRides + 1
        });

        saveRide.from = fromLocation;
        saveRide.to = toLocation;
        saveRide.car = await Backendless.Data.of("car").findById(car);

        return saveRide;

    }

    /**
     * @description edit ride
     * @route POST /EditRide
     * @param {Ride} newRide
     */
    async editRide(newRide) {

        const {
            getUser
        } = require('../lib/user');
        const {
            createError
        } = require('../lib/generalRoutines');

        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userFound; //userFound will be an error object here.
        }

        var whereClause = "ownerId='" + userFound.objectId + "'";
        var getRideQuery = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        getRideQuery.setRelated(["car"]); //we need to make sure maxSeats don't exceed car seats
        var foundRide = await Backendless.Data.of("ride").findById(newRide.id, getRideQuery);
        var error = RideBusiness.validateEditRide(newRide, foundRide);

        var editRideWhereClause = "objectId='" + newRide.id + "' AND ownerId='" + userFound.objectId + "'";
        await Backendless.Data.of("ride").bulkUpdate(editRideWhereClause, {
            "comment": newRide.comment,
            "maxSeats": newRide.maxSeats,
            "maxLuggages": newRide.maxLuggages,
            "availableSeats": newRide.availableSeats,
            "availableLuggages": newRide.availableLuggages
        });

        delete newRide.car;

        newRide.objectId = newRide.id;
        newRide.car = foundRide.car;
        return newRide;
    }

    /**
     * @private
     */
    static validateEditRide(newRide, ride) {
        const {
            createError
        } = require('../lib/generalRoutines');

        if (ride == null) {
            return createError(-8001, "No_ride_found");
        }

        var car = ride.car; //we get this from database.

        if (newRide.comment == null || newRide.maxSeats == null || newRide.maxLuggages == null) {
            return createError(-1002, "Arguments_missing")
        }

        var commentLength = ride.comment.length;

        if (newRide.comment.length < commentLength) {
            return createError(-8001, "Comment_is_shorter");
        }

        var similarPart = newRide.comment.substring(0, commentLength);

        if (similarPart.normalize() != ride.comment.normalize()) {
            return createError(-8002, "Cant_change_comment");
        }

        if (newRide.comment.length > 400) {
            return createError(-8003, "Comment_too_long");
        }

        if ((newRide.maxSeats > car.maxSeats) || (newRide.maxSeats < ride.maxSeats)) {
            return createError(-8004, "MaxSeat_too_larg_small");
        }

        if ((newRide.maxLuggages > car.maxLuggages) || (newRide.maxLuggages < ride.maxSeats)) {
            return createError(-8005, "MaxLuggage_too_larg_small");
        }

        return null;
    }

    /**
     * @description cancel ride
     * @route POST /CancelRide
     * @param {Ride} ride
     */
    async deleteRide(ride) {
        const {
            getUser
        } = require('../lib/user');
        const {
            createError,
            sendNotificationToMultipleUser
        } = require('../lib/generalRoutines');

        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userFound;
        }

        var error = RideBusiness.validateDeleteRide(ride);
        if (error != null) {
            return error;
        }

        var driverFound = await RideBusiness.getDriver(userFound.objectId);


        var whereClause = "driver='" + driverFound.objectId + "'";
        var rideQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var rideFound = await Backendless.Data.of("ride").findById(ride.id, rideQueryBuilder);

        if (rideFound == null) {
            return {
                "deleted": true
            }
        }


        var whereClause = "ride='" + ride.id + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["person"]);
        var passengers = await Backendless.Data.of("reserve").find(queryBuilder);

        rideFound.status = "CANCELED";
        await Backendless.Data.of("ride").save(rideFound);

        if (passengers.length != 0) {
            var whereClause = "ownerId='" + userFound.objectId + "'";
            var userQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var personFound = await Backendless.Data.of("person").find(userQueryBuilder);
            personFound = personFound[0];

            var tokens = [];
            for (var i = 0; i < passengers.length; i++) {
                tokens.push(passengers[i].person.token);
            }
            var title = "Ride has been canceled";
            var body = "Your ride with " + personFound.firstName + " " + personFound.lastName + " has been canceled";
            var objects = [ride.id];
            var d1 = new Date(rideFound.leavingDate);
            var d2 = new Date();
            var diffTime = d1 - d2;
            if ((((diffTime / 1000) / 60) / 60) <= 48) {
                objects.push(ride.reason);
                objects.push(new Date());
                body.concat(", please rate him.");
            }
            await sendNotificationToMultipleUser(tokens, title, body, objects, "RIDE_CANCELED");
        }

        //update statistics
        var personFoundWhereClause = "ownerId='" + userFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(personFoundWhereClause);
        var userStatistics = await Backendless.Data.of("userStatistics").find(queryBuilder);
        userStatistics = userStatistics[0];


        await Backendless.Data.of("userStatistics").bulkUpdate(personFoundWhereClause, {
            "acomplishedRides": userStatistics.acomplishedRides - 1,
            "canceledRides": userStatistics.canceledRides + 1
        });

        return {
            "deleted": true
        }
    }
    /**
     * @description get upcoming rides
     * @route POST /GetMyUpcomingRides
     */
    async getMyUpcomingRides() {

        const {
            getUser
        } = require('../lib/user');
        const {
            createError
        } = require('../lib/generalRoutines');

        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userFound;
        }

        var whereClause = "ownerId= '" + userFound.objectId + "'";
        var queryB = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryB.setRelated(["countryInformations", "statistics"]);

        var personFound = await Backendless.Data.of("person").find(queryB);
        personFound = personFound[0];

        var driverFound = await RideBusiness.getDriver(userFound.objectId);

        var reserveRidesFound = await RideBusiness.getAllReservedRides(personFound);

        var upcomingRides = reserveRidesFound;
        if (driverFound == null) {
            return upcomingRides;
        }


        var drivenRides = await RideBusiness.getAllDrivenRides(driverFound.objectId);

        var allRides = reserveRidesFound;

        if (drivenRides[0] != null) {
            var i = reserveRidesFound.length;
            for (var j = 0; j < drivenRides.length; j++) {
                allRides[i] = drivenRides[j]
                i++
            }
        }
        upcomingRides = allRides;
        return upcomingRides;
    }
    /**
     * @private
     */
    static async getAllDrivenRides(driverId) {
 var now = new Date();
      now.setDate(now.getDate()-2);
      now=now.getTime()
        var whereClauseRide = "driver='" + driverId + "' AND leavingDate > '" + now + "'";
        var queryBuilderRide = Backendless.DataQueryBuilder.create().setWhereClause(whereClauseRide);
        queryBuilderRide.setRelated(["car", "from", "to"]);
        var drivenRides = await Backendless.Data.of("ride").find(queryBuilderRide);
        //get passengers

        for (var x = 0; x < drivenRides.length; x++) {
            var reserveClause = "ride='" + drivenRides[x].objectId + "'";
            var reserveQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(reserveClause);
            reserveQueryBuilder.setRelated(["person", "person.countryInformations", "person.statistics"]);
            drivenRides[x].driver = "";
            drivenRides[x].passengers = await Backendless.Data.of("reserve").find(reserveQueryBuilder);
        }

        return drivenRides;
    }
    /**
     * @private
     */
    static async getAllReservedRides(personFound) {
 var now = new Date();
      now.setDate(now.getDate()-2);
      now=now.getTime()

        var whereClause = "person='" + personFound.objectId + "' AND ride.leavingDate > '" + now + "' AND status != 'CANCELED'";

        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);

        queryBuilder.setRelated(["ride", "ride.car", "ride.from", "ride.to", "ride.driver", "ride.driver.person", "ride.driver.person.countryInformations", "ride.driver.person.statistics"]);
        var reserveRidesFound = await Backendless.Data.of("reserve").find(queryBuilder);
        //todo check if we can remove this for loop and set it in client side.
        var rides = [];
        for (var i = 0; i < reserveRidesFound.length; i++) {
            var res = reserveRidesFound[i];
            var passenger = new Reserve();
            res.person = personFound;

            passenger.objectId = res.objectId
            passenger.created = res.created
            passenger.___class = res.___class
            passenger.luggages = res.luggages
            passenger.ownerId = res.ownerId
            passenger.updated = res.updated
            passenger.seats = res.seats
            passenger.person = res.person

            res = res.ride;
            res.passengers = []
            res.passengers.push(passenger)
            rides.push(res);
        }
        return rides;
    }
    /**
     * @description get rides history
     * @route POST /GetMyRidesHistory
     * @param {User} user
     */
    async getMyRidesHistory(user) {

        const {
            getUser
        } = require('../lib/user');
        const {
            createError
        } = require('../lib/generalRoutines');

        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userFound;
        }

        var driverFound = await RideBusiness.getDriver(userFound.objectId);
        var reservedRides = await RideBusiness.getReservedRides(userFound.objectId, new Date());
        var drivenRides = await RideBusiness.getDrivenRides(driverFound.objectId, new Date());

        //-----
        var allRides = drivenRides;
        var i = drivenRides.length;
        for (var j = 0; j < reservedRides.length; j++) {
            allRides[i] = reservedRides[j].ride[0];
            i++;
        }
        return allRides;
    }
    
        /**
     * @description get location
     * @route POST /GetLocation
     * @param {Location} location
     */
    async getLocationCoord(location){
            const { createError } = require('../lib/generalRoutines')
      const {getUserId} = require('../lib/user');

      const [found, userId]  = await getUserId(this.request.context);
        
      if(!found){
        return userId; //in this case userId is an error actually.
      }
      
      var whereClause = "placeId='" + location.placeId + "'";
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
      var reserveRidesFound = await Backendless.Data.of("location").find(queryBuilder);
      if(reserveRidesFound.length > 0) {
        return reserveRidesFound[0];
      }
      
      return createError(-8005, "location_not_found");
    }
    /**
     * @private
     */
    static async getDriver(id) {
        var whereClause = "ownerId='" + id + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var driverFound = await Backendless.Data.of("driver").find(queryBuilder);
        return driverFound[0];
    } 
    /**
     * @private
     */
    static async getReserve(id) {
        var reserveClause = "ride='" + id + "'";
        var reserveQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(reserveClause);
        reserveQueryBuilder.setRelated(["person", "person.countryInformations"]);
        return await Backendless.Data.of("reserve").find(reserveQueryBuilder);
    }
    /**
     * @private
     */
    static async getDrivenRides(id, date) {
        var whereClauseRide = "driver='" + id + "' AND leavingDate <= '" + date + "'";
        var queryBuilderRide = Backendless.DataQueryBuilder.create().setWhereClause(whereClauseRide);
        queryBuilderRide.setRelated(["car", "from", "to", "driver", "driver.person", "driver.person.countryInformations"]);
        return await Backendless.Data.of("ride").find(queryBuilderRide);
    }
    /**
     * @private
     */
    static async getReservedRides(id, date) {
        var whereClause = "ownerId='" + id + "' AND ride.leavingDate <= '" + date + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["ride", "ride.car", "ride.from", "ride.to", "ride.driver", "ride.driver.person", "ride.driver.person.countryInformations"]);
        return await Backendless.Data.of("reserve").find(queryBuilder);
    }
    
}
Backendless.ServerCode.addService(RideBusiness);