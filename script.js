const constraints = {
  video: {width: { exact: 320 }, pan: true, tilt: true, zoom: true}
};
var videoTag = document.getElementById('video-tag');
var imageTag = document.getElementById('image-tag');
var panSlider = document.getElementById("pan-slider");
var panSliderValue = document.getElementById("pan-slider-value");
var tiltSlider = document.getElementById("tilt-slider");
var tiltSliderValue = document.getElementById("tilt-slider-value");
var zoomSlider = document.getElementById("zoom-slider");
var zoomSliderValue = document.getElementById("zoom-slider-value");
var imageCapturer;

function start() {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMedia)
    .catch(e => { console.error('getUserMedia() failed: ', e); });
}

function gotMedia(mediastream) {
  videoTag.srcObject = mediastream;
  document.getElementById('start').disabled = true;
  
  var videoTrack = mediastream.getVideoTracks()[0];
  imageCapturer = new ImageCapture(videoTrack);

  // Timeout needed in Chrome, see https://crbug.com/711524
  setTimeout(() => {
    const capabilities = videoTrack.getCapabilities()
    const settings = videoTrack.getSettings();

    videoTrack.applyConstraints({advanced: [{fill: "flash"}]});
    
    // Check whether pan is supported or not.
    if (capabilities.pan) {
      // Map pan to a slider element.
      panSlider.min = capabilities.pan.min;
      panSlider.max = capabilities.pan.max;
      panSlider.step = capabilities.pan.step;
      panSlider.value = settings.pan;
      panSlider.oninput = function(event) {
        panSliderValue.value = panSlider.value;
        videoTrack.applyConstraints({advanced: [{pan: event.target.value}]});
      };
      panSlider.parentElement.hidden = false;
    }

    // Check whether tilt is supported or not.
    if (capabilities.tilt) {
      // Map tilt to a slider element.
      tiltSlider.min = capabilities.tilt.min;
      tiltSlider.max = capabilities.tilt.max;
      tiltSlider.step = capabilities.tilt.step;
      tiltSlider.value = settings.tilt;
      tiltSlider.oninput = function(event) {
        tiltSliderValue.value = tiltSlider.value;
        videoTrack.applyConstraints({advanced: [{tilt: event.target.value}]});
      };
      tiltSlider.parentElement.hidden = false;
    }

    // Check whether zoom is supported or not.
    if (capabilities.zoom) {
      // Map zoom to a slider element.
      zoomSlider.min = capabilities.zoom.min;
      zoomSlider.max = capabilities.zoom.max;
      zoomSlider.step = capabilities.zoom.step;
      zoomSlider.value = settings.zoom;
      zoomSlider.oninput = function(event) {
        zoomSliderValue.value = zoomSlider.value;
        videoTrack.applyConstraints({advanced: [{zoom: event.target.value}]});
      };
      zoomSlider.parentElement.hidden = false;
    }
  }, 500);
  
}

function takePhoto() {
  imageCapturer.takePhoto()
    .then((blob) => {
      console.log("Photo taken: " + blob.type + ", " + blob.size + "B")
      imageTag.src = URL.createObjectURL(blob);
    })
    .catch((err) => { 
      console.error("takePhoto() failed: ", e);
    });
}
