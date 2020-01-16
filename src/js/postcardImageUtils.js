"use strict";

function getPostcardCanvas() {
  return html2canvas(document.querySelector("#postcard"));
}

function downloadPostcardImage() {
  getPostcardCanvas().then(function(canvas) {
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 1);
    a.download = "postcard";
    a.click();
  });
}

function sendPostcardImage() {
  var to = document.getElementById("to-input-field").value;
  var subject = document.getElementById("subject-input-field").value;
  var body = document.getElementById("body-input-field").value;

  getPostcardCanvas().then(function(canvas) {
    var image = canvas.toDataURL("image/jpeg", 1).split(",")[1];

    $.ajax({
      url: "https://api.imgur.com/3/image",
      type: "post",
      headers: {
        Authorization: "Client-ID 7db64ffaba81d4b"
      },
      data: {
        image: image
      },
      dataType: "json",
      success: function success(response) {
        if (response.success) {
          Email.send({
            SecureToken: "bcfaa3c4-931a-494c-b764-a8e8129ca254",
            To: to,
            From: "sergienkoanastasiia@gmail.com",
            Subject: subject,
            Body: body,
            Attachments: [
              {
                name: "postcard.jpeg",
                path: response.data.link
              }
            ]
          });
        }
      }
    });
  });
}
