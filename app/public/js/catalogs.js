const modalTitle = document.getElementById("formModalLabel");
const form = document.getElementById("form");
const inputTitle = document.getElementById("titleInput");
const inputSubtitle = document.getElementById("subtitleInput");
const inputTexts = document.getElementById("textsInput");
const inputImage = document.getElementById("imageInput");
const inputBtn = document.getElementById("formSubmit");
const preview = document.getElementById("imagePreview");
let modalMode = "input;";

function setModalMode(mode) {
  modalMode = mode;
  modalTitle.innerHTML = "Add Catalog";
}

function showPreview(event) {
  if (event.target.files.length > 0) {
    const src = URL.createObjectURL(event.target.files[0]);
    preview.src = src;
  }
}

inputBtn.addEventListener("click", async () => {
  // console.log(inputTitle.value, inputSubtitle.value, inputTexts.value, inputImage.files[0].name);
  if (modalMode === "input") {
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
  } else {
    const currentUrl = preview.src;
    let imageName;
    if (currentUrl.split(":")[0] === "http") {
      imageName = inputBtn.dataset.oldimage;
      console.log("ya");
    } else {
      imageName = inputImage.files[0].name;
      await fetch("http://localhost:8000/api/catalogs/delimg", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          filename: inputBtn.dataset.oldimage,
        }),
      })
        .then((respond) => respond.json())
        .then(async (respond) => {
          if (respond.delimg_status === "success") {
            const fd = new FormData();
            fd.append("image", inputImage.files[0]);
            await fetch("http://localhost:8000/api/catalogs/upload", {
              method: "POST",
              body: fd,
            })
              .then((respond) => respond.json())
              .then((respond) => console.log(respond));
          }
        });
    }
    // console.log(inputBtn);
    await fetch("http://localhost:8000/api/catalogs/edit", {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id: inputBtn.dataset.id,
        title: inputTitle.value,
        subtitle: inputSubtitle.value,
        texts: inputTexts.value,
        image: imageName,
      }),
    })
      .then((respond) => respond.json())
      .then((respond) => console.log(respond));

    inputTitle.value = "";
    inputSubtitle.value = "";
    inputTexts.value = "";
    inputImage.value = "";
  }
  location.reload();
});

const editButtons = document.querySelectorAll(".btn-edit");
// console.log(editButtons);
editButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    // console.log(button.dataset.id);
    modalMode = "update";
    modalTitle.innerHTML = "Edit Catalog";
    await fetch(`http://localhost:8000/api/catalogs/get/${button.dataset.id}`)
      .then((respond) => respond.json())
      .then((respond) => {
        console.log(respond);
        inputTitle.value = respond.catalog.title;
        inputSubtitle.value = respond.catalog.subtitle;
        inputTexts.value = respond.catalog.texts;
        preview.src = `http://localhost:8000/api/catalogs/image/${respond.catalog.image}`;
        inputBtn.dataset.id = respond.catalog.id;
        inputBtn.dataset.oldimage = respond.catalog.image;
      });
  });
});

const deleteButtons = document.querySelectorAll(".btn-delete");

deleteButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    // console.log(this.dataset.id);
    if (!confirm("Yakin Ingin Menghapus?")) {
      return;
    }
    await fetch(`http://localhost:8000/api/catalogs/get/${button.dataset.id}`)
      .then((respond) => respond.json())
      .then(async (respond) => {
        const id = respond.catalog.id;
        const filename = respond.catalog.image;
        await fetch("http://localhost:8000/api/catalogs/remove", {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            id,
          }),
        })
          .then((resp) => resp.json())
          .then(async (resp) => {
            if (resp.delete_status === "success") {
              await fetch("http://localhost:8000/api/catalogs/delimg", {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                  filename,
                }),
              })
                .then((respo) => respo.json())
                .then((resp) => console.log(resp));
            }
          });
      });
    location.reload();
  });
});
