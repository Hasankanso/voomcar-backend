/*Created on 08/14/2021 14:28:48.*/
var android_notification_key = 'key=AAAA6JX9kus:APA91bHpaK5v4eMPWvWPVaivDGyZszwNklqUpyBn--0ZziJlXT6ZMJYMJ9zq7gv8CNSXNmSk8vPMmG10l00OzHI_vfCAIYvnDVlMbyYIduc1dhqXlf5O4jAr-siCuZ_Ox0O5HPqbgiht';

exports.createError = async function createError(id, message) {

    return {
        "code": id,
        "message": message
    };
}


exports.sendNotificationToMultipleUser=async function sendNotificationToMultipleUser(token, title, body, object, action, isMinimized = false) {
 var data = {
        "title": title,
        "body": body,
        "action": action,
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
    };
    if (!isMinimized) {
        data["object"] = object;
    } 

    await Backendless.Request.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": token,
            "notification": {
                "title": title,
                "body": body,
                'content_available': true
            },
            "apns": {
                "headers": {
                "apns-priority": "5",
                 },
                "payload": {
                "aps": {
                "category": "NEW_MESSAGE_CATEGORY"
                   }
                 }
            },
            "data": data,
            "priority": "high"
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', android_notification_key)
        .then(result => {
              console.log(result);
            if (result["failure"]==1&&result["results"][0]["error"]==="MessageTooBig"&&!isMinimized) {
              console.log("message is too big, sending minimized notification");
              sendNotification(token, title, body, object, action, true);
            }
        })
        .catch((error)=>{
          console.log(error);
        })
}

exports.sendNotification = async function sendNotification(token, title, body, object, action, isMinimized = false) {
    var data = {
        "title": title,
        "body": body,
        "action": action,
        "isMinimized" : isMinimized,
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
    };
    if (!isMinimized) {
        data["object"] = object;
    } else {
      if(action == "SEATS_RESERVED" || action == "EDIT_RESERVATION"){
        data["object"] = [object.objectId, object.rideId]
      }
    }

    await Backendless.Request.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": [token],
            "notification": {
                "title": title,
                "body": body,
                'content_available': true
            },
            "apns": {
                "headers": {
                "apns-priority": "5",
                 },
                "payload": {
                "aps": {
                "category": "NEW_MESSAGE_CATEGORY"
                   }
                 }
            },
            "data": data,
            "priority": "high"
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', android_notification_key)
        .then(result => {
              console.log(result);
            if (result["failure"]==1&&result["results"][0]["error"]==="MessageTooBig"&&!isMinimized) {
              console.log("message is too big, sending minimized notification");
              sendNotification(token, title, body, object, action, true);
            }
        })
        .catch((error)=>{
          console.log(error);
        })
}


exports.sendSilentScheduleNotification=async function sendSilentScheduleNotificationToMultipleUser(token, title, body, object, action, isMinimized = false) {
 var data = {
        "title": title,
        "body": body,
        "action": action,
        "click_action": "FLUTTER_NOTIFICATION_CLICK",
        "isSchedule": true
    };
    if (!isMinimized) {
        data["object"] = object;
    } 
    await Backendless.Request.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": [token],
            "data": data,
            "apns": {
                "headers": {
                "apns-priority": "5",
                 },
                "payload": {
                "aps": {
                "category": "NEW_MESSAGE_CATEGORY"
                   }
                 }
            },
            "priority": "high"
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', android_notification_key)
        .then(result => {
              console.log(result);
            if (result["failure"]==1&&result["results"][0]["error"]==="MessageTooBig"&&!isMinimized) {
              console.log("message is too big, sending minimized notification");
              sendNotification(token, title, body, object, action, true);
            }
        })
        .catch((error)=>{
          console.log(error);
        })
}

exports.sendSilentScheduleNotificationToMultipleUser=async function sendSilentScheduleNotificationToMultipleUser(token, title, body, object, action, isMinimized = false) {
 var data = {
        "title": title,
        "body": body,
        "action": action,
        "click_action": "FLUTTER_NOTIFICATION_CLICK",
        "isSchedule": true
    };
    if (!isMinimized) {
        data["object"] = object;
    } 
    console.log("sending notification");
    await Backendless.Request.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": token,
            "data": data,
            "apns": {
                "headers": {
                "apns-priority": "5",
                 },
                "payload": {
                "aps": {
                "category": "NEW_MESSAGE_CATEGORY"
                   }
                 }
            },
            "priority": "high"
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', android_notification_key)
        .then(result => {
              console.log(result);
            if (result["failure"]==1&&result["results"][0]["error"]==="MessageTooBig"&&!isMinimized) {
              console.log("message is too big, sending minimized notification");
              sendNotification(token, title, body, object, action, true);
            }
        })
        .catch((error)=>{
          console.log(error);
        })
}
