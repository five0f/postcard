"use strict";

function initializeSidebarButton() {
  $(".sidebar-button").on("click", function () {
    $(".sidebar").toggleClass("sidebar_opened");
    $(".sidebar-button").toggleClass("sidebar-button_opened");
  });
}

function initializeColorPicker() {
  $(".color-picker").spectrum({
    color: "#fff",
    change: function (color) {
      $("#postcard").css("background-color", color.toHexString());
    }
  });
}

function initializeSendPostcardForm() {
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
}

var clonedItemCounter = 0;

function initializePostcardItems() {
  $(".cloneable-item").draggable({
    helper: "clone",
    scroll: false,
    cursor: "move",
    stack: ".cloneable-item, .cloned-item",
    revert: "invalid",
    start: function (_event, ui) {
      ui.helper.css({
        "width": "",
        "margin": ""
      });
    },
    stop: function (_event, ui) {
      var clonedItemId = "#cloned-item_" + clonedItemCounter;

      if ($(clonedItemId).hasClass("cloneable-item")) {
        var position = ui.offset;

        $(clonedItemId).css({
          "left": position.left,
          "top": position.top,
          "position": "absolute",
          "width": ui.helper.css("width"),
          "margin": ui.helper.css("margin")
        });

        $(clonedItemId).removeClass("cloneable-item");
        $(clonedItemId).addClass("cloned-item");

        $(clonedItemId).draggable({
          stack: ".cloned-item",
          cursor: "move",
          scroll: false,
          revert: "invalid"
        });

        $(clonedItemId).dblclick(function () {
          if ($(this).hasClass("ui-draggable")) {
            $(this).draggable("destroy");

            $(this).resizable({
              aspectRatio: true,
              autoHide: true,
              containment: "parent",
              handles: "all"
            });
          } else if ($(this).hasClass("ui-resizable")) {
            $(this).resizable("destroy");

            $(this).draggable({
              stack: ".cloned-item",
              cursor: "move",
              scroll: false,
              revert: "invalid"
            });
          } else {
            // ignore...
          }
        });
      }
    }
  });
}

function initializePostcard() {
  $("#postcard").droppable({
    tolerance: "fit",
    drop: function (_event, ui) {
      var droppedItem = ui.draggable;
      if (droppedItem.attr("id").search(/cloneable-item_[0-9]{1,}/) != -1) {
        clonedItemCounter++;
        var clonedItem = droppedItem.clone();
        clonedItem.addClass("temporary-class");
        $(this).append(clonedItem);
        $(".temporary-class").attr("id", "cloned-item_" + clonedItemCounter);
        $("#cloned-item_" + clonedItemCounter).removeClass("temporary-class");
      }
    }
  });
}

function initalizeTrash() {
  $("#trash").droppable({
    tolerance: "touch",
    accept: ".cloned-item",
    drop: function (_event, ui) {
      ui.draggable.remove();
    }
  });
}

$(document).ready(function () {
  initializeSidebarButton();
  initializeColorPicker();
  initializeSendPostcardForm();
  initializePostcard();
  initalizeTrash();
  initializePostcardItems();
});

function openSendPostcardForm() {
  $(".send-postcard-form").dialog("open");
}
