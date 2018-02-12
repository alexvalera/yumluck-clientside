'use strict'; 
const $ = require('jquery'); 
const Swing = require('swing');
module.exports = {
  results: [], 
  addSwing: function() {
    // An instance of the Stack is used to attach event listeners.

    const config = {
      /**
       * Invoked in the event of dragmove.
       * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
       * Ration of the absolute distance from the original card position and element width.
       *
       * @param {number} xOffset Distance from the dragStart.
       * @param {number} yOffset Distance from the dragStart.
       * @param {HTMLElement} element Element.
       * @returns {number}
       */
      minThrowOutDistance: 50,
      maxThrowOutDistance: 50,
      throwOutConfidence: (xOffset, yOffset, element) => {
        console.log(xOffset, 'xOffset'); 
        const xConfidence = Math.min(Math.abs(xOffset) / element.offsetWidth, 1);
        const yConfidence = Math.min(Math.abs(yOffset) / element.offsetHeight, 1);
        console.log(Math.max(xConfidence+0.3, yConfidence+0.3));
        var ret = Math.max(xConfidence+0.3, yConfidence+0.3);
        ret = ret > 1 ? 1 : ret; 
        return ret; 
      }
    };
    const stack = Swing.Stack(config);
    const cards = [].slice.call(document.querySelectorAll('.food-card'));
    cards.forEach((targetElement) => {
      // Add card element to the Stack.
      console.log(stack.createCard(targetElement));
    });

    console.log(stack); 

    // Add event listener for when a card is thrown out of the stack.
    stack.on('throwout', (event) => {
      // e.target Reference to the element that has been thrown out of the stack.
      // e.throwDirection Direction in which the element has been thrown (Direction.LEFT, Direction.RIGHT).
      console.log('Card has been thrown out of the stack.');
      console.log(typeof event.throwDirection); 
      console.log(event.throwDirection.toString()); 
      console.log('Throw direction: ' + (event.throwDirection.toString() == 'Symbol(LEFT)' ? 'left' : 'right'));
    $(event.target).css('display', 'none'); 
    if (event.throwDirection.toString() == 'Symbol(RIGHT)') {
      $('.food-card').fadeOut(100, function() {
        $('.success-card').fadeIn(500); 
      }); 
    }
    else {
      $('.hide-card:last').addClass('card-slide-up'); 
      $('.hide-card:last').removeClass('hide-card'); 
    }
    // $(event.target).throwOut(Direction.RIGHT, 0);
    });
    // Add event listener for when a card is thrown in the stack, including the spring back into place effect.
    stack.on('throwin', () => {
      console.log('Card has snapped back to the stack.');
    });
  }, 
  getResults: function(terms) {
    let _this = this;
    $.ajax({
      type: "GET", 
      url: "https://yumluck.herokuapp.com/search", 
      data:terms,
      success: function(data) {
        //console.log('data being returned from yumluck api'); 
        //console.log(JSON.parse(data)); 
        _this.results = JSON.parse(data).businesses; 
        _this.render(JSON.parse(data).businesses);
      }
    }); 
  }, 
  render: function(data){
    console.log('render called'); 
    console.log('data length', data); 
    function renderSingleCard(business, index) {
      var styles =  {
        addr2: business.location.address2? 'show' : 'hide',
        addr3: business.location.address3? 'show': 'hide',
        hideCard: index != 0? 'hide-card' : '',
        hideState: business.location.city == 'Washington, DC' ? 'hide' : 'show'
      };
      return `
    <div class = "food-card ${styles.hideCard}">
      <div class = "top">
      <div class = "left">
      <picture class = "rest-image">
        <img src = "${business.image_url}"/>
      </picture>
      </div>
      <div class = "right">
      <h1 class = "rest-title">${business.name}</h1>
      <div class = "rest-address-container">
        <p class = "street-address-1"> ${business.location.address1} </p>
        <p class = "street-address-2 ${styles.addr2}">${business.location.address2}</p>
        <p class = "street-address-3 ${styles.addr3}">${business.location.address3}</p>
        <p class = "city">${business.location.city}, <span class = "${styles.hideState}">${business.location.state}</span><span class = "zip"> ${business.location.zip_code}</span</p>
      </div>
      <picture>
        <img class = "rating" src = "./img/small_4@3x.png">
      </picture>
      </div>

      </div>
      <div class = "glance-container">
        <h1 class = "glance-title">At a glance</h1>
        <div>
          <ul class = "glance-list">
            <li>American Cuisine <br> <span class = "side-note">One of your favorites!</span></li>
            <li>1.2 miles away <br> <span class = "side-note">Not bad of a hike</span></li>
            <li>Does Delivery / Carryout <br> <span class = "side-note">Just in case you feel lazy</span></li>
          </ul>
        </div>
      </div>
      <div class = "more-info-container">
        <button class = "more-info-btn"> - Tap For More Info - </button>
      </div>
    </div> 
      `; 

    }
    for (var i = 0; i < data.length; i++) {
      let business = data[i]; 
      let card = renderSingleCard(business, i); 
      $('#food-card-container').prepend(card);
    }
    this.addSwing();
  }
}; 