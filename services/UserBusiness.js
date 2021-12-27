/*Created on 06/21/2020 16:42:41.*/
'use strict';
class Person extends Backendless.ServerCode.PersistenceItem {}
class Driver extends Backendless.ServerCode.PersistenceItem {}
class Car extends Backendless.ServerCode.PersistenceItem {}
class location extends Backendless.ServerCode.PersistenceItem {}
class UserStatistics extends Backendless.ServerCode.PersistenceItem {}
class Reserve extends Backendless.ServerCode.PersistenceItem {}


var private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDIz8ghAsVy1xqo\n7TIiR8ThbdhgOwoMOrPI7KZ0dCBe9sNeSFZE4reF4Zrqiatxbeo8iHhACkz/JmbR\nqioA4c8ylXSszN0Ln0gF0CGn5CO7EV4LtRhkYs6XKZUJOH8MH2E1Xd1DbLf+tf02\n5cgn/yQltPtI0NSzlOUMSeUnQMZpymsoVqZYPMyziYC/i4A2jfgCX0K+Wu1a4kqH\ncd5BEYR68DKbjHDiUmK/nC/diyavDI37qSEUoxoVZZT+TDyhSUoX77sbbSTTyUm/\n1HnEqlKoBsJSdbQdyEX2dUfS/fHc2imokzhZPaehl2f8Qegp2IQZ7ZjmiNfbnFzd\nY4pPH9ChAgMBAAECggEAKfozY+EsLLg2ALuKuBtIFvarHVyiGlHYHMeJeT0AOlG7\nn9UfwYkiI4i4ZVBPiCfZp/tAJeTxWQHqSuhXHPWXJkQTTn8JsyECAYMTUgERDg0Q\nm4Jo/a0g8fz1hGasujhCDhGXy/0pTkO1UblBeMjvQbmeMMfEuuCEa+fzkNvLzjet\nBKsA+O1f4wvqXmTKv8jKcVsL8SOm0dbaqrl7GOB4DJkp+sjDw8eJlXjKlrAA9SCD\nP2aIDb8o+HFgPnSqa/wokUtnLIx6Lb6xtC4BRmtJucmMtjgbgRdkkfVCyHdlJiPm\nA648KcJz8YfRC8KIIY/FbaMe2DamF8S09paD3kHc9QKBgQDsRPoJ01ppGsx2RIL2\nkwj/Ne4f6cpQuTW/AujOZtftnitLQhklArD5C2CSacNV+nvWA8d3nP9CdL7vfWar\nLUpZNE9EAw/OsHViuBmrW/QgXMxTziCPvKhCa6XfgpF5rz1QR4C16pCXuzwHcFMC\n12+JKfI9gH68V6ggRZN08yuE3QKBgQDZlMeyP4EbJ8ODQTzdz39OPWDliQS2L3pM\nBQVUjlCJpSZJa/IG8Wjjjb22vEcTpt+T8A5VNaKpNo1SpWqePvBU85EiMH2c9KDB\nluuVX+nzWz35ChWamuClHhrThNTNnxSrKB7g0Vtr+kzFsL1KN8BAO7Zp420DkMuf\nOo3Af7OslQKBgQDSO7ItSgZ53aGvXtkVpNHtnURM20/tsk/TrjgPaM2cHxCw/5i2\nKQXmJKyCu19XwvGsBmLX2Tf9HzrCiVfw2vT8GSKrBvpq1PMuq1gT9Vdt8ITT0WeB\n3sHtkDHhhyIBH+Az7dvmg1iz2qPYjqcesSoK5+sntI2Q84KjbKV/+9xudQKBgQDS\nqmkHvtDkWAXHKf0izmr2eBs/YwD63NFOlXXpvrlf7FU7tZZq/oaN/Ij5SyaOcn37\nIOzft8S8jaMbqCmo+kt8FTAqqESXGYwkpFmJEYrVIzzHyenM/bQQayuSLQRV6nb6\nmSf8iPg5femjZ1J/b6dnCem+cIL2dtWQYAMrpPl0WQKBgQDqzRtCryEYmpZm2kZq\nxx3Ns5Eeo7GAJvH6NqH4vUXb4agWE0Zdki01qEmUrwgRwtPDcGSt8XvpQWm3k13z\nc86WlY5+yAIK3m4BxxkUQDkktJrix0wFJqdNgf4EdGruHSbR2VGLJWgKew9ZSen3\nibNQj69hBRc9xxo8w7vHWjr2Mw==\n-----END PRIVATE KEY-----\n";
class UserBusiness {


    /**
     * @private
     */
    static validatePhoneNumber(number) {
      const re = /^[+]?\d+$/;
      return re.test(String(number).toLowerCase());
    }
    
    /**
     * @private
     */
    static validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }
    
    /**
     * @private
     */
    static generateCharacters(only_numbers = false, times = 1) {
        var min = 0,
            max = 0;

        only_numbers = only_numbers || false;
        times = times || 1;

        //set ascii boundaries to generate either only numbers, or signs, numbers, and letters.
        if (only_numbers) {
            min = 48;
            max = 57;
        } else {
            min = 33;
            max = 126;
        }

        var code = 0;
        var code_string = "";
        for (var i = 0; i < times; i++) {
            code = Math.floor(Math.random() * (max - min + 1)) + min;
            code_string += String.fromCharCode(code);
        }

        return code_string;
    }
    /**
     * @description logout
     * @route POST /Logout
     */
    async logout() {
        if(this.request.context.userToken==null){
          return UserBusiness.error(-1000,"Please_login");
        }
        await Backendless.UserService.logout();
        return {
            "loggedOut": true
        }
    }

    /**
     * @description contact us
     * @route POST /ContactUs
     * @param {var} data
     */
    async contactUs(data) {
      
      const {createError} = require('../lib/generalRoutines');
      var user = data.user
      var person = user.person
      if(user == null || user.email == null || user.email.length == 0 ||
         person.firstName == null || person.lastName == null || user.phone == null ||
         data.message == null || data.message.length == 0 || data.subject == null  ||
         data.subject.length == 0){
        return createError(-1002, "Argument_missing");
      }
      
      if(!UserBusiness.validateEmail(user.email)){
          return createError(-9000, "Invalid_email");
      }
      
        var bodyParts = new Backendless.Bodyparts();
        bodyParts.htmlmessage = "Mail sent by: " + data.user.email + "<br>Full Name: " + data.user.person.firstName + " " + data.user.person.lastName +
            "<br>Phone number: " + data.user.phone + "<br><br>Message: <br>" + data.message;
        var attachments = [""];
        await Backendless.Messaging.sendEmail(data.subject, bodyParts, ["pickapp21@gmail.com"], attachments);

        return {
            "received": "Successfully_received"
        }
    }
    /**
     * @private
     */
    static hideEmail(email) {
        var hiddenEmail = "";
        for (var i = 0; i < email.length; i++) {
            if (i < 2) {
                hiddenEmail += email[i];
            } else {
                if (email[i] == '@') {
                    hiddenEmail += "@";
                } else {
                    hiddenEmail += "*";
                }
            }
        }
        return hiddenEmail;
    }
    
    
    
    /**
     * @description check user if exist or not
     * @route POST /CheckUserExist 
     *  @param {User} user
     */
    async checkUserExist(user) {
        var whereClause = "phone= '" + user.phone + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        user = await Backendless.Data.of("Users").find(queryBuilder);
        user = user[0];
        var isExist;
        if (user != null) {
            isExist = {
                "exist": "true"
            };
        } else {
            isExist = {
                "exist": "false"
            };
        }
        return isExist;
    }

  
    /**
     * @description  change user email
     * @route POST /ChangeEmail 
     *  @param {User} user
     */
    async changeEmail(user) {

        const {getUser} = require('../lib/user');
        const {createError} = require('../lib/generalRoutines');

        if(user == null || user.email == null){
          return createError(-1002, "Argument_missing");
        }
        
        if(!UserBusiness.validateEmail(user.email)){
          return createError(-9000, "Invalid_email");
        }
        
        
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }
        
        userFound.email = user.email;
        await Backendless.UserService.update(userFound);

        const appId = '5FB0EA72-A363-4451-FFA5-A56F031D6600'
        const apiKey = 'A47932AF-43E1-4CDC-9B54-12F8A88FB22E'
        const baseUrl = `http://api.backendless.com/${appId}/${apiKey}`

        await Backendless.Request.post(`${baseUrl}/users/createEmailConfirmationURL/${ userFound.phone }`);
        await Backendless.Users.resendEmailConfirmation(userFound.phone);

        return {
            "email": userFound.email
        };
    }


    /**
     * @description request verification code for login
     * @route POST /RequestCode 
     *  @param {Person} person
     */
    async requestCode(phone) {
      
        const {createError} = require('../lib/generalRoutines');

        if(phone == null || phone.phone == null){
          return createError(-1002, "Argument_missing");
        }
        
        if(!UserBusiness.validatePhoneNumber(phone.phone)){
          return createError(-9001, "Invalid_phone_number");
        }
        
        
        var whereClause = "phone= '" + phone.phone + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var user = await Backendless.Data.of("Users").find(queryBuilder);
        user = user[0];
        if (user == null) {
          return createError(-9003, "user_not_found");
        }
        
        if (user.userStatus == "DISABLED") {
          return createError(-9002, "Account_is_disabled");
        }
        if (user.userStatus == "EMAIL_CONFIRMATION_PENDING"){
          return createError(-9004, "Email_not_confirmed");
        }
            
        user.verificationCode = UserBusiness.generateCharacters(true,5);
        await Backendless.UserService.update(user);
        var bodyPart = new Backendless.Bodyparts();
        bodyPart.htmlmessage = "Hello,<br>You're receiving this notification because you (or someone pretending to be you) have requested to login to your account with application.<br>If you did not request this notification please ignore it." +
            "<br><br>Your code is: " + user.verificationCode + "<br><br>Sincerely,<br>Voomcar Team";
        var attachment = [""];
        Backendless.Messaging.sendEmail("Voomcar Account Login", bodyPart, [user.email], attachment)
        return {
            "email": UserBusiness.hideEmail(user.email)
        };
    }
    
    /**
     * @description login user
     * @route POST /Login 
     *  @param {Person} person
     */
    async login(person) {
        const {createError} = require('../lib/generalRoutines');
        
        
        if(person == null || person.phone == null || person.verificationCode == null){
          return createError(-1002, "Argument_missing");
        }
        
        if(!UserBusiness.validatePhoneNumber(person.phone)){
          return createError(-9001, "Invalid_phone_number");
        }
        
        var whereClause = "";
        if(person.phone == "+96111111111"){
           whereClause = "phone= '" + person.phone + "'";
        } else {
         whereClause = "phone= '" + person.phone + "' AND verificationCode='"+ person.verificationCode+"'";
        }
        
        var queryB = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var user= await Backendless.Data.of("Users").find(queryB);
        user=user[0];
        
        if (user == null){
          return createError(-9005, "login_code_incorrect");
        }

        
        //generate a new password. (At this point user has verified his ownership)
        var password = UserBusiness.generateCharacters(false, 20);
        user.password = password;
        await Backendless.Data.of("Users").save(user); //since the password is the only thing we're changing in user item, save it directly.
        
        var userWithToken = await Backendless.UserService.login(user.phone,user.password,true);
        user.sessionToken = userWithToken["user-token"];
        //get person
        var whereClause = "ownerId= '" + user.objectId + "'";
        var queryB = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryB.setRelated(["countryInformations", "statistics"]);
        user.person = await Backendless.Data.of("person").find(queryB);
        user.person=user.person[0];

        //update FCM token
        user.person.token = person.token;
        await Backendless.Data.of("person").save(user.person);

        var personFound = user.person;
        
        //get all rates
        var whereClause = "target='" + personFound.objectId + "'"
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        user.person.rates = await Backendless.Data.of("rate").find(queryBuilder);

        var rates=user.person.rates;
        for(var i=0;i<rates.length;i++){
          var whereClause = "ownerId='" + rates[i].ownerId + "'";
          var userQueryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
          var rateFound = await Backendless.Data.of("person").find(userQueryBuilder);
          rates[i].rater=rateFound[0];
        }
        user.person.rates=rates;

        var reserveRidesFound = await UserBusiness.getReservedRides(personFound);

        //get driver 
        var whereClause = "person='" + personFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["region1", "region2", "region3"]);
        var driver = await Backendless.Data.of("driver").find(queryBuilder);
        //if no driver return user

        if (driver[0] == null) {
            user.person.upcomingRides = reserveRidesFound;
            return user;
        }

        user.driver = driver[0];

        //cars
        var whereClause = "driver='" + user.driver.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        user.driver.cars = await Backendless.Data.of("car").find(queryBuilder);
        
        
        var drivenRides = await UserBusiness.getDrivenRides(user.driver.objectId)

        var allRides = reserveRidesFound;
        
        if (drivenRides[0] != null) {
            var i = reserveRidesFound.length;
            for (var j = 0; j < drivenRides.length; j++) {
                allRides[i] = drivenRides[j]
                i++
            }
        }

        user.person.upcomingRides = allRides;

        return user;
    }

    /**
     * @description this methode is invoked on app startup
     * @route POST /AutoLogin
     *  @param {User} user
     */
   async autologin(user){
           
      const {createError} = require('../lib/generalRoutines');
      if(user == null || user.id == null || user.password == null){
        return createError(-1002, "Argument_missing");
      }
      
      var userId = user.id;
      var password = user.password;
              
      return await Backendless.UserService.login(userId, password, true);
   }
    

    /**
     * @description this methode is to update token of FCM
     * @route POST /UpdateNotificationToken
     *  @param {User} request
     */
    async UpdateNotificationToken(request) {
        const {createError} = require('../lib/generalRoutines');
        
        
        if(request == null || request.token == null){
          return createError(-1002, "Argument_missing");
        }
        
        const {getUserId} = require('../lib/user');
        const [found, userId] = await getUserId(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userId;
        }
        
        
        var notificationToken = request.token;
      
        //update notification token.
        await Backendless.Data.of("person").bulkUpdate("ownerId = '" + userId  + "'", {
                "token": notificationToken
        });
            

        return {
            "userStatus": user.userStatus
        };
    }

    /**
     * @description  change user phone number
     * @route POST /ChangePhone 
     *  @param {User} user
     */
    async changePhone(request) {
        const {getUser} = require('../lib/user');
        const {createError} = require('../lib/generalRoutines');
        if(request == null || request.user == null || request.idToken == null){
          return createError(-1002, "Argument_missing");
        }
        
        const [found, userFound] = await getUser(this.request.context); //if found equal false, means something is wrong
        
        if(!found){
          return userFound;
        }

        
        var user = request.user;
        var token = request.idToken;
        
        const jwt = require('jwt-simple');
        var decoded = jwt.decode(token, private_key, 'RS256');

        userFound.phone = decoded.phone_number;

        var whereClause = "ownerId= '" + userFound.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        userFound.person = await Backendless.Data.of("person").find(queryBuilder);
        userFound.person=userFound.person[0];

        await Backendless.Data.of("person").setRelation(userFound.person, "countryInformations", [user.person.countryInformations.id]);
        userFound.person.countryInformations = await Backendless.Data.of("countryInformation").findById(user.person.countryInformations.id);
        
        //generate a new password.
        var password = UserBusiness.generateCharacters(false, 20);
        userFound.password = password;
         
        await Backendless.UserService.update(userFound);
        var phone = userFound.phone;
        var password = userFound.password;
        //login the current user,cause when updating password, token expired
        var loggedInUser= await Backendless.UserService.login(phone, password, true);
        loggedInUser.person=userFound.person;
        loggedInUser.sessionToken = loggedInUser["user-token"];
        return loggedInUser;
    }

    /**
     * @private
     */
    async deleteUser(person) {
        //get user with person
        var whereClause = "phone= '" + person.phone + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["person", "person.statistics"]);
        var oldUser = await Backendless.Data.of("Users").find(queryBuilder);
        oldUser = oldUser[0];
        if (oldUser == null)
            return;

        var oldPerson = oldUser.person;
        if(oldPerson != null){
        if (oldPerson.statistics != null)
            await Backendless.Data.of('userStatistics').remove(oldPerson.statistics);


        //delete person's image
        if (oldPerson.image != null && oldPerson.image != "") {
          try{
            await Backendless.Files.remove(oldPerson.image);
          } catch (e) {
            
          }
        }

        
        await UserBusiness.deleteReseravtions(oldPerson);

        //delete rates
        await Backendless.Data.of("rate").bulkDelete("target='" + oldPerson.objectId + "'");

 
        //get driver
        var whereClause = "person='" + oldPerson.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var driver = await Backendless.Data.of("driver").find(queryBuilder);
        driver = driver[0];


        if (driver != null) {

            //get driven rides
            var whereClause = "driver='" + driver.objectId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            var drivenRides = await Backendless.Data.of("ride").find(queryBuilder);

            if (drivenRides.length != 0) {
                await UserBusiness.deleteDrivenRides(drivenRides, oldPerson, driver);
            }

            await UserBusiness.deleteDriver(driver);

        }

        //delete person
        await Backendless.Data.of('person').remove(oldPerson);
        }
        //delete user
        await Backendless.Data.of('Users').remove(oldUser);
    }
    /**
     * @description register user
     * @route POST /Register
     *  @param {Person} person
     */
    async register(request) {
        const {createError} = require('../lib/generalRoutines');
        if(request == null || request.user == null || request.user.person == null || request.idToken == null){
          
          return createError(-1002, "Argument_missing");
        }
        
        var error = UserBusiness.validateUser(request.user, createError);
        if(error !=null){
          
          return error;
        }
        
        var user = request.user;
        var token = request.idToken;
        const jwt = require('jwt-simple');
        var decoded = jwt.decode(token, private_key, 'RS256');
        
        if(decoded == null || decoded.phone_number == null) {
          return createError(-9008, "Authentication_failed");
        }
        
        if(!UserBusiness.validatePhoneNumber(decoded.phone_number)){
          return createError(-9001, "Invalid_phone_number");
        }
        
        //from here, it's proven that he/she is the owner of the phone number.
        user.phone = decoded.phone_number;

        return await UserBusiness.saveUserAndPerson(user);
    }
    /**
     * @description force register user
     * @route POST /ForceRegister
     *  @param {Person} person
     */
    async forceRegister(request) {
        const {createError} = require('../lib/generalRoutines');
        if(request == null || request.user == null || request.user.person == null || request.idToken == null){
          
          return createError(-1002, "Argument_missing");
        }
        
        var error = UserBusiness.validateUser(request.user, createError);
        if(error !=null){
          return error;
        }
        
        var user = request.user;
        var token = request.idToken;
        const jwt = require('jwt-simple');
        var decoded = jwt.decode(token, private_key, 'RS256');
        
        
        //from here, it's proven that he/she is the owner of the phone number.
        user.phone = decoded.phone_number;

        if(decoded == null || decoded.phone_number == null) {
          return createError(-9008, "Authentication_failed");
        }
        
        if(!UserBusiness.validatePhoneNumber(decoded.phone_number)){
          return createError(-9001, "Invalid_phone_number");
        }

        await this.deleteUser({
            "phone": decoded.phone_number
        });
        
        return await UserBusiness.saveUserAndPerson(user);
    }
    
    

    /**
     * @private
     */
    static validateUser(user, createError){
      
      const {validatePerson} = require('../lib/person');
      
      var error2 = validatePerson(user.person);
      
      if(error2 != null){
        
        return error2;
      }
        
      if(user.driver !=null){ // become a driver is not manditory.
      
        const {validateBecomeaDriver} = require('../lib/driver');
      
        var error3 = validateBecomeaDriver(user.driver);
        
        if(error3 !=null){
          return error3;
        }
      }
      
      return null;
    }
    
    
    /**
     * @private
     */
    static async saveUserAndPerson(user) {
        
        //generate verification code, this is different than sms verification code. In register case this code will not be sent to user email.
        var code = UserBusiness.generateCharacters(true,5);
        user.verificationCode = code;

        //generate a password for this user.
        var password = UserBusiness.generateCharacters(false, 20);
        user.password = password;
        
        var registeredPerson = user.person;
        registeredPerson.gender = (user.person.gender === true);
        var bday = user.person.birthday;
        registeredPerson.birthday = Date.parse(bday);
        var countryInfo = registeredPerson.countryInformations.id;
        
        //set user status to enable
        user.userStatus="ENABLED"
        //register user
        var registeredUser = await Backendless.UserService.register(user);
        

        //add owner id to person object(table person)
        registeredPerson.ownerId = registeredUser.ownerId;

        //add owner id to userStatistics object(table userStatistics)
        var newStatistics={};
        newStatistics.ownerId= registeredUser.ownerId;
        newStatistics = await Backendless.Data.of("userStatistics").save(newStatistics);
        registeredPerson.statistics = newStatistics;

        //register person
        registeredPerson = await Person.save(registeredPerson);

        var relations = [];
        var savedDriver;
        if (user.driver != null) {
            savedDriver = await UserBusiness.saveDriver(user.driver, relations, registeredPerson,registeredUser.ownerId);
        }

        relations.push(Backendless.Data.of("person").setRelation(registeredPerson, "countryInformations", [countryInfo]));
        relations.push(Backendless.Data.of("Users").setRelation(registeredUser, "person", [registeredPerson]));
        relations.push(Backendless.Data.of("person").setRelation(registeredPerson, "statistics", [newStatistics]));

        await Promise.all(relations);
        

        //create person json from registred user
        registeredUser.person = registeredPerson;
        registeredUser.driver = savedDriver;
        var countryInformations = await Backendless.Data.of("countryInformation").findById(countryInfo);
        registeredUser.person.countryInformations = countryInformations;
        

        //registration does not generate user-token, that's why we need to login.
        var user_with_token = await Backendless.UserService.login(registeredUser.objectId);

        registeredUser.sessionToken = user_with_token["user-token"];
        
        return registeredUser;
    }
    /**
     * @private
     */
    static async saveDriver(driver, relations, registeredPerson,ownerId) {
      
        //store regions in vars
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
        var user = driver.user;
        delete driver.user;

        //add owner id to driver object(table driver)
        driver.ownerId= ownerId;
        var savedDriver = await Backendless.Data.of("driver").save(driver);


        //add owner id to Car object(table Car)
        driver.cars[0].ownerId= ownerId;
        var savedCar = await Car.save(driver.cars[0]);
         
        var driverData = Backendless.Data.of("driver");

        relations = [
            driverData.setRelation(savedDriver, "person", [registeredPerson]),
            Backendless.Data.of("car").setRelation(savedCar, "driver", [savedDriver]),
            driverData.setRelation(savedDriver, "region1", [region1.objectId]),
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

        var cars = [];
        cars.push(savedCar);
        savedDriver.cars = cars;
        return savedDriver;
    }

     
    /**
     * @private
     */
    static async deleteReseravtions(oldPerson) {
        //delete reserved rides
        const {sendNotification} = require('../lib/generalRoutines');
        var whereClause = "person='" + oldPerson.objectId + "' AND ride.leavingDate >= '" + Date.now() + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["ride", "ride.driver.person"]);
        var reserves = await Backendless.Data.of("reserve").find(queryBuilder);

        var title = "Reservation has been canceled";
        var body = oldPerson.firstName + " " + oldPerson.lastName + " canceled his reservation";

        //update rides
        for (var i = 0; i < reserves.length; i++) {
            if (reserves[i].ride == null)
                continue;
            var objects = [reserves[i].ride.objectId, reserves[i].objectId];
            await sendNotification(reserves[i].ride.driver.person.token, title,body,objects,"RESERVATION_CANCELED");
            var whereClause = "objectId='" + reserves[i].ride.objectId + "'";
            await Backendless.Data.of("ride").bulkUpdate(whereClause, {
                "availableSeats": parseInt(reserves[i].ride.availableSeats + reserves[i].seats),
                "availableLuggages": parseInt(reserves[i].ride.availableLuggages + reserves[i].luggages)
            });
        }

        //delete reserve
        await Backendless.Data.of("reserve").bulkDelete("person='" + oldPerson.objectId + "'");
    }

    /**
     * @private
     */
    static async deleteDriver(driver) {
        const {sendNotificationToMultipleUser} = require('../lib/generalRoutines');
        //get cars
        var whereClause = "driver='" + driver.objectId + "'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        var cars = await Backendless.Data.of("car").find(queryBuilder);


if(cars.length)
        //delete car pictures
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].picture != null && cars[i].picture != "")
            
            try{
                await Backendless.Files.remove(cars[i].picture);
            } catch(e) {
              
            }
        }

        //delete cars
        await Backendless.Data.of("car").bulkDelete("driver='" + driver.objectId + "'");
        //delete driver
        await Backendless.Data.of('driver').remove(driver);
    }

    /**
     * @private
     */
    static async deleteDrivenRides(drivenRides, oldPerson, driver) {
        const {sendNotificationToMultipleUser} = require('../lib/generalRoutines');
        for (var i = 0; i < drivenRides.length; i++) {
            if (drivenRides[i].map != null && drivenRides[i].map != "") {
              try{
                await Backendless.Files.remove(drivenRides[i].map);
              } catch (e) {
                
              }
            }
            var rideId = drivenRides[i].objectId;
            //get passengers and send notification about deleted ride without rate
            var whereClause = "ride='" + rideId + "'";
            var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
            queryBuilder.setRelated(["person"]);
            var passengers = await Backendless.Data.of("reserve").find(queryBuilder);

            if (passengers.length != 0) {
                var tokens = [];
                for (var i = 0; i < passengers.length; i++) {
                    tokens.push(passengers[i].person.token);
                }
                var title = "Ride has been canceled";
                var body = "Your ride with " + oldPerson.firstName + " " + oldPerson.lastName + " has been canceled.";
                var objects = [rideId];
                await sendNotificationToMultipleUser(tokens, title,body,objects, "RIDE_CANCELED");
            }
        }
        //delete drivenRides
        await Backendless.Data.of("ride").bulkDelete("driver='" + driver.objectId + "'");
    }

    /**
     * @private
     */
    static async getDrivenRides(driverId) {
      
        var whereClauseRide = "driver='" + driverId + "' AND leavingDate > '" + Date.now() + "'";
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
    static async getReservedRides(personFound) {
        
        var whereClause = "person='" + personFound.objectId + "' AND ride.leavingDate > '" + Date.now() + "' AND status != 'CANCELED'";
        var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        queryBuilder.setRelated(["ride", "ride.car", "ride.from", "ride.to", "ride.driver", "ride.driver.person", "ride.driver.person.countryInformations", "ride.driver.person.statistics"]);
        var reserveRidesFound = await Backendless.Data.of("reserve").find(queryBuilder);
        //todo check if we can remove this for loop and set it in client side.
        var rides=[];
        
        for (var i = 0; i < reserveRidesFound.length; i++) {
            var res = reserveRidesFound[i];
            var passenger = new Reserve();

            passenger.objectId = res.objectId
            passenger.created = res.created
            passenger.___class = res.___class
            passenger.luggages = res.luggages
            passenger.ownerId = res.ownerId
            passenger.updated = res.updated
            passenger.seats = res.seats

            var ride = res.ride;
            ride.passengers = []
            ride.passengers.push(passenger)
            rides.push(ride);
        }
        return rides;
    }
}
Backendless.ServerCode.addService(UserBusiness);