/*Created on 06/26/2020 02:20:07.*/
'use strict'
class Reserve extends Backendless.ServerCode.PersistenceItem {}
class Ride extends Backendless.ServerCode.PersistenceItem {}

var radius = 20000; //20 km
var seats_reserved_action = "SEATS_RESERVED";

class ReserveBusiness {

        /*
     * @private
     */
    static validateSearch(info, createError) {
      var from = info.from;
      var to = info.to;
      var minDate = info.minDate;
      var maxDate = info.maxDate;
      
      if(from == null || to == null || minDate == null || maxDate == null || from.longitude == null || from.latitude == null || to.longitude == null || to.latitude == null || info.passengersNumber == null){
        return createError(-1002, "Arguments_Missing");
      }
      
      if(from.placeId != null && to.placeId != null){
        if(from.placeId == to.placeId){
          return createError(-7006, "Same_from_to");
        }
      } else if  (from.longitude == to.longitude && from.latitude == to.latitude) {
        return createError(-7006, "Same_from_to");
      }
      
      if(maxDate <= minDate){
        return createError(-1003, "Inconsitent_arguments");
      } 
      
      var now = new Date();
      if(now.setMinutes(now.getMinutes() + 25) > minDate){
        return createError(-7007, "Searching_in_past");
      }
      
      if(info.passengersNumber < 1 || info.passengersNumber > 8){
        return createError(-7008, "Too_few_many_passengers");
      }
      
      return null;
    }

    
    /**
     * @description edit person info
     * @route POST /SearchRides 
     * @param {SearchInfo} searchInfo
     */
    async searchRides(searchInfo) {
        const { createError } = require('../lib/generalRoutines')
        const {getUserId} = require('../lib/user');

        const [found, userId]  = await getUserId(this.request.context);
        
        if(!found){
          return userId;
        }
        
        var error = ReserveBusiness.validateSearch(searchInfo, createError);
        if(error != null){
          return error;
        }

        var point1 = "'POINT(" + searchInfo.from.longitude + " " + searchInfo.from.latitude + ")'";
        var point2 = "'POINT(" + searchInfo.to.longitude + " " + searchInfo.to.latitude + ")'";

        var whereClause = "leavingDate >= '" + searchInfo.minDate + "' AND leavingDate <= '" + searchInfo.maxDate + "' AND status != 'CANCELED' AND availableSeats >=" + searchInfo.passengersNumber + " AND " +
            "distanceOnSphere(from.position, " + point1 + ") <= " + radius + " AND distanceOnSphere(to.position, " + point2 + ") <= " + radius;
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);

        queryBuilder.setRelated(["car", "driver", "from", "to", "countryInformations", "driver.person.countryInformations", "driver.person", "driver.person.statistics"]);
        var ridesFound = await Ride.find(queryBuilder);
        return ridesFound;
    }

    
    /**
     * @description get reservations
     * @route POST /GetReservation 
     * @param {Reserve} reservation
     */
    async getReservation(reservation) {
      
      const { createError } = require('../lib/generalRoutines')
      const {getUserId} = require('../lib/user');

      const [found, userId]  = await getUserId(this.request.context);
        
      if(!found){
        return userId;
      }
         
      var whereClause = "ride='" + reservation.ride + "' AND objectId='" + reservation.objectId + "'";
       
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
      
        queryBuilder.setRelated(["person", "person.statistics"]);
        var reservationFound = await Backendless.Data.of("reserve").find(queryBuilder);

        if(reservationFound.length !== 1){
          return createError(-7009, "No_existing_reservation");
        }
        reservationFound[0].rideId = reservation.ride;
        return reservationFound[0];
        
    }
    
    /**
     * @private
     */
    static async getPersonWithStat(userId) {
        var whereClause = "ownerId = '" + userId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["statistics"]);
        var person = await Backendless.Data.of("person").find(queryBuilder);

        if (person.length > 1) {
            return null;
        }

        return person[0];
    }

    /**
     * @description edit person info
     * @route POST /ReserveSeat 
     * @param {Reserve} reserve
     */
    async reserveSeat(args) {
      
        const {getUser} = require('../lib/user');
        const {createError, sendNotification} = require('../lib/generalRoutines');
         
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        //validation it's not his own ride...


        var person = await ReserveBusiness.getPersonWithStat(userFound.objectId);


        if (person == null) {
          return createError(-1001, "Something_Wrong");
        }

        var statistics = person.statistics;


        var whereClause = "objectId = '" + args.ride.id + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["driver.person", "car", "from", "to", "driver.person.statistics", "driver.person.countryInformations", "driver"]);
        var ride = await Backendless.Data.of("ride").find(queryBuilder);
        ride = ride[0];


        var error = ReserveBusiness.validateReserveSeats(args, ride, createError);
        if(error != null){
          return error;
        }

        //check if the targeted ride is already reserved by this user.
        var whereClause = "person='" + person.objectId + "' AND ride='" + ride.objectId + "' AND status != 'CANCELED'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var alreadyReserved = await Backendless.Data.of("reserve").find(queryBuilder);

        //there's more than one active reservation for this ride and this person, this is weird.
        if (alreadyReserved.length > 1) {
            return createError(-1001, "Something_Wrong");
        }

        //check if the ride is already reserved by this user.
        if (alreadyReserved[0] != null) {
            return createError(-7001, "Already_Reserved");
        }

        // it's only reserved, why are we changing the statistics?logic behing: when reserve it'll be counted as accomplished, and if canceled then its will decrease accom by one and add 1 to canceled,
        statistics.acomplishedRides = statistics.acomplishedRides + 1
        var personFoundWhereClause = "objectId='" + statistics.objectId + "'";
        await Backendless.Data.of("userStatistics").bulkUpdate(personFoundWhereClause, {
            "acomplishedRides": statistics.acomplishedRides
        });


        //build the reservation object
        var reservation = {};
        reservation.person = person;
        reservation.ride = ride;
        reservation.seats = args.seats;
        reservation.luggages = args.luggages;

        //perform reservation
        reservation = await Reserve.save(reservation);
        await Promise.all([
            Backendless.Data.of("reserve").setRelation(reservation, "person", [person.objectId]),
            Backendless.Data.of("reserve").setRelation(reservation, "ride", [ride.objectId])
        ]);

        //update luggage and seats in ride table
        var whereClause = "objectId='" + ride.objectId + "'";
        await Backendless.Data.of("ride").bulkUpdate(whereClause, {
            "availableSeats": parseInt(ride.availableSeats - reservation.seats),
            "availableLuggages": parseInt(ride.availableLuggages - reservation.luggages)
        });
 
        //update returned ride information manually
        ride.availableSeats -= reservation.seats
        ride.availableLuggages -= reservation.luggages
        
        //re-assign the person  that have object id.
        reservation.person = person;
        //we put null to avoid big payload notification
        reservation.ride = null;
        reservation.rideId = ride.objectId;

        await sendNotification(ride.driver.person.token, args.seats + " seats has been reserved",
            person.firstName + " " + person.lastName + " reserved " + args.seats + " seats in your ride on " + (new Date(ride.leavingDate)).toLocaleString(),
            reservation, "SEATS_RESERVED");
        
        //reassign and the ride
        reservation.ride = ride;
        return reservation;
    }

    /*
     * @private
     */
    static validateReserveSeats(reserveInfo, ride, createError){
              //check if ride is canceled
        if (ride == null || ride.status == "CANCELED")
            return createError(-7000, "Ride_Unavailable");

        //check if ride full
        if (ride.availableSeats <= 0)
            return createError(-7002, "Ride_full");

        //check if ride availables seats are enough for reservation
        if (reserveInfo.seats > ride.availableSeats)
            return createError(-7003, "No_enough_seats");

        //luggage
        if (reserveInfo.luggages > ride.availableLuggages)
            return createError(-7004, "No_enough_luggage_space");
            
        //ride is in the past
        if(ride.leavingDate < Date()){
          return createError(-7005, "Ride_in_past");
        }
        
        return null
    }

/**
     * @description  edit reservation
     * @route POST /EditReservation 
     * @param {Reserve} newReservation
     * @param {String} fullName
     */
    async editReservation(newReservation, fullName) { // at least 7 requests
        const { getUser } = require('../lib/user')
 
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        const {createError, sendNotification} = require('../lib/generalRoutines');
        
        
        if(!found){
            return createError(-1000, "Please_login");
        }
        
        var whereClause = "ownerId='" + userFound.objectId + "' AND ride='" + newReservation.ride.id + "' AND status != 'CANCELED'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["ride", "ride.driver.person"]);
        var currentReservation = await Backendless.Data.of("reserve").find(queryBuilder);
        
        if(currentReservation.length == 0){
          return createError(-7009, "No_existing_reservation");
        }
        
        currentReservation = currentReservation[0];

        var error = ReserveBusiness.validateEditReservation(newReservation, currentReservation, createError);
        if(error != null){
          return error;
        }
        
        var driverPerson = currentReservation.ride.driver.person;

        var oldReserveSeats = parseInt(currentReservation.seats)

        var oldReserveLuggage = parseInt(currentReservation.luggages)

        var oldRideLuggage = parseInt(currentReservation.ride.availableLuggages)
        var oldRideSeats = parseInt(currentReservation.ride.availableSeats)

        var whereClause = "objectId='" + currentReservation.objectId + "'";
        await Backendless.Data.of("reserve").bulkUpdate(whereClause, {
            "seats": parseInt(newReservation.seats),
            "luggages": parseInt(newReservation.luggage)
        });
        currentReservation.seats = parseInt(newReservation.seats);
        //2
        currentReservation.luggages = parseInt(newReservation.luggage);

        var avSeats = parseInt(oldRideSeats - (newReservation.seats - oldReserveSeats));

        
        var avLuggages = parseInt(oldRideLuggage - (newReservation.luggage - oldReserveLuggage));
        var whereClause = "objectId='" + newReservation.ride.id + "'";
        await Backendless.Data.of("ride").bulkUpdate(whereClause, {
            "availableSeats": avSeats,
            "availableLuggages": avLuggages
        });
        
        
        var person = await ReserveBusiness.getPersonWithStat(userFound.objectId);
        currentReservation.rideId = currentReservation.ride.objectId;
        currentReservation.person=person;
        var ride=currentReservation.ride;
        currentReservation.ride=null;
        currentReservation.seats=newReservation.seats;
        currentReservation.luggages=newReservation.luggage;
        
        var title = "Reservation has been edited";
        var body = fullName + " reserved " + (parseInt(newReservation.seats) - parseInt(oldReserveSeats)) + " more seats, and " + (parseInt(newReservation.luggage) - parseInt(oldReserveLuggage)) + " more luggage in your ride on " + (new Date(ride.leavingDate)).toLocaleString();
        await sendNotification(driverPerson.token, title, body, currentReservation, "EDIT_RESERVATION");
        
        currentReservation.ride = {
            "objectId":ride.objectId,
            "availableSeats": avSeats,
            "availableLuggages": avLuggages
        }
        return currentReservation;
    }
    
    
    /*
     * @private
     */
  static validateEditReservation(newReservation, currentReservation, createError){
     var ride = currentReservation.ride;
     
     var newSeats = parseInt(newReservation.seats);
     var newLuggage = parseInt(newReservation.luggages);
     
     var currSeats = parseInt(currentReservation.seats);
     var currLuggage = parseInt(currentReservation.luggages);
     
     var availableSeats = parseInt(ride.availableSeats);
     var availableLuggage = parseInt(ride.availableLuggages);
     
     if(newSeats == currSeats && newLuggage == currLuggage) {
       return createError(-7010, "no_changes_to_edit");
     }
     
    if(newSeats < 0) {
       return createError(-1003, "Inconsitent_arguments");
    }
     
     var addedSeats = newSeats - currSeats;
     if(addedSeats < 0 || addedSeats > availableSeats){
       return createError(-7003, "No_enough_seats");
     }
     
    if(newLuggage < 0) {
       return createError(-1003, "Inconsitent_arguments");
     }
     
     var addedLuggage = newLuggage - currLuggage;
     
     if( addedLuggage > availableLuggage){
       return create(-7004, "No_enough_luggage_space");
     }
     
     return null;
  }
  
    /**
     * @description cancel reservation
     * @route POST /CancelReserved 
     * @param {Reserve} reserve
     */
    async cancelReserved(reserve) {

        const { getUser } = require('../lib/user')
        const {createError, sendNotification} = require('../lib/generalRoutines');
         
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        var whereClause = "ownerId='" + userFound.objectId + "' AND ride='" + reserve.ride.id + "' AND status != 'CANCELED'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["ride", "ride.driver.person"]);
        var reserveFound = await Backendless.Data.of("reserve").find(queryBuilder);

        //if ride is deleted return
        if (reserveFound.length == 0)
            createError(-7009, "No_existing_reservation");


        //update ride in db
        reserveFound = reserveFound[0];

        var ride = reserveFound.ride;

        ride.availableSeats = ride.availableSeats + reserveFound.seats;
        ride.availableLuggages = ride.availableLuggages + reserveFound.luggages;



        var statisticsFound = await Backendless.Data.of("userStatistics").find("ownerId='" + userFound.objectId + "'");
        statisticsFound = statisticsFound[0]


        var d1 = new Date(reserveFound.ride.leavingDate);
        var d2 = new Date();
        var diffTime = d1 - d2;

        var objects = [ride.objectId, reserveFound.objectId];
        if ((diffTime / 3600000) <= 48) { // 3600000 = 1000 * 60 * 60
            objects.push(reserve.reason);
        }

        reserveFound.status = "CANCELED";


        await Backendless.Data.of("ride").save(ride);
        await Reserve.save(reserveFound);


        var userWhereClause = "ownerId='" +  userFound.objectId + "'";
        await Backendless.Data.of("userStatistics").bulkUpdate(userWhereClause, {
            "acomplishedRides": statisticsFound.acomplishedRides - 1,
            "canceledRides": statisticsFound.canceledRides + 1
        });

        var title = "Reservation has been canceled";
        var body = reserve.fullName + " canceled his reservation";
        await sendNotification(ride.driver.person.token, title, body, objects, "RESERVATION_CANCELED");

        return {
            "deleted": true
        };
    }
}
Backendless.ServerCode.addService(ReserveBusiness);
