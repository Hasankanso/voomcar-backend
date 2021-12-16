/*Created on 06/10/2020 02:08:18.*/
'use strict';

class Ride extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name ride#stopTime
     @type Number
     */
    this.stopTime = undefined;

    /**
     @name ride#countryInformations
     @type Array.<countryInformation>
     */
    this.countryInformations = undefined;
    
    /**
     @name ride#leavingDate
      @type DATETIME
     */
    this.leavingDate = undefined;

    /**
     @name ride#comment
     @type String
     */
    this.comment = undefined;

    /**
     @name ride#from
     @type Geometry
     */
    this.from = undefined;

 /**
     @name ride#to
     @type Geometry
     */
    this.to= undefined;

    /**
     @name ride#acAllowed
     @type Boolean
     */
    this.acAllowed = undefined;

    /**
     @name ride#driver
     @type String
     */
    this.driver = undefined;

    /**
     @name ride#musicAllowed
     @type Boolean
     */
    this.musicAllowed = undefined;

    /**
     @name ride#car
     @type Array.<Car>
     */
    this.car = undefined;

    /**
     @name ride#kidSeat
     @type Boolean
     */
    this.kidSeat = undefined;

    /**
     @name ride#availableSeats
     @type Number
     */
    this.availableSeats = undefined;

    /**
     @name ride#smokingAllowed
     @type Boolean
     */
    this.smokingAllowed = undefined;

    /**
     @name ride#currency
     @type String
     */
    this.currency = undefined;

    /**
     @name ride#price
     @type Number
     */
    this.price = undefined;

    /**
     @name ride#map
     @type String
     */
    this.map = undefined;

    /**
     @name ride#availableLuggages
     @type Number
     */
    this.availableLuggages = undefined;

  

    /**
     @name ride#petsAllowed
     @type Boolean
     */
    this.petsAllowed = undefined;

  }
}

module.exports = Backendless.ServerCode.addType(Ride);