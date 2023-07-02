function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);

  axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      // Handle the response after successful upload
      console.log('File uploaded:', response.data);
      const fileUrl = response.data.fileUrl;
      // sendFileMessage(fileUrl);
      sendMessage(event,fileUrl);
    })
    .catch(error => {
      // Handle errors during file upload
      console.error('Error uploading file:', error);
    });
}