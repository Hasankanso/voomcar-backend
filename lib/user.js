/*Created on 07/28/2021 12:06:51.*/


exports.getUser = async function getUser(context){
        const {createError} = require('./generalRoutines');
        
        if (context.userToken == null) {
          return [false, createError(-1000, "Please_login")]; //false means we return an error, and true means we return a user.
        }
        
        var user = await Backendless.UserService.getCurrentUser();
        
        if (user.userStatus == "DISABLED"){
          return [false, createError(-9002, "Account_is_disabled")];
        }
        
        return [true, user];
}


exports.getUserId = async function getUserId(context){
        const {createError} = require('./generalRoutines');
        
        if (context.userToken == null || context.userId == null) {
          return [false, createError(-1000, "Please_login")]; //false means we return an error, and true means we return a user.
        }
        
        return [true, context.userId];
}