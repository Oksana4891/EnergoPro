
  // -------------SLIDER------------

  function slides(
    sliderListSelector,
    sliderItemSelector,
    selectorPrev,
    selectorNext
  ) {
    const buttonNext = document.querySelector(selectorNext);
    const buttonPrev = document.querySelector(selectorPrev);
    const sliderItem = document.querySelectorAll(sliderItemSelector);
    const sliderList = document.querySelector(sliderListSelector);
    const total = document.querySelector("#total-slider");
    const current = document.querySelector("#curent-slider");
    let sliderIndex = 1;
    current.textContent = sliderIndex;
    total.textContent = sliderItem.length;

    buttonNext.addEventListener("click", () => {
      moveSliderNext();
    });

    buttonPrev.addEventListener("click", () => {
      moveSliderPrev();
    });

    function moveSliderNext() {
      event.preventDefault();

      if (sliderIndex >= sliderItem.length) {
        return;
      } else {
        let margin = parseInt(
          getComputedStyle(sliderItem[sliderIndex]).marginRight
        )+parseInt(
          getComputedStyle(sliderItem[sliderIndex]).marginLeft
        );
        let translateX = sliderItem[sliderIndex].clientWidth + margin;
        sliderList.style.transform =
          "translateX(-" + translateX * sliderIndex + "px)";
        sliderIndex += 1;
        current.textContent = sliderIndex;
      }
    }

    function moveSliderPrev() {
      event.preventDefault();
      if (sliderIndex <= 1) {
        return;
      } else {
        sliderIndex -= 1;
        let margin = parseInt(
          getComputedStyle(sliderItem[sliderIndex]).marginRight
        )+parseInt(
          getComputedStyle(sliderItem[sliderIndex]).marginLeft
        );
        let translateX = sliderItem[sliderIndex].clientWidth + margin;
        sliderList.style.transform =
          "translateX(-" + (translateX * sliderIndex - translateX) + "px)";
        current.textContent = sliderIndex;
      }
    }
  }

  // -------------LIGHTBOX----------

  function lightbox(itemSelector, modalSelector, modalImageSelector) {
    const items = document.querySelectorAll(itemSelector);
    const modal = document.querySelector(modalSelector);
    const modalImage = document.querySelector(modalImageSelector);

    // Open Modal

    items.forEach((item) => {
      item.addEventListener("click", handleOpenModal);

      function handleOpenModal(event) {
        event.preventDefault();    
        let img=event.currentTarget.firstElementChild;
        if (event.currentTarget === event.target) {
          return;
        } else {
          modal.classList.add("is-open");
          modalImage.alt = img.alt;
          modalImage.src = img.dataset.source;

          window.addEventListener("keydown", handleCloseModalEsc);
          modal.addEventListener("click", handleCloseModalBackground);
        }
      }
    });

    // Close Modal

    function handleCloseModal() {
      modalImage.alt = "";
      modalImage.src = "";
      modal.classList.remove("is-open");
    }

    function handleCloseModalEsc(event) {
      if (event.code === "Escape") {
        handleCloseModal();
      }
    }

    function handleCloseModalBackground(event) {
      if (event.target === modalImage) {
        return;
      }
      handleCloseModal();
      modal.removeEventListener("click", handleCloseModalBackground);
    }
  }


  // ------------FORM-----------------
   
  


  function form() {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input');
    const formFile=document.getElementById("uploade-file");
    const previewFormFile = document.getElementById("uploade-filePreview");

    let uploadImg = document.createElement('img');
       uploadImg.classList.add('file-upload_input--img');
       previewFormFile.appendChild(uploadImg);

     formFile.addEventListener("change", () => { 
       uploadFile(formFile.files[0]);
     });

    function uploadFile(file) {
     
     let reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function(e) {
      uploadImg.classList.add("open");
      uploadImg.src=e.target.result;
      uploadImg.alt="Файл";
      
     };
    }


    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...',
    };


    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(item);

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);
            
            
            function clearInputs() {
                inputs.forEach(item => item.value = '');
            }
            
            



            fetch("../server.php", {
                method: 'POST',
                body: formData
            }).then(data => {
                statusMessage.textContent = message.success;
            }).catch(() => {
                statusMessage.textContent = message.failure;
            }).finally(() => {
                setTimeout(() => {
                    clearInputs();
                    statusMessage.remove();
                    uploadImg.classList.remove("open");

                }, 5000);
            });
        });
    });
}

  slides(".js-sliderList",".js-sliderItem",".js-sliderPrev",".js-sliderNext");
  lightbox(".js-sliderItem", ".js-lightbox", ".lightbox__image");
  form();
