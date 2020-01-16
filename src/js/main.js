"use strict";

$(document).ready(function () {
  $(".sidebar-button").on("click", function () {
    $(".sidebar").toggleClass("sidebar_opened");
    $(".sidebar-button").toggleClass("sidebar-button_opened");
  });

  $(".color-picker").spectrum({
    color: "#fff",
    change: function (color) {
      $(".area-to-capture").css("background-color", color.toHexString());
    }
  });

  $(".send-postcard-form").dialog({
    autoOpen: false,
    modal: true,
    height: 380,
    width: 350,
    buttons: {
      "Отправить": function () {
        var to = $("#to-input-field").val();
        var subject = $("#subject-input-field").val();
        var body = $("#body-input-field").val();

        if (!to || !subject || !body) {
          alert("Все поля ввода должны быть заполнены!");
          return;
        }

        sendPostcardImage();
        $(this).dialog("close");
      },
      "Отменить": function () {
        $(this).dialog("close");
      }
    },
    close: function () {
      $(".send-postcard-form__input-field").val("");
    },
    title: "Отправить открытку",
    resizable: false,
    position: {
      my: "center",
      at: "center",
      of: document
    }
  });
});

function openSendPostcardForm() {
  $(".send-postcard-form").dialog("open");
}
