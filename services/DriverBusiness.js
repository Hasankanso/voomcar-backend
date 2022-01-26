/*Created on 06/26/2020 02:19:11.*/ /*Created on 06/10/2020 01:59:34.*/
'use strict'
class Driver extends Backendless.ServerCode.PersistenceItem {}
class Car extends Backendless.ServerCode.PersistenceItem {}
class location extends Backendless.ServerCode.PersistenceItem {}

class DriverBusiness {
 
    /**
     * @description become a drive
     * @route POST /BecomeDriver
     * @param {Driver} driver
     */
    async becomeDriver(driver) {
      
        const {getUser} = require('../lib/user');
        const {validateRegions,validateBecomeaDriver} = require('../lib/driver');
        
        
        var error = validateBecomeaDriver(driver);
        if(error != null){
          return error;
        }

        
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        var point = 'POINT(' + driver.regions[0].longitude + ' ' + driver.regions[0].latitude + ')';
        driver.regions[0].position = point;
        delete driver.regions[0].longitude;
        delete driver.regions[0].latitude;
        
        var whereClause = "placeId='" + driver.regions[0].placeId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var locationFound = await Backendless.Data.of("location").find(queryBuilder);
        locationFound=locationFound[0];
        var region1;
        if(locationFound!=null){
          region1=locationFound;
        }else{
          region1 = await location.save(driver.regions[0]);
        }

        var region2;
        var region3;
        if (driver.regions[1] != null) {
            var point1 = 'POINT(' + driver.regions[1].longitude + ' ' + driver.regions[1].latitude + ')';
            driver.regions[1].position = point1;
            delete driver.regions[1].longitude;
            delete driver.regions[1].latitude;
            
            var whereClause = "placeId='" + driver.regions[1].placeId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var locationFound = await Backendless.Data.of("location").find(queryBuilder);
            locationFound=locationFound[0];
            if(locationFound!=null){
              region2=locationFound
            }else{
            region2 = await location.save(driver.regions[1]);
        }}
        if (driver.regions[2] != null) {
            var point2 = 'POINT(' + driver.regions[2].longitude + ' ' + driver.regions[2].latitude + ')';
            driver.regions[2].position = point2;
            delete driver.regions[2].longitude;
            delete driver.regions[2].latitude;
            var whereClause = "placeId='" + driver.regions[2].placeId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var locationFound = await Backendless.Data.of("location").find(queryBuilder);
            locationFound=locationFound[0];
            if(locationFound!=null){
              region3=locationFound
            }else{
            region3 = await location.save(driver.regions[2]);
              
            }

        }
      
        //save driver
        var savedDriver = await Backendless.Data.of("driver").save(driver);

        //save car
        var savedCar = await Car.save(driver.cars[0]);


        var driverData = Backendless.Data.of("driver");

        var whereClause = "ownerId='" + userFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var personFound = await Backendless.Data.of("person").find(queryBuilder);
        personFound = personFound[0];

        var relations = [
            driverData.setRelation(savedDriver, "person", [personFound]),
            Backendless.Data.of("car").setRelation(savedCar, "driver", [savedDriver]),
            driverData.setRelation(savedDriver, "region1", [region1.objectId])
        ];

        savedDriver.region1 = region1;

        if (driver.regions.length >= 2) {
            relations.push(driverData.setRelation(savedDriver, "region2", [region2.objectId]));
            savedDriver.region2 = region2;

            if (driver.regions.length == 3) {
                relations.push(driverData.setRelation(savedDriver, "region3", [region3.objectId]));
                savedDriver.region3 = region3;
            }
        }

        await Promise.all(relations);

        var cars = [];
        cars.push(savedCar);
        savedDriver.cars = cars;

        return savedDriver;
    }
    
    
    /**
     * @description edit regions
     * @route POST /EditRegions
     * @param {Driver} driver
     */
    async editRegions(driver) {
       
             

        const {createError} = require('../lib/generalRoutines');
        const {validateRegions} = require('../lib/driver');
        var error = validateRegions(driver.regions, createError);
        if(error != null){
         return error;
        }

        const {getUser} = require('../lib/user');
        const [found, loggedInUser] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return loggedInUser;
        }
        
        // Getting driver 
        var whereClause = "ownerId='" + loggedInUser.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["region1", "region2", "region3"]);
        var driverFound = await Backendless.Data.of("driver").find(queryBuilder);
        driverFound = driverFound[0];

        if (driverFound == null) {
            return createError(-4001, "Driver_not_found");
        }

        var oldRegion1 = driverFound.region1;
        var oldRegion2 = driverFound.region2;
        var oldRegion3 = driverFound.region3;
        var newRegion1;
        var newRegion2;
        var newRegion3;

        //hasin: this could be done using a for loop?
        
        //deleting regions from location table that are not related to the driver
        if (driver.regions.length == 1) {
            if (oldRegion2 != null) {
                await Backendless.Data.of("location").remove(oldRegion2);
                driverFound.region2 = null;
            }
            if (oldRegion3 != null) {
                await Backendless.Data.of("location").remove(oldRegion3)
                driverFound.region3 = null;
            }
        }
        if (driver.regions.length == 2 && oldRegion3 != null) {
            await Backendless.Data.of("location").remove(oldRegion3)
            driverFound.region3 = null;

        }

        var list = await DriverBusiness.editUpdateRegions(driver, oldRegion1, newRegion1, oldRegion2, newRegion2, oldRegion3, newRegion3);
        newRegion1 = list[0];
        newRegion2 = list[1];
        newRegion3 = list[2];
        return DriverBusiness.setRelations(driver, driverFound, newRegion1, newRegion2, newRegion3);
    }

    /**
     * @private
     */
    static async editUpdateRegions(driver, oldRegion1, newRegion1, oldRegion2, newRegion2, oldRegion3, newRegion3) {
        if (driver.regions[0] != null) {
            var point = 'POINT(' + driver.regions[0].longitude + ' ' + driver.regions[0].latitude + ')';
            delete driver.regions[0].longitude;
            delete driver.regions[0].latitude;
            //get location by place id
            var whereClause = "placeId='" + driver.regions[0].placeId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var locationFound = await Backendless.Data.of("location").find(queryBuilder);
            locationFound=locationFound[0];
            if(locationFound!=null){
              newRegion1=locationFound;
            }else{
              driver.regions[0].position = point;
              newRegion1 = await location.save(driver.regions[0]);
            }
        }
        if (driver.regions[1] != null) {
            var point1 = 'POINT(' + driver.regions[1].longitude + ' ' + driver.regions[1].latitude + ')';
            delete driver.regions[1].longitude;
            delete driver.regions[1].latitude;
            
            //get location by place id
            var whereClause = "placeId='" + driver.regions[1].placeId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var locationFound = await Backendless.Data.of("location").find(queryBuilder);
            locationFound=locationFound[0];
            if (locationFound != null) {
                newRegion2 = locationFound;
            } else {
                driver.regions[1].position = point1;
                newRegion2 = await location.save(driver.regions[1]);
            }

        }
        if (driver.regions[2] != null) {
            var point2 = 'POINT(' + driver.regions[2].longitude + ' ' + driver.regions[2].latitude + ')';
            delete driver.regions[2].longitude;
            delete driver.regions[2].latitude;
            
            //get location by place id
            var whereClause = "placeId='" + driver.regions[2].placeId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var locationFound = await Backendless.Data.of("location").find(queryBuilder);
            locationFound=locationFound[0];
            if(locationFound!=null){
              newRegion3=locationFound;
            }else{
              driver.regions[2].position = point2;
              newRegion3 = await location.save(driver.regions[2]);
            }
        }
        return [newRegion1, newRegion2, newRegion3];
    }
    /**
     * @private
     */
    static async setRelations(driver, driverFound, newRegion1, newRegion2, newRegion3) {
        var driverData = Backendless.Data.of("driver");
        var relations = [];

        relations = [driverData.setRelation(driverFound, "region1", [newRegion1.objectId])];
        driverFound.region1 = newRegion1;


        if (driver.regions.length >= 2) {
            relations.push(driverData.setRelation(driverFound, "region2", [newRegion2.objectId]));
            driverFound.region2 = newRegion2;

            if (driver.regions.length == 3) {
                relations.push(driverData.setRelation(driverFound, "region3", [newRegion3.objectId]));
                driverFound.region3 = newRegion3;

            }
        }
        await Promise.all(relations);
        return driverFound;
    }

}

Backendless.ServerCode.addService(DriverBusiness);