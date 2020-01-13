"use strict";

$.ajax({
  url: "../content/",
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  success: function (response) {
    $(response).find("a.folder").each(function (index) {
      var categoryName = $(this).attr("href").replace("/content/", "").replace("/", "");
      $("<p class=\"sidebar__category-title\">" + categoryName + "</p>").appendTo(".sidebar");
      $("<div class=\"sidebar__category sidebar__category-" + index + " category\"></div>")
        .appendTo(".sidebar");

      $.ajax({
        url: "../content/" + categoryName + "/",
        success: function (response) {
          $(response).find("a.file.png").each(function () {
            var fileName = $(this).attr("href").replace("/content/" + categoryName + "/", "");
            $(
              "<img alt=\"content\" class=\"category__item\" src=\"" +
              "../content/" + categoryName + "/" + fileName + "\" />"
            )
              .appendTo(".sidebar__category-" + index);
          });

          ininializeInteraction();
        }
      })
    });
  }
});

function ininializeInteraction() {
  $('.sidebar-button').on('click', function () {
    $('.sidebar').toggleClass('sidebar_opened');
    $('.sidebar-button').toggleClass('sidebar-button_opened');
  });

  $('.category__item').draggable({
    // appendTo: "body",
    helper: function() {
      var _new = $(this).clone().draggable();
      $(this).draggable();
      return _new;
    },
    stop : function(e, ui) {
      $('.category__item').draggable().data()["ui-draggable"].cancelHelperRemoval = true;
    }
  });

  $('.area-to-capture').droppable({
    accept: ".category__item"
  });
}
