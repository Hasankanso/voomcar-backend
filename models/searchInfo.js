/*Created on 06/09/2020 17:36:59.*/

'use strict';

class SearchInfo {
  constructor() {
    
    /**
     @name SearchInfo#from
     @type Location
     */
    this.from = undefined;

    /**
     @name SearchInfo#to
     @type Location
     */
    this.to = undefined;
    
    /**
     @name SearchInfo#minDate
     @type DATETIME
     */
    this.minDate;
    
    /**
     @name SearchInfo#maxDate
     @type DATETIME
     */
    this.maxDate;
    
    /**
     @name SearchInfo#passengersNumber
     @type NUMBER
     */
    this.passengersNumber;

  }
}

module.exports = Backendless.ServerCode.addType(SearchInfo);