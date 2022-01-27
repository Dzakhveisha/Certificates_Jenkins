'use strict';

let isSearch = false

//loading tags names into select element
let selectTags = document.getElementById("tagsSelect")
let tagsCurPageSelect = 1;
let tagsPageSelect = JSON.parse(localStorage.getItem("tags_p" + tagsCurPageSelect))
while (tagsPageSelect !== null) {
    for (let i = 0; i < tagsPageSelect.page.length; ++i) {
        selectTags.innerHTML +=
            `<option>${tagsPageSelect.page[i].name}</option>`
    }
    tagsCurPageSelect++
    tagsPageSelect = JSON.parse(localStorage.getItem("tags_p" + tagsCurPageSelect))
}

// search when select was changed
selectTags.onchange = searchByTagAndText

const allTagsValue = document.getElementById("allTags").value

// add event for submit (search)
const searchElement = document.getElementById("searchForm")
searchElement.onsubmit = searchByTagAndText;


function searchByTagAndText() {
    const value = document.getElementById("pageSearch").value.trim()
    const tagValue = selectTags.value
    if (value === "" && tagValue === allTagsValue) { // case when search is for all certificates
        isSearch = false
        location.reload()
    }

    // get all certificates
    let allcertificates = getAllCertificates();
    // filter by tag
    let searchResult = searchByTag(tagValue, allcertificates)
    //filter by text value
    searchResult = filterByNameDescription(searchResult, value)
    //show result
    repaintCertificates(searchResult)

    isSearch = true
    return false;
}


function getAllCertificates() {
    let curPageSearch = 1;
    let pageSearch = JSON.parse(localStorage.getItem("certificates_p" + curPageSearch))
    let allCertificatesArray = [];
    while (pageSearch !== null) {
        allCertificatesArray = allCertificatesArray.concat(pageSearch.page)
        curPageSearch++
        pageSearch = JSON.parse(localStorage.getItem("certificates_p" + curPageSearch))
    }
    return allCertificatesArray
}

function searchByTag(tag, allCertificatesArray) {
    if (tag !== allTagsValue) {
        let result = []
        for (let i = 0; i < allCertificatesArray.length; i++) {
            for (let j = 0; j < allCertificatesArray[i].tags.length; j++) {
                if (allCertificatesArray[i].tags[j].name === tag) {
                    result.push(allCertificatesArray[i])
                }
            }
        }
        return result
    } else {
        return allCertificatesArray
    }
}

function filterByNameDescription(array, value) {
    if (value === "") {
        return array
    }
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (array[i].name.indexOf(value) !== -1 || array[i].description.indexOf(value) !== -1) {
            result.push(array[i])
        }
    }
    return result;
}

function repaintCertificates(searchResult) {
    certificatesData.innerHTML = ""
    if (searchResult.length === 0) {
        certificatesData.innerHTML = `<h5 class="mx-auto">No certificates found :(</h5>`
    }
    searchResult.forEach(function (certificate) {
        certificatesData.innerHTML += ` 
        <div class="certificate m-3">
            <div class="certificateImg">
                <img src="img/img_1.png">
            </div>
            <div class="d-flex mx-2 justify-content-between">
                <h4 class="name m-1 align-self-center"> ${certificate.name}</h4>
                <span class="material-icons md-16 align-self-center">favorite</span>

            </div>
            <div class="d-flex mx-2 justify-content-between">
                <span class="company m-1 align-self-center"> Company </span>
                <span class="duration m-1 align-self-center">
                 Expires in ${certificate.duration} days </span>
            </div>
            <hr class="dropdown-divider">
            <div class="d-flex justify-content-between mx-2 my-auto">
                <span class="price m-1 align-self-center">$ ${certificate.price}</span>
                <button button type="button" class="toCartBtn btn btn-sm btn-outline-secondary align-self-center">Add to
                    Cart
                </button>
            </div>
        </div>`
    })
}