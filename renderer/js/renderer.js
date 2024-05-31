// copy the contents of various aspects of the HTML into variables within the renderer process
const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

function loadImage(e) {
  const file = e.target.files[0];

  // runs isFileImage to verify file is of a proper type
  if (!isFileImage(file)) {
    console.error("Please select an image!");
    return;
  }

  console.log("success");

  // form is normally set to hidden, this displays the form by changing it's style to block
  form.style.display = "block";
  filename.innerText = file.name;
}

// verifies if image is of proper type.
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];

  console.log(file["type"]);
  // boolean, file exists & acceptedImageTypes includes the correct type of image mime type
  return file && acceptedImageTypes.includes(file["type"]);
}

// whenever img changes within the DOM, call loadImage
img.addEventListener("change", loadImage);
