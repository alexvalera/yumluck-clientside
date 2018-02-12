/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const $  = require('jquery'); 
const search = require('./search.js'); 
$('.nav-btn').on('click', function(){
  location.reload();
});



document.addEventListener("deviceready", function(){
  if (localStorage.getItem('logged-in') == undefined ||localStorage.getItem('logged-in') == 'false') {
    if (confirm('You got to log in but we will give you a pass if you press [OK]')) {
      alert(window.location.href); 
    setTimeout(function() {
      $('#splash-screen').fadeOut(function() {
        search.init(); 
      });
    }, 1000); 
    }
  }
});





