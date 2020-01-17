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

function initalizeInputTextForms() {
  $(".input-text-form_1st-type").dialog({
    autoOpen: false,
    modal: true,
    height: 170,
    width: 350,
    buttons: {
      "Сохранить": function () {
        if (!$("#text-input-field").val()) {
          alert("Все поля ввода должны быть заполнены!");
          return;
        }

        $(this).dialog("close");
      },
      "Отменить": function () {
        $(this).dialog("close");
      }
    },
    close: function () {
      $("#text-input-field").val("");
    },
    title: "Ввести текст",
    resizable: false,
    position: {
      my: "center",
      at: "center",
      of: document
    }
  });

  $(".input-text-form_2nd-type").dialog({
    autoOpen: false,
    modal: true,
    height: 248,
    width: 350,
    buttons: {
      "Сохранить": function () {
        if (!$("#multiline-text-input-field").val()) {
          alert("Все поля ввода должны быть заполнены!");
          return;
        }

        $(this).dialog("close");
      },
      "Отменить": function () {
        $(this).dialog("close");
      }
    },
    close: function () {
      $("#multiline-text-input-field").val("");
    },
    title: "Ввести текст",
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
      var isLabel = $(clonedItemId).hasClass("label_1st-type") || $(clonedItemId).hasClass("label_2nd-type");

      if ($(clonedItemId).hasClass("cloneable-item")) {
        var stopPosition = ui.offset;

        $(clonedItemId)
          .css({
            "left": stopPosition.left,
            "top": stopPosition.top,
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
                  "left": parseInt(stopPosition.left) + "px",
                  "top": parseInt(stopPosition.top) + "px",
                });

                if (isLabel) {
                  $(clonedItemId + "_ne-control").css({
                    "left": (parseInt(stopPosition.left) + parseInt($(clonedItemId).css("width")) - 50) + "px",
                    "top": parseInt(stopPosition.top) + "px",
                  });
                }
              }

              return !isValid;
            },
            revertDuration: 0,
            drag: function (_event, ui) {
              var dragPosition = ui.offset;

              $(clonedItemId + "_nw-control").css({
                "left": parseInt(dragPosition.left) + "px",
                "top": parseInt(dragPosition.top) + "px",
              });

              if (isLabel) {
                $(clonedItemId + "_ne-control").css({
                  "left": (parseInt(dragPosition.left) + parseInt($(clonedItemId).css("width")) - 50) + "px",
                  "top": parseInt(dragPosition.top) + "px",
                });
              }
            }
          });

        $("<div id=\"cloned-item_" + clonedItemCounter + "_nw-control\"></div>")
          .css({
            "left": parseInt(stopPosition.left) + "px",
            "top": parseInt(stopPosition.top) + "px",
            "position": "absolute",
            "width": "50px",
            "height": "50px",
            "background": "url(\"./images/move.svg\") center no-repeat",
            "background-color": "lightgray",
            "display": "none",
            "z-index": "99999"
          })
          .insertAfter(clonedItemId);

        if (isLabel) {
          $("<div id=\"cloned-item_" + clonedItemCounter + "_ne-control\"></div>")
          .css({
            "left": (parseInt(stopPosition.left) + parseInt($(clonedItemId).css("width")) - 50) + "px",
            "top": parseInt(stopPosition.top) + "px",
            "position": "absolute",
            "width": "50px",
            "height": "50px",
            "background": "url(\"./images/text.svg\") center no-repeat",
            "background-color": "lightgray",
            "display": "none",
            "z-index": "99999"
          })
          .insertAfter(clonedItemId + "_nw-control");
        }

        $(clonedItemId).hover(function () {
          $(clonedItemId + "_nw-control").css({
            "display": "block"
          });

          if (isLabel) {
            $(clonedItemId + "_ne-control").css({
              "display": "block"
            });
          }
        }, function () {
          $(clonedItemId + "_nw-control").css({
            "display": "none"
          });

          if (isLabel) {
            $(clonedItemId + "_ne-control").css({
              "display": "none"
            });
          }
        });

        if (isLabel) {
          $(clonedItemId + "_ne-control")
          .hover(function () {
            $(clonedItemId + "_nw-control").css({
              "display": "block"
            });

            $(this).css({
              "display": "block"
            });
          }, function () {
            $(clonedItemId + "_nw-control").css({
              "display": "none"
            });

            $(this).css({
              "display": "none"
            });
          })
          .click(function () {
            if ($(clonedItemId).hasClass("label_1st-type")) {
              $(".input-text-form_1st-type").dialog("open");
            } else if ($(clonedItemId).hasClass("label_2nd-type")) {
              $(".input-text-form_2nd-type").dialog("open");
            } else {
              // ignore...
            }
          });
        }

        $(clonedItemId + "_nw-control")
          .hover(function () {
            $(this).css({
              "display": "block"
            });

            if (isLabel) {
              $(clonedItemId + "_ne-control").css({
                "display": "block"
              });
            }
          }, function () {
            $(this).css({
              "display": "none"
            });

            if (isLabel) {
              $(clonedItemId + "_ne-control").css({
                "display": "none"
              });
            }
          })
          .click(function () {
            if ($(clonedItemId).hasClass("ui-draggable")) {
              $(clonedItemId).draggable("destroy");

              $(clonedItemId).resizable({
                minWidth: 100,
                minHeight: 100,
                aspectRatio: true,
                containment: "parent",
                handles: "n, e, s, w, se, sw",
                resize: function (_event, ui) {
                  var resizePosition = ui.position;

                  $(clonedItemId + "_nw-control").css({
                    "left": parseInt(resizePosition.left) + "px",
                    "top": parseInt(resizePosition.top) + "px",
                  });

                  if (isLabel) {
                    $(clonedItemId + "_ne-control").css({
                      "left": (parseInt(resizePosition.left) + ui.size.width - 50) + "px",
                      "top": parseInt(resizePosition.top) + "px",
                    });
                  }
                }
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
                      "left": parseInt(left) + "px",
                      "top": parseInt(top) + "px",
                    });

                    if (isLabel) {
                      $(clonedItemId + "_ne-control").css({
                        "left": (parseInt(left) + parseInt($(clonedItemId).css("width")) - 50) + "px",
                        "top": parseInt(top) + "px",
                      });
                    }
                  }

                  return !isValid;
                },
                revertDuration: 0,
                drag: function (_event, ui) {
                  var dragPosition = ui.offset;

                  $(clonedItemId + "_nw-control").css({
                    "left": parseInt(dragPosition.left) + "px",
                    "top": parseInt(dragPosition.top) + "px",
                  });

                  if (isLabel) {
                    $(clonedItemId + "_ne-control").css({
                      "left": (parseInt(dragPosition.left) + parseInt($(clonedItemId).css("width")) - 50) + "px",
                      "top": parseInt(dragPosition.top) + "px",
                    });
                  }
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
      } else {
        droppedItem.draggable("option", "revert", function (isValid) {
          var dropPosition = ui.offset;

          if (!isValid) {
            $("#" + droppedItem.attr("id") + "_nw-control").css({
              "left": parseInt(dropPosition.left) + "px",
              "top": parseInt(dropPosition.top) + "px",
            });

            if (droppedItem.hasClass("label_1st-type") || droppedItem.hasClass("label_2nd-type")) {
              $("#" + droppedItem.attr("id") + "_ne-control").css({
                "left": (parseInt(dropPosition.left) + parseInt($("#" + droppedItem.attr("id")).css("width")) - 50) + "px",
                "top": parseInt(dropPosition.top) + "px",
              });
            }
          }

          return !isValid;
        });
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

      if (ui.draggable.hasClass("label_1st-type") || ui.draggable.hasClass("label_2nd-type")) {
        $("#" + ui.draggable.attr("id") + "_ne-control").remove();
      }

      ui.draggable.remove();
    }
  });
}

$(document).ready(function () {
  initializeSidebarButton();
  initializeColorPicker();
  initializeSendPostcardForm();
  initalizeInputTextForms();
  initializePostcard();
  initalizeTrash();
  initializePostcardItems();
});

function openSendPostcardForm() {
  $(".send-postcard-form").dialog("open");
}
