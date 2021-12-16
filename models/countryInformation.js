'use strict';

class Currency extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name countryInformation#unit
     @type String
     */
    this.unit = undefined;
    
      /**
     @name countryInformation#name
     @type String
     */
    this.name = undefined;
    
      /**
     @name countryInformation#code
     @type String
     */
    this.code = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(Currency);