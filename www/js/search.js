const $ = require('jquery'); 
const cards = require('./resultCards.js');
module.exports = {
  apiKey: 'AIzaSyCLH6HjjriYoIFmlPMzV0jg6HGrQ-MDQ2s',
  currPosition: {},
  currCity:'', 
  currState: '',
  lastLocation: '',
  $locationInput: $('#location-container .location-title'),
  init: function (){
    let _this = this;
    this.getGeoLocation();
    $('.location-title').on('click', function(){
      _this.lastLocation = $(this).val();
      $('.location-title').val(''); 
    });
    $('.location-title').focusout(function(){
      if ($('.location-title').val() == '') {
        $('.location-title').val(_this.lastLocation); 
      }
    });
    $('.refresh-location-btn').on('click', function(e){
      e.preventDefault();
    });
  },
  getGeoLocation: function() {
    let _this = this;
    $.ajax({
      type: "POST", 
      url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCLH6HjjriYoIFmlPMzV0jg6HGrQ-MDQ2s", 
      success: function(data) {
        _this.currPosition = {latitude: data.location.lat, longitude: data.location.lng};
        console.log(_this.currPosition.latitude, _this.currPosition.longitude);
        _this.getCity(_this.currPosition); 
      }
    })
  },
  getCity: function(position) {
    let _this = this;
    let coords = {
      latlng: position.latitude + ',' + position.longitude, 
      key: this.apiKey
    };
    $.ajax({
      type: "GET", 
      url: "https://maps.googleapis.com/maps/api/geocode/json", 
      data:coords, 
      success: function(data) {
        let addressComponents = data.results[0].address_components; 
        for (var i = 0; i < addressComponents.length; i++) {
          var component = addressComponents[i]; 
          if (component.types.length == 2) {
            if (component.types[0] == 'locality' && component.types[1] == 'political') {
              _this.currCity = component.short_name; 
            }
            else if (component.types[0] == 'administrative_area_level_1' && component.types[1] == 'political') {
              _this.currState = component.short_name;
            }
          }
        } 
        console.log(_this.currCity + ', ' + _this.currState); 
        _this.$locationInput.val(_this.currCity + ', ' + _this.currState);
        $('#mood-location-container #city').text(_this.currCity + ', ' + _this.currState);
        let terms = {location:_this.currCity + ', ' + _this.currState};
        cards.getResults(terms); 
      }
    });
  } 

}; 
