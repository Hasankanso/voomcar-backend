/*Created on 08/17/2021 00:47:16.*/




exports.validateRegions = function  validateRegions(regions, createError){
      
      if(regions == null){
        return createError(-1002, "Missing_arguments");
      }
      if(regions.length < 1 || regions.length > 3){
        return createError(-4000, "Too_few_many_regions");
      }
      
      for(var i =0 ; i < regions.length; i++){
      var region = regions[i];
      
      if(region == null || region.longitude == null || region.latitude == null){
        return createError(-1002, "Missing_arguments");
      }
      
      }
      return null;
    }
    
exports.validateBecomeaDriver   = function validateBecomeaDriver(driver) {
      const {createError} = require('./generalRoutines');
      const {validateAddCar} = require('./car');

      var error = exports.validateRegions(driver.regions, createError);
      if(error != null){
        return error;
      }

      if(driver.cars.length != 1){
        return createError(-4002, "too_many_or_no_cars");
      }
      
      return validateAddCar(driver.cars[0]);
}


