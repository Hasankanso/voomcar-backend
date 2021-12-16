/*Created on 06/11/2020 08:06:47.*/
'use strict'
class Person extends Backendless.ServerCode.PersistenceItem {}

class PersonBusiness {

    /**
     * @private
     */
    static validate(person) {
        return true
    }

    /**
     * @description edit person info
     * @route POST /GetPerson 
     *  @param {Person} person
     */
    async getPerson(person) {
        var personFound = await Backendless.Data.of("Person").findById(person.id);
        return personFound;
    }

/*
     * @private
     */
    static error(code, message) {
        return {
            "code": code,
            "message": message
        };
    }
    /**
     * @description edit person info
     * @route POST /EditPerson 
     *  @param {Person} person
     */
    async editPerson(person) {
      
        const {validatePerson} = require('../lib/person');
        
        var error = validatePerson(person);
        
        if(error !=null){
          return error;
        }
        
        const {getUserId} = require('../lib/user');
        const {createError} = require('../lib/generalRoutines');
        
        const [found, userId] = await getUserId(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        var whereClause = "ownerId='" + userId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var personFound = await Backendless.Data.of("person").find(queryBuilder);
        personFound = personFound[0];

        //check if there is an image
        if (person.image != null) {
            //get old person to check if he has an image 
            if (personFound.image != null && person.image !== personFound.image) {
              try{
                await Backendless.Files.remove(personFound.image);
              } catch(e){}
            }
            personFound.image = person.image
        } else {
            person.image = personFound.image;
        }

        //update person
        var whereClause = "ownerId='" + userId + "'";
        await Backendless.Data.of("person").bulkUpdate(whereClause, {
            "firstName": person.firstName,
            "lastName": person.lastName,
            "birthday": person.birthday,
            "gender": person.gender,
            "bio": person.bio,
            "chattiness": person.chattiness,
            "image": person.image
        });
        
        personFound.firstName = person.firstName
        personFound.lastName = person.lastName
        personFound.birthday = person.birthday
        personFound.gender = person.gender
        personFound.bio = person.bio
        personFound.chattiness = person.chattiness

        
        return personFound;
    }

}
Backendless.ServerCode.addService(PersonBusiness);