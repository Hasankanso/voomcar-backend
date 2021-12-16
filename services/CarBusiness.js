/*Created on 06/10/2020 01:59:34.*/
'use strict'
class Car extends Backendless.ServerCode.PersistenceItem {}
class Location extends Backendless.ServerCode.PersistenceItem {}

class CarBusiness {
  
  
    /**
     * @private
     */
    static async getDriver(userId) {
        var whereClause = "ownerId='" + userId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var driverFound = await Backendless.Data.of("driver").find(queryBuilder);
        return driverFound[0];
    }


    /**
     * @description
     * @route POST /AddCar
     * @param {Car} car
     */

    async addCar(car) {
      
        const {getUser} = require('../lib/user');
        const {validateAddCar} = require('../lib/car');
        const {createError} = require('../lib/generalRoutines');
        
        var error = validateAddCar(car);
        if(error !=null){
          return error;
        }
        
        const [found, user] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return user;
        }
        
        var driverFound = await CarBusiness.getDriver(user.objectId);
        if (driverFound == null) {
            return createError(-3000,"Become_a_driver_first");
        }

        var Whereclause = "driver='" + driverFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(Whereclause);
        var carsCount = await Backendless.Data.of("car").getObjectCount(queryBuilder);
        
        if(carsCount >= 3){
          return createError(-3001, "Too_many_Cars");
        }
        
        var saveCar = await Car.save(car);
        await Backendless.Data.of("car").setRelation(saveCar, "driver", [driverFound.objectId]);

        return saveCar;
    }
    

    /**
     * @description
     * @route POST /UpdateCar
     * @param {Car} car
     */
    async UpdateCar(car) {
      
        const {getUser} = require('../lib/user');
        const {createError} = require('../lib/generalRoutines');
        
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        var driverFound = await CarBusiness.getDriver(userFound.objectId);
        if (driverFound == null) {
            return createError(-1000,"Please_login");
        }

        var Whereclause = "ownerId='" + userFound.objectId + "' AND objectId = '" + car.id + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(Whereclause);
        var carFound = await Backendless.Data.of("car").find(queryBuilder);
        
        if(carFound == null || carFound.length == 0){
          return createError(-3003, "Car_not_found");
        }
        
        carFound = carFound[0];
        var carFoundId = carFound.objectId;
        
        var error = CarBusiness.validateUpdateCar(car, carFound, createError);
        if(error !=null){
          return error;
        }

        
        if(car.picture !=null && carFound.picture != null && car.picture != carFound.picture){ 
        try{
          await Backendless.Files.remove(carFound.picture);
        } catch (e){}
        }
        
        var whereClause = "objectId='" + car.id + "'";
        await Backendless.Data.of("car").bulkUpdate(whereClause, {
            "year": car.year,
            "name": car.name,
            "color": car.color,
            "picture": car.picture
        });
        car.objectId = car.id;
        car.updated = new Date();

        return car;
    }
    
    /**
     * @private
     */
    static validateUpdateCar(car, carFound, createError){
        if(car.year == null || car.name == null || car.name.length == 0 || car.color == null){
          return createError(-1002, "Missing_arguments");
        }
        
        var now = new Date();
        var date = new Date(carFound.updated);
        if(date > now.setMonth( now.getMonth() - 2)){
          return createError(-3004, "wait_two_months");
        }
        
        return null;
    }



    /**
     * @description
     * @route POST /DeleteCar
     * @param {Car} car
     */
    async deleteCar(car) {
      
        const {getUser} = require('../lib/user');
        const {createError} = require('../lib/generalRoutines');
        
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        var driverFound = await CarBusiness.getDriver(userFound.objectId);
        if (driverFound == null) {
            return createError(-1000,"Please_login");
        }

        var Whereclause = "ownerId ='" + userFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(Whereclause);
        var carFound = await Backendless.Data.of("car").find(queryBuilder);
        
        
        if(carFound.length == 0){
          var query = "driver[region1].objectId = '" + driverFound.objectId + "' OR driver[region2].objectId = '" + driverFound.objectId + "' OR driver[region3].objectId = '" + driverFound.objectId + "'";
            await Backendless.Data.of("location").bulkDelete(query);
            await Backendless.Data.of("driver").remove(driverFound);
            return createError(-3004, "No_cars_remove_driver");
        }
        
        if(carFound.length > 3){
          return createError(-1001, "Something_Wrong");
        }
        
        var carIndex = -1;
        for(var i=0; i < carFound.length; i++){
          if(carFound[i].objectId == car.id){
            carIndex = i;
          }
        }
        
        if(carIndex == -1){
          return createError(-3003, "Car_not_found");
        }

        //check that no upcoming ride has this car.
        var Whereclause = "ownerId ='" + userFound.objectId + "' AND status != 'CANCELED' AND car ='" + carFound[carIndex].objectId + "' AND leavingDate > '" + Date.now() + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(Whereclause);
        var rideWithCar = await Backendless.Data.of("ride").find(queryBuilder);
        
        if(rideWithCar.length > 0){
          return createError(-3005, "Car_has_rides");
        }
        
        try{
          await Backendless.Files.remove(carFound[carIndex].picture);
        } catch (e) {
          
        }
        
        await Backendless.Data.of("car").remove(carFound[carIndex]);
        
        //if it's the last car, remove driver
        if (carFound.length <= 1) {
            var query = "driver[region1].objectId = '" + driverFound.objectId + "' OR driver[region2].objectId = '" + driverFound.objectId + "' OR driver[region3].objectId = '" + driverFound.objectId + "'";
            await Backendless.Data.of("location").bulkDelete(query);
            await Backendless.Data.of("driver").remove(driverFound);
        }
        return carFound[carIndex];
    }

}
Backendless.ServerCode.addService(CarBusiness);