'use strict';

//primary loading tags
let tagsData = document.querySelector("#categoriesPage");
let tagsCurPage = 1;
let tagsPage = JSON.parse(localStorage.getItem("tags_p" + tagsCurPage))
for (let i = 0; i < tagsPage.page.length; ++i) {
    tagsData.innerHTML +=
        `<div class="category d-flex flex-column align-items-center mx-3">
            <div class="tagImg">
                <img src="img/universalTag.png">
            </div>
            <h4 class="tagName">${tagsPage.page[i].name}</h4>
        </div>`
}
setClickCategoryEvent()

//event - get next page of tags
let buttonNext = document.querySelector("#nextPage")
buttonNext.addEventListener("click", (e) => {
    tagsCurPage++
    let tagsPage = JSON.parse(localStorage.getItem("tags_p" + tagsCurPage))
    if (tagsPage !== null) {
        tagsData.innerHTML = ""
        for (let i = 0; i < tagsPage.page.length; ++i) {
            tagsData.innerHTML +=
                `<div class="category d-flex flex-column align-items-center mx-3">
            <div class="tagImg">
                <img src="img/universalTag.png">
            </div>
            <h4 class="tagName">${tagsPage.page[i].name}</h4>
        </div>`
        }
    } else {
        tagsCurPage--
    }
    setClickCategoryEvent()
})

//event - get pred page of tags
let buttonBefore = document.querySelector("#beforePage")
buttonBefore.addEventListener("click", (e) => {
    if (tagsCurPage > 1) {
        tagsCurPage--
        tagsData.innerHTML = ""
        for (let i = 0; i < tagsPage.page.length; ++i) {
            tagsData.innerHTML +=
                `<div class="category d-flex flex-column align-items-center mx-3">
            <div class="tagImg">
                <img src="img/universalTag.png">
            </div>
            <h4> ${tagsPage.page[i].name}</h4>
        </div>`
        }
    }
    setClickCategoryEvent()
})


//primary loading certificates
let certificatesData = document.querySelector("#certificates");
let certificatePage = 1;
let bePages = true;
//axios.get('http://localhost:8080/api/v1/certificates?pageNumber=' + certificatePage).then(res => {
let certificatesPage = JSON.parse(localStorage.getItem("certificates_p" + certificatePage))
for (let i = 0; i < certificatesPage.page.length; ++i) {
    certificatesData.innerHTML += ` 
        <div class="certificate m-3">
            <div class="certificateImg">
                <img src="img/img_1.png">
            </div>
            <div class="d-flex mx-2 justify-content-between">
                <h4 class="name m-1 align-self-center"> ${certificatesPage.page[i].name}</h4>
                <span class="material-icons md-16 align-self-center">favorite</span>

            </div>
            <div class="d-flex mx-2 justify-content-between">
                <span class="company m-1 align-self-center"> Company </span>
                <span class="duration m-1 align-self-center">
                 Expires in ${certificatesPage.page[i].duration} days </span>
            </div>
            <hr class="dropdown-divider">
            <div class="d-flex justify-content-between mx-2 my-auto">
                <span class="price m-1 align-self-center">$ ${certificatesPage.page[i].price}</span>
                <button button type="button" class="toCartBtn btn btn-sm btn-outline-secondary align-self-center">Add to
                    Cart
                </button>
            </div>
        </div>`
}

// infinity loading of certificates
function loadCertificates() {
    if (isSearch){             // (if not search)!!!
        return
    }
    certificatePage++;
    if (certificatesPage.countOfPages < certificatePage) {
        bePages = false;
    } else {
        // axios.get('http://localhost:8080/api/v1/certificates?pageNumber=' + numPage).then(res => {
        let certificatesPage = JSON.parse(localStorage.getItem("certificates_p" + certificatePage))

        let scrollable = document.querySelector("#certificates");
        let endPos = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop;

        if (endPos === 0 && bePages === true) {
            for (let i = 0; i < certificatesPage.page.length; ++i) {
                certificatesData.innerHTML += `
           <div class="certificate m-3">
            <div class="certificateImg">
                <img src="img/img_1.png">
            </div>
            <div class="d-flex mx-2 justify-content-between">
                <h4 class="name m-1 align-self-center"> ${certificatesPage.page[i].name}</h4>
                <span class="material-icons md-16 align-self-center">favorite</span>

            </div>
            <div class="d-flex mx-2 justify-content-between">
                <span class="company m-1 align-self-center"> Company </span>
                <span class="duration m-1 align-self-center">
                 Expires in ${certificatesPage.page[i].duration} days </span>
            </div>
            <hr class="dropdown-divider">
            <div class="d-flex justify-content-between mx-2 my-auto">
                <span class="price m-1 align-self-center">$ ${certificatesPage.page[i].price}</span>
                <button button type="button" class="toCartBtn btn btn-sm btn-outline-secondary align-self-center">Add to
                    Cart
                </button>
            </div>
        </div>`
            }
        }
    }
};
document.addEventListener('scroll', _.throttle(loadCertificates, 1000));


//Scroll back to top button
let arrowTop = document.getElementById("arrowTop")
arrowTop.onclick = function () {
    window.scrollTo(pageXOffset, 0);
};
function checkHiddenBtn() {
    arrowTop.hidden = (pageYOffset < document.documentElement.clientHeight);
};
window.addEventListener('scroll', _.throttle(checkHiddenBtn, 100))


//Feature to return to the last scroll position on the page
function returnToLastScrollPosition() {
    if (document.scrollTop !== 0) {
        localStorage.setItem("offsetTop", document.scrollingElement.scrollTop);
    }
};
document.addEventListener("scroll", _.throttle(returnToLastScrollPosition, 1000))

window.onload = function () {
    const offset = localStorage.getItem("offsetTop");
    window.scrollTo(0, offset);
};

//setting event for click on category (tag)
function setClickCategoryEvent() {
    let tags = document.querySelectorAll(".category");
    for (let i = 0; i < tags.length; i++) {
        tags[i].onclick = function () {
            const tagValue = tags[i].getElementsByClassName("tagName")[0].innerHTML
            let allCertificates = getAllCertificates();
            let searchResult = searchByTag(tagValue, allCertificates)
            //show result
            repaintCertificates(searchResult)

            isSearch = true
        };
    }
}