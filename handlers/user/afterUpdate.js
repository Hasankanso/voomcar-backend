/**
* @param {Object} req The request object contains information about the request
* @param {Object} req.context The execution context contains an information about application, current user and event
* @param {Object} req.user 
*
* @param {Object} res The response object
* @param {Object} res.result Execution Result
* @param {Object} res.error
*/
Backendless.ServerCode.User.afterUpdate(async function(req, res) {
email = (res.result['email']);
//The following code change the status to EMAIL_CONFIRMATION_PENDING
emailConfiramtionUrl = (await Backendless.Request['post']( (function ( url ) {
  if( !url ) {
    throw new Error( 'Url must be specified.' )
  }
  if( !url.startsWith( 'http://' ) && !url.startsWith( 'https://' ) ) {
    return 'https://' + url
  }
  return url
})( `http://api.backendless.com/5FB0EA72-A363-4451-FFA5-A56F031D6600/C8502745-CB10-4F56-9FD5-3EFCE59F1926/users/createEmailConfirmationURL/${email}`).send()))
  
//The following code resend email confirmation
resendEmailConfirmation = (await Backendless.Request['post']( (function ( url ) {
  if( !url ) {
    throw new Error( 'Url must be specified.' )
  }
  if( !url.startsWith( 'http://' ) && !url.startsWith( 'https://' ) ) {
    return 'https://' + url
  }
  return url
})( `http://api.backendless.com/5FB0EA72-A363-4451-FFA5-A56F031D6600/C8502745-CB10-4F56-9FD5-3EFCE59F1926/users/resendconfirmation/${email}` ).send()))
},true)
