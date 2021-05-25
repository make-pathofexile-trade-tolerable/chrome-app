
const whisperInstant = (evt) => {
  // get whisper btn
  let whisperBtn = evt.path[1].querySelector("button.btn.btn-default.whisper-btn");
  whisperBtn.click();

  // copy from clipboard to get text
  navigator.permissions.query({ name: "clipboard-read" }).then(result => {
    // If permission to read the clipboard is granted or if the user will
    // be prompted to allow it, we proceed.

    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.readText().then(text => {
        // make call to our "whisper-proxy" w/ encrypted text:
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:11011");
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.onreadystatechange = function () {
          if (this.readyState == XMLHttpRequest.DONE && this.status === 200) {
            console.log("sent!", text);
          }
        }
        xhr.send(text);
      });
    }
  });
}

const start = () => {
  document.querySelector(".results").addEventListener("DOMNodeInserted", element => {

    // only thing i care about rn
    if (element.relatedNode.className == "resultset") {

      let btns = element.relatedNode.querySelector(".right .details .btns .pull-left");
      let whisperBtnInstant = document.createElement('button');
      whisperBtnInstant.classList = "btn btn-default whisper-btn-instant";
      whisperBtnInstant.onclick = (evt) => {
        whisperInstant(evt);
      };
      whisperBtnInstant.innerText = "Whisper (instant)";

      if (btns) {

        if (!btns.querySelector("button.whisper-btn-instant"))
          btns.insertBefore(whisperBtnInstant, btns.querySelector("a"));

      } else {
        //console.log("no btns?"); 
      }
    }
  });
}

refreshInterval = setInterval(() => {
  if (document.querySelector(".results")) {
    clearInterval(refreshInterval);
    start();
  } else {
    console.log("not yet");
  }
}, 10);