const modalTitle = document.getElementById("formModalLabel");
const form = document.getElementById("form");
const inputTitle = document.getElementById("titleInput");
const inputSubtitle = document.getElementById("subtitleInput");
const inputTexts = document.getElementById("textsInput");
const inputImage = document.getElementById("imageInput");
const inputBtn = document.getElementById("formSubmit");

function setModalTitle(title) {
  // console.log(modalTitle);
  modalTitle.innerHTML = title;
  // form.action = "http://localhost:8000/api/catalogs/add";
}

function showPreview(event) {
  if (event.target.files.length > 0) {
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.getElementById("imagePreview");
    preview.src = src;
  }
}

inputBtn.addEventListener("click", async () => {
  // console.log(inputTitle.value, inputSubtitle.value, inputTexts.value, inputImage.files[0].name);
  await fetch("http://localhost:8000/api/catalogs/add", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      title: inputTitle.value,
      subtitle: inputSubtitle.value,
      texts: inputTexts.value,
      image: inputImage.files[0].name,
    }),
  })
    .then((respond) => respond.json())
    .then((respond) => console.log(respond));

  const fd = new FormData();
  fd.append("image", inputImage.files[0]);
  await fetch("http://localhost:8000/api/catalogs/upload", {
    method: "POST",
    body: fd,
  })
    .then((respond) => respond.json())
    .then((respond) => console.log(respond));
  inputTitle.value = "";
  inputSubtitle.value = "";
  inputTexts.value = "";
  inputImage.value = "";
  location.reload();
});
