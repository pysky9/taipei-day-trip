let isloading = false;
let page = 0;
let url;
let keyword;
const newDiv = document.querySelector(".container");
const foot = document.querySelector(".footer");


const observer = new IntersectionObserver((entries)=>{
    if (entries[0].isIntersecting){
        if(page == null) return;
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
}},{threshold: 1});

observer.observe(foot);

let nextPages = function(url){
    if(isloading) return;
    isloading = true;
    fetch(url).then(function(response){
        return response.json();}
    ).then(function(data){
        let siteData = data["data"];
        if(siteData.length == 0){
            const errDiv = document.createElement("div");
            errDiv.className = "err";
            errDiv.style.display = "block";
            errDiv.innerText = "查無此關鍵字"; 
            newDiv.appendChild(errDiv);
        }else if (document.querySelector(".err")){
            document.querySelector(".err").style.display = "none";
        }
        for(let i = 0; i < siteData.length; i++){
            const siteInfoDiv = document.createElement("div");
            siteInfoDiv.className = "siteinfo";

            const siteDiv = document.createElement("div");
            siteDiv.className = "site";
            const sitePicDiv = document.createElement("img");
            sitePicDiv.className = "sitePic";
            sitePicDiv.src= siteData[i]["images"][0];
            const siteNameDiv = document.createElement("div");
            siteNameDiv.className = "siteName";
            
            const namespan = document.createElement("span");
            namespan.className = "name";
            namespan.innerText = siteData[i]["name"];
            siteNameDiv.appendChild(namespan);
            siteDiv.appendChild(sitePicDiv)
            siteDiv.appendChild(siteNameDiv);
            siteInfoDiv.appendChild(siteDiv);

            const descriptionDiv = document.createElement("div");
            descriptionDiv.className = "description";
            const mrtspan = document.createElement("span");
            mrtspan.className = "mrt";
            mrtspan.innerText = siteData[i]["mrt"];
            descriptionDiv.appendChild(mrtspan);
            const catspan = document.createElement("span");
            catspan.className = "cat";
            catspan.innerText = siteData[i]["category"];
            descriptionDiv.appendChild(catspan);
            siteInfoDiv.appendChild(descriptionDiv);

            // 點擊景點 跳到attraction頁面
            siteInfoDiv.addEventListener('click', function(evt){
                location.href = `/attraction/${siteData[i]["id"]}`;
            })

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
        const itemcontainerDiv = document.createElement("div");
        itemcontainerDiv.className = "itemsContainer";
        const newDiv = document.createElement("div");
        newDiv.id = "itemContainer"
        newDiv.className = "dropdownContent"
        for(let i = 0; i < category.length; i++){
            const itemDiv = document.createElement("div");
            itemDiv.className = "selectItem";
            itemDiv.innerText = category[i];
            newDiv.appendChild(itemDiv);

            function choose(evt){
                const elem = document.querySelector(".inputBar");
                elem.value = itemDiv.textContent;

                const elemMenu = document.querySelector(".itemsContainer");
                elemMenu.style.display="none";
            }
            itemDiv.addEventListener("click", choose);
        }
        itemcontainerDiv.appendChild(newDiv);
        const searchElem = document.querySelector(".search");
        searchElem.insertAdjacentElement("afterend", itemcontainerDiv);
    });

}
category()

function showMenu(){
    const elem = document.querySelector(".itemsContainer");
    const overlapping = document.querySelector(".overlapping");
    elem.style.display="block";
    overlapping.style.zIndex = "2";
}

function overMenu(){
    const elem = document.querySelector(".itemsContainer");
    const overlapping = document.querySelector(".overlapping");
    elem.style.display="none";
    overlapping.style.zIndex = "0";
}

function search(){
    page = 0;
    const inputElement = document.querySelector(".inputBar");
    keyword = inputElement.value;
    if(keyword=="其他"){
        keyword = "其  他"
    };

    if(!keyword){
        const errDiv = document.createElement("div");
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