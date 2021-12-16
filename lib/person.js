/*Created on 08/17/2021 00:37:36.*/



exports.validatePerson = function validatePerson(person){
      const {createError} = require('./generalRoutines');

      if(person == null || person.gender == null || person.firstName == null || person.lastName == null 
      || person.birthday == null || person.countryInformations == null ||  person.countryInformations.drivingAge == null || person.countryInformations.id == null){
        return createError(-1002, "Argument_missing");
      }
      
      if(person.gender  !==  true && person.gender !== false){
        return createError(-5006, "Gender_not_specifier");
      }
      
      var validName = new RegExp("^[\u0621-\u064Aa-zA-Z\‎\ \‏]*$");
      
      
      var now = new Date();
      if(person.birthday.year < now.year - 150){
          return createError(-5002, "Invalid_birthday");
      }
      
      if( (now - person.birthday).year < person.countryInformations.drivingAge){
        return createError(-5003, "Too_young")
      }
      
      if(!validName.test(person.firstName) || !validName.test(person.lastName) || person.firstName.length == 0 || person.firstName.length > 15 || person.lastName.length == 0  || person.lastName.length > 15){
        return createError(-5000, "Name_invalid");
      }
      
      if(person.chattiness < 0 || person.chattiness >= 3 ){
        return createError(-5001, "Chattiness_invalid");
      }
      
      if(person.bio !=null && (person.bio.length >190)){
        return createErro(-5004, "Bio_too_long");
      }
      
      return null;
    }
    
    