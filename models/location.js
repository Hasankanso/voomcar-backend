'use strict';


class Location extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name location#name
     @type String
     */
    this.name = undefined;
    
     /**
     @name location#placeId
     @type String
     */
    this.placeId = undefined;

    /**
     @name location#position
     @type String
     */
    this.position = undefined;
    
    this.longitude = undefined;
    this.latitude = undefined;

  }
  
}



module.exports = Backendless.ServerCode.addType(Location);