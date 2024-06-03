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
    alertError("Please select an image!");
    return;
  }

  // image dimensions are not available in this file object so we need to create a new image object
  const image = new Image();

  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
  // creates an image object from url which has width and height attributes
  image.src = URL.createObjectURL(file);
  console.log(file);
  console.log(image);

  // when image has finished loading set values of form fields to width and height of given image
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  console.log("success");

  // form is normally set to hidden, this displays the form by changing it's style to block
  form.style.display = "block";
  filename.innerText = file.name;

  // os is now available because the preload file passed it in
  outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

// verifies if image is of proper type.
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];

  console.log(file["type"]);
  // boolean, file exists & acceptedImageTypes includes the correct type of image mime type
  return file && acceptedImageTypes.includes(file["type"]);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 1000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 1000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

// send image data to main
function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertError("Please upload an image");
    return;
  }

  if (width === "" || height === "") {
    alertError("Please fill in a height and width");
    return;
  }

  // send to main using ipc, options are a JSON with imgPath, width and height
  ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height,
  });

  // catch success msg from main
  ipcRenderer.on("image:done", () => {
    alertSuccess("Image Resized!!");
  });
}

// whenever img changes within the DOM, call loadImage
img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
