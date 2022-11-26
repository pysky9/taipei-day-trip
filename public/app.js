let isloading = false;
let page = 0;
let url;
let keyword;
let newDiv = document.querySelector(".container");
let foot = document.querySelector(".footer");

const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries){
        if(page == null) return;
        if(entry.isIntersecting){
            if(keyword){
                url = `/api/attractions?page=${page}&keyword=${keyword}`;
                nextPages(url);
            }else{
                if(page === 0){
                    url = `/api/attractions?page=${page}`;
                    nextPages(url);
                }
                else if(page){
                    url = `/api/attractions?page=${page}`;
                    nextPages(url);
                }
            }
        }
    }
},{threshold: 1});

observer.observe(foot);

let nextPages = function(url){
    if(isloading) return;
    isloading = true;
    fetch(url).then(function(response){
        return response.json();}
    ).then(function(data){
        let siteData = data["data"];
        if(siteData.length == 0){
            let errDiv = document.createElement("div");
            errDiv.className = "err";
            errDiv.style.display = "block";
            errDiv.innerText = "查無此關鍵字"; 
            newDiv.appendChild(errDiv);
        }else if (document.querySelector(".err")){
            document.querySelector(".err").style.display = "none";
        }
        for(let i = 0; i < siteData.length; i++){
            let siteInfoDiv = document.createElement("div");
            siteInfoDiv.className = "siteinfo";

            let siteDiv = document.createElement("div");
            siteDiv.className = "site";
            let sitePicDiv = document.createElement("img");
            sitePicDiv.className = "sitePic";
            sitePicDiv.src= siteData[i]["images"][0];
            let siteNameDiv = document.createElement("div");
            siteNameDiv.className = "siteName";
            
            let namespan = document.createElement("span");
            namespan.className = "name";
            namespan.innerText = siteData[i]["name"];
            siteNameDiv.appendChild(namespan);
            siteDiv.appendChild(sitePicDiv)
            siteDiv.appendChild(siteNameDiv);
            siteInfoDiv.appendChild(siteDiv);

            let descriptionDiv = document.createElement("div");
            descriptionDiv.className = "description";
            let mrtspan = document.createElement("span");
            mrtspan.className = "mrt";
            mrtspan.innerText = siteData[i]["mrt"];
            descriptionDiv.appendChild(mrtspan);
            let catspan = document.createElement("span");
            catspan.className = "cat";
            catspan.innerText = siteData[i]["category"];
            descriptionDiv.appendChild(catspan);
            siteInfoDiv.appendChild(descriptionDiv);
            newDiv.appendChild(siteInfoDiv)
        }
        page = data["nextPage"];

        isloading = false;
    })
};

function category(){
    fetch("/api/categories").then(
        function(response){return response.json();}
    ).then(function(data){
        let category = data["data"];
        let itemcontainerDiv = document.createElement("div");
        itemcontainerDiv.className = "itemsContainer";
        let newDiv = document.createElement("div");
        newDiv.id = "itemContainer"
        newDiv.className = "dropdownContent"
        for(let i = 0; i < category.length; i++){
            let itemDiv = document.createElement("div");
            itemDiv.className = "selectItem";
            itemDiv.innerText = category[i];
            newDiv.appendChild(itemDiv);

            function choose(evt){
                let elem = document.querySelector(".inputBar");
                elem.value = itemDiv.textContent;

                let elemMenu = document.querySelector(".itemsContainer");
                elemMenu.style.display="none";
            }
            itemDiv.addEventListener("click", choose);
        }
        itemcontainerDiv.appendChild(newDiv);
        let searchElem = document.querySelector(".search");
        searchElem.insertAdjacentElement("afterend", itemcontainerDiv);
    });

}
category()

function showMenu(){
    let elem = document.querySelector(".itemsContainer");
    elem.style.display="block";
}

function overMenu(){
    let elem = document.querySelector(".itemsContainer");
    elem.style.display="none";
}

function search(){
    page = 0;
    let inputElement = document.querySelector(".inputBar");
    keyword = inputElement.value;
    if(keyword=="其他"){
        keyword = "其  他"
    };

    if(!keyword){
        let errDiv = document.createElement("div");
        newDiv.innerHTML = "";
        errDiv.className = "err";
        errDiv.style.display = "block";
        errDiv.innerText = "請輸入關鍵字，謝謝。"; 
        newDiv.appendChild(errDiv);
        return;
    };

    url = `/api/attractions?page=0&keyword=${keyword}`;
    newDiv.innerHTML = "";
    nextPages(url);
}