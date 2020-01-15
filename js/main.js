"use strict";

$(document).ready(function () {
  $('.sidebar-button').on('click', function () {
    $('.sidebar').toggleClass('sidebar_opened');
    $('.sidebar-button').toggleClass('sidebar-button_opened');
  });
});
