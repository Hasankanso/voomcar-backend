/*Created on 08/17/2021 00:47:41.*/





exports.validateAddCar = function validateAddCar(car){
        const {createError} = require('./generalRoutines');
        
        if(car == null || car.name == null || car.name.length == 0 || car.color == null){
          return createError(-1002, "Missing_arguments");
        } 
        
        if(car.brand == null || car.brand.length <= 2){
          return createError(-1002, "Missing_argument");
        }
        
        var now = new Date();
        if(car.year < now.year - 120){
          return createError(-3002, "Car_too_old");
        }
        
        
        if(car.type == 0 && (car.maxSeats != 4 || car.maxLuggage != 3)
         ||car.type == 1 && (car.maxSeats != 6 || car.maxLuggage != 4)
         ||car.type == 2 && (car.maxSeats != 4 || car.maxLuggage != 3)
         ||car.type == 3 && (car.maxSeats != 13 || car.maxLuggage != 7)){
           return createError(-1003, "Inconsitent_arguments");
          
        }
        
        return null;
    }