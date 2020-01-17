"use strict";

function initializeSidebarButton() {
  $(".sidebar-button").click(function () {
    $(".sidebar").toggleClass("sidebar_opened");
    $(this).toggleClass("sidebar-button_opened");
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
    revertDuration: 0,
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

        $(clonedItemId)
          .css({
            "left": position.left,
            "top": position.top,
            "position": "absolute",
            "width": ui.helper.css("width"),
            "margin": ui.helper.css("margin")
          })
          .removeClass("cloneable-item")
          .addClass("cloned-item")
          .draggable({
            stack: ".cloned-item",
            cursor: "move",
            scroll: false,
            revert: function (isValid) {
              if (!isValid) {
                $(clonedItemId + "_nw-control").css({
                  "left": (parseInt(position.left) - 25) + "px",
                  "top": (parseInt(position.top) - 25) + "px",
                })
              }

              return !isValid;
            },
            revertDuration: 0,
            drag: function (_event, ui) {
              var _position = ui.offset;

              $(clonedItemId + "_nw-control").css({
                "left": (parseInt(_position.left) - 25) + "px",
                "top": (parseInt(_position.top) - 25) + "px",
              })
            }
          });

        $("<div id=\"cloned-item_" + clonedItemCounter + "_nw-control\"></div>")
          .css({
            "left": (parseInt(position.left) - 25) + "px",
            "top": (parseInt(position.top) - 25) + "px",
            "position": "absolute",
            "width": "50px",
            "height": "50px",
            "background": "url(\"./images/move.svg\") center no-repeat, lightgray",
            "display": "none",
            "z-index": "99999"
          })
          .insertAfter(clonedItemId);

        $(clonedItemId).hover(function () {
          $(clonedItemId + "_nw-control").css({
            "display": "block"
          });
        }, function () {
          $(clonedItemId + "_nw-control").css({
            "display": "none"
          });
        });

        $(clonedItemId + "_nw-control")
          .hover(function () {
            $(this).css({
              "display": "block",
            });
          }, function () {
            $(this).css({
              "display": "none"
            });
          })
          .click(function () {
            if ($(clonedItemId).hasClass("ui-draggable")) {
              $(clonedItemId).draggable("destroy");

              $(clonedItemId).resizable({
                aspectRatio: true,
                autoHide: true,
                containment: "parent",
                handles: "n, e, s, w, ne, se, sw"
              });

              $(clonedItemId + "_nw-control").css({
                "background-image": "url(\"./images/resize.svg\")"
              });
            } else if ($(clonedItemId).hasClass("ui-resizable")) {
              $(clonedItemId).resizable("destroy");

              var left = $(clonedItemId).css("left");
              var top = $(clonedItemId).css("top");

              $(clonedItemId).draggable({
                stack: ".cloned-item",
                cursor: "move",
                scroll: false,
                revert: function (isValid) {
                  if (!isValid) {
                    $(clonedItemId + "_nw-control").css({
                      "left": (parseInt(left) - 25) + "px",
                      "top": (parseInt(top) - 25) + "px",
                    })
                  }

                  return !isValid;
                },
                revertDuration: 0,
                drag: function (_event, ui) {
                  var __position = ui.offset;

                  $(clonedItemId + "_nw-control").css({
                    "left": (parseInt(__position.left) - 25) + "px",
                    "top": (parseInt(__position.top) - 25) + "px",
                  })
                }
              });

              $(clonedItemId + "_nw-control").css({
                "background-image": "url(\"./images/move.svg\")"
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
      $("#" + ui.draggable.attr("id") + "_nw-control").remove();
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
