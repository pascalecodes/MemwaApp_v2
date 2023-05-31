window.onload = function () {
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const videoBlobInput = document.getElementById('videoBlob')
const doneButton = document.getElementById('done');

doneButton.addEventListener('click', () => {location.reload();});
    let parts =[];
    let mediaRecorder;
    navigator.mediaDevices.getUserMedia({audio:true, video: true}).then(stream => {
        document.getElementById('video').srcObject  = stream;
        document.getElementById('start-btn').onclick = function () {
            document.querySelector('#message').innerText='Recording in progress...';
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start(100);
            startButton.disabled = true;
            stopButton.disabled = false;
            
            mediaRecorder.ondataavailable = function (e) {
                if(e.data && e.data.size > 0){
                    parts.push(e.data);
                }
            }
        }
    })
     let uploadForm = document.getElementById('uploadForm')
    document.getElementById('stop-btn').onclick = function (){
        document.querySelector('#message').innerText='Recording STOPPED, upload recording to Memwa';
        mediaRecorder.onstop = (event) => {
            console.log('Recoorder stopped:', event)
            uploadForm.style.display = 'block';
            document.getElementById('uploadForm').addEventListener('submit', uploadVideo)
            }
        mediaRecorder.stop(100);
        startButton.disabled = false;
        stopButton.disabled = true;
    
        let vidSave = document.getElementById('vid2')
        const a = document.createElement('a');
   
        async function uploadVideo(e) {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const blob = new Blob(parts, { type: 'video/webm' });
            let fileName = document.getElementById('title').value
            console.log(fileName)
            formData.set('videoBlob', blob, `${fileName}.webm`);
            
            // Set the value of the videoBlobInput field
            videoBlobInput.value = `${fileName}.webm`;
            const  url = URL.createObjectURL(blob);

    a.click();
            const response = await fetch('/capture/createPost', {
              method: 'POST',
              body: formData,
              enctype: 'multipart/form-data',
            });
          
            if (response.ok) {
              const data = await response.json();
              uploadForm.style.display = 'none';
              successMessage.style.display = 'block';

              //not  using the url from cloudinary because it adds complexity
              //downloadLink.href = data.media.replace(".mkv", ".mp4").replace("/upload/", "/upload/f_mp4/"); // changed from data.videoUrl
              //downloadLink.href = data.media + "/video/upload/f_mp4/" + data.public_id + ".mp4"
              //const downloadUrl = data.media.replace(".mkv", ".webm").replace("/upload/", "/upload/f_webm/")
              downloadLink.href = url
              document.getElementById('downloadLink').textContent = `${fileName}.webm`;
              document.getElementById('downloadLink').download = `${fileName}.webm`
            // console.log('dataURL', data.media)
          
            // console.log('fileurl', url)
            // console.log('dataOutput', data)
            }
          }
    }
    
    
}

