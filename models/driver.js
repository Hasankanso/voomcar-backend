'use strict';

class Driver extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name Driver#region
     @type Number
     */
    this.region = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(Driver);