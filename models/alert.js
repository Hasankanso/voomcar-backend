'use strict';

class Alert extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name Alert#driver_id
     @type Number
     */
    this.driver_id = undefined;

    /**
     @name Alert#passenger_id
     @type Number
     */
    this.passenger_id = undefined;

    /**
     @name Alert#from_id
     @type Number
     */
    this.from_id = undefined;

    /**
     @name Alert#comment
     @type String
     */
    this.comment = undefined;

    /**
     @name Alert#to_id
     @type Number
     */
    this.to_id = undefined;

    /**
     @name Alert#id
     @type Number
     */
    this.id = undefined;

    /**
     @name Alert#region
     @type String
     */
    this.region = undefined;

    /**
     @name Alert#max_date
     @type Number
     */
    this.max_date = undefined;

    /**
     @name Alert#min_date
     @type Number
     */
    this.min_date = undefined;

    /**
     @name Alert#price_id
     @type Number
     */
    this.price_id = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(Alert);