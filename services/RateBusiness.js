/*Created on 06/10/2020 01:59:34.*/
'use strict'
class Rate extends Backendless.ServerCode.PersistenceItem {}

class RateBusiness {

    /*
     * @private
     */
    static validateRateDriver(data, createError) {

        if (data == null || data.rate == null || data.rate.ride == null) {
            return createError(-1002, "Argument_missing");
        }

        var rate = data.rate;
        var ride = rate.ride;

        //in this part we validate rate
        if (rate.grade == null || rate.grade > 5 || rate.grade < 0) {
            return createError(-6005, "Grade_not_found");
        }

        if (rate.grade < 3) {
            if (rate.comment == null || rate.comment.length < 20) {
                return createError(-6006, "Comment_too_short");
            }
            if (rate.reason == null || rate.reason < 0 || rate.reason > 6) {
                return createError(-6007, "Reason_not_found");
            }
        }
        return null;
    }

    /**
     * @description rate driver
     * @route POST /RateDriver
     * @param {Object} rate
     */
    async RateDriver(data) {

        const {
            getUserId
        } = require('../lib/user');
        const {
            createError,
            sendSilentScheduleNotification
        } = require('../lib/generalRoutines');

        const [found, userId] = await getUserId(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userId;
        }

        var error = RateBusiness.validateRateDriver(data, createError);
        if (error != null) {
            return error;
        }

        var rate = data.rate;
        var ride = rate.ride;

        //check if the ride exists.
        var rideClause = "status != 'CANCELED'";
        var rideQuery = Backendless.DataQueryBuilder.create().setWhereClause(rideClause);
        rideQuery.setRelated(["driver.person", "driver.person.statistics"]);
        var rideFound = await Backendless.Data.of("ride").findById(ride, rideQuery);

        if (rideFound == null) {
            return createError(-6001, "Ride_not_found");
        }

        //make sure the ride is indeed in the past
        var now = new Date();
        var before6Hours = now.setHours(now.getHours() - 6);

        if (ride.leavingDate > before6Hours) {
            return createError(-6002, "Rate_too_early");
        }

        //get reservation using ride id and ownerId
        var reserveClause = "ownerId = '" + userId + "' AND ride ='" + rideFound.objectId + "' AND status != 'CANCELED'";
        var reserveQuery = Backendless.DataQueryBuilder.create().setWhereClause(reserveClause);
        var reservationsFound = await Backendless.Data.of("reserve").find(reserveQuery);

        if (reservationsFound.length != 1) {
            return createError(-6004, "Reservation_not_found");
        }

        //add rate
        var savedRate = await Rate.save(rate);

        //create realations.
        var rateTable = Backendless.Data.of("rate");
        var relationPromisis = [];
        relationPromisis.push(rateTable.setRelation(savedRate, "ride", [rate.ride]));
        relationPromisis.push(rateTable.setRelation(savedRate, "target", [rate.target]));

        //add relations.
        var ratePromisis = await Promise.all(relationPromisis);

        //update driver statistics
        await RateBusiness.updateStatistics(rideFound.driver.person.statistics, rate);


        //send notifications.
        var title = "Rating";
        var body = data.fullName + " rated you!";
        await sendSilentScheduleNotification(rideFound.driver.person.token, title, body, null, "RATE");

        return {
            "sent": true
        };
    }

    /*
     * @private
     */
    static validateRatePassengers(data, createError) {

        if (data == null || data.rates == null || data.rates[0] == null || data.rates[0].ride == null) {
            return createError(-1002, "Argument_missing");
        }

        var rates = data.rates;
        var ride = rates[0].ride;

        for (var i = 0; i < rates.length; i++) {
            if (rates[i].ride != ride) { // check that all rates are for the same ride.
                return createError(-1003, "Inconsitent_arguments");
            }
        }


        //in this part we validate rates
        for (var i = 0; i < rates.length; i++) {
            var rate = rates[i];

            if (rate.grade == null || rate.grade > 5 || rate.grade < 0) {
                return createError(-6005, "Grade_not_found");
            }

            if (rate.grade < 3) {
                if (rate.comment == null || rate.comment.length < 20) {
                    return createError(-6006, "Comment_too_short");
                }
                if (rate.reason == null || rate.reason < 0 || rate.reason > 6) {
                    return createError(-6007, "Reason_not_found");
                }
            }
        }
        return null;
    }

    /**
     * @description rate passengers
     * @route POST /RatePassengers
     * @param {Object} rate
     */
    async RatePassengers(data) {

        const {
            getUserId
        } = require('../lib/user');
        const {
            createError,
            sendSilentScheduleNotificationToMultipleUser
        } = require('../lib/generalRoutines');

        const [found, userId] = await getUserId(this.request.context); //if found equal false, means something is wrong

        if (!found) {
            return userId;
        }

        var error = RateBusiness.validateRatePassengers(data, createError);
        if (error != null) {
            return error;
        }

        var rates = data.rates;
        var ride = rates[0].ride;

        //prove that this user is the owner of the provided ride.
        var rideClause = "ownerId='" + userId + "' AND status != 'CANCELED'";
        var rideQuery = Backendless.DataQueryBuilder.create().setWhereClause(rideClause);
        var rideFound = await Backendless.Data.of("ride").findById(ride, rideQuery);

        if (rideFound == null) {
            return createError(-6001, "Ride_not_found");
        }

        //make sure the ride is indeed in the past
        const now = new Date();
        var before6Hours = now.setHours(now.getHours() - 6);

        if (ride.leavingDate > before6Hours) {
            return createError(-6002, "Rate_too_early");
        }

        var ids = "('";
        for (var i = 0; i < rates.length; i++) {

            if (i == rates.length - 1) {
                ids += rates[i].target + "')";
                break;
            }

            ids += rates[i].target + "',";
        }

        //get all reservations to compare them with provided reserveClause
        var reserveClause = "ride='" + rideFound.objectId + "' AND person in " + ids;
        var reserveQuery = Backendless.DataQueryBuilder.create().setWhereClause(reserveClause);
        reserveQuery.setRelated(["person", "person.statistics"]);
        var allReservationsFound = await Backendless.Data.of("reserve").find(reserveQuery);

        var reservationsFound = [];
        for (var i = 0; i < allReservationsFound.length; i++) {
            var passenger = allReservationsFound[i];
            var isCanceledThenReserve = false;

            if (passenger.status === "CANCELED") {
                for (var j = 0; j < allReservationsFound.length; j++) {
                    var pass = allReservationsFound[j];
                    if (pass.person.objectId === passenger.person.objectId &&
                        pass.status !== "CANCELED") {
                        isCanceledThenReserve = true;
                    }
                }
            }
            if (!isCanceledThenReserve) {
                var alreadyAdded = false;
                for (var k =0;k<reservationsFound.length;k++) {
                  var reservation=reservationsFound[k];
                  if (reservation.person.objectId == passenger.person.objectId) {
                    alreadyAdded = true;
                  }
                }
                if (!alreadyAdded) {
                    reservationsFound.push(passenger);
                }
            }
        }

        if (reservationsFound.length != rates.length) {
            return createError(-6003, "Rate_is_missing");
        }

        //add rates
        var savedRates = await Rate.bulkCreate(rates);

        //create realations.
        var rateTable = Backendless.Data.of("rate");
        var relationPromisis = [];
        for (var i = 0; i < savedRates.length; i++) {
            var savedRate = savedRates[i];
            relationPromisis.push(rateTable.setRelation(savedRate, "ride", [rates[i].ride]));
            relationPromisis.push(rateTable.setRelation(savedRate, "target", [rates[i].target]));
        }

        //add relations.
        var ratePromisis = await Promise.all(relationPromisis);

        //update passengers statistics
        var updateStatisticsPromisis = []
        for (var i = 0; i < reservationsFound.length; i++) {
            for (var j = 0; j < rates.length; j++) {
                if (reservationsFound[i].person.objectId === rates[j].target) {
                    updateStatisticsPromisis.push(RateBusiness.updateStatistics(reservationsFound[i].person.statistics, rates[j]));
                    break;

                }
            }
        }

        await Promise.all(updateStatisticsPromisis);

        //send notifications.
        var tokens = [];
        for (var i = 0; i < savedRates.length; i++) {
            tokens.push(reservationsFound[i].person.token);
        }

        var title = "Rating";
        var body = data.fullName + " rated you!";
        await sendSilentScheduleNotificationToMultipleUser(tokens, title, body, null, "RATE");

        return {
            "sent": true
        };
    }

    /**
     * @private
     */
    static async updateStatistics(statistics, savedRate) {
        var whereClause = "objectId='" + statistics.objectId + "'";
        var userStatisticsData = Backendless.Data.of("userStatistics");
        var rateInt = ~~savedRate.grade;

        statistics.rateAverage = ((statistics.rateAverage * statistics.ratesCount) + savedRate.grade) / (statistics.ratesCount + 1);

        if (rateInt == 1) {
            statistics = await userStatisticsData.bulkUpdate(whereClause, {
                "rateAverage": parseFloat(statistics.rateAverage),
                ones: parseInt(statistics.ones + 1),
            });
        } else if (rateInt == 2) {
            statistics = await userStatisticsData.bulkUpdate(whereClause, {
                "rateAverage": parseFloat(statistics.rateAverage),
                twos: parseInt(statistics.twos + 1),
            });
        } else if (rateInt == 3) {
            statistics = await userStatisticsData.bulkUpdate(whereClause, {
                "rateAverage": parseFloat(statistics.rateAverage),
                threes: parseInt(statistics.threes + 1),
            });
        } else if (rateInt == 4) {
            statistics = await userStatisticsData.bulkUpdate(whereClause, {
                "rateAverage": parseFloat(statistics.rateAverage),
                fours: parseInt(statistics.fours + 1),
            });
        } else if (rateInt == 5) {
            statistics = await userStatisticsData.bulkUpdate(whereClause, {
                "rateAverage": parseFloat(statistics.rateAverage),
                fives: parseInt(statistics.fives + 1),
            });
        }

        return statistics;
    }

    /**
     * @description get user reviews
     * @route POST /GetUserReviews
     * @param {Person} personClient
     */
    async getUserReviews(data) {
        var person;
        if (data == null || data.person == null) {
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
            var personFound = await Backendless.Data.of("person").find(userQueryBuilder);
            personFound = personFound[0];
            person = personFound.objectId;
        } else {
            person = data.person;
        }

        var whereClause = "target='" + person + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var rates = await Backendless.Data.of("rate").find(queryBuilder);
        for (var i = 0; i < rates.length; i++) {
            var whereClause = "ownerId='" + rates[i].ownerId + "'";
            var userQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var personFound = await Backendless.Data.of("person").find(userQueryBuilder);
            rates[i].rater = personFound[0];
        }
        return rates;
    }
}
Backendless.ServerCode.addService(RateBusiness);