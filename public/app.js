let isloading = false;
let page = 0;
let url;
let keyword;
let newDiv = document.querySelector(".container");
let foot = document.querySelector(".footer");

// 一進入網頁 就對網頁進行監測
const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries){
        // 如果沒有下一頁 不進行監測
        if(page == null) return;
        if(entry.isIntersecting){
            // 判斷有沒有關鍵字
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

// 取得景點資料
let nextPages = function(url){
    // 如果頁面正在fetch資料 暫停動作
    if(isloading) return;
    //如果頁面無fetch動作 就進行fetch 同時把isloading調為true
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
        // 新增12個小容器&景點資訊
        for(let i = 0; i < siteData.length; i++){
            // 新增小容器
            let siteInfoDiv = document.createElement("div");
            siteInfoDiv.className = "siteinfo";

            // 新增圖片區塊
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

            // 新增 description區塊
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
        //判斷是否有下一頁 進行對應的動作
        if (data["nextPage"] == null){
            page = data["nextPage"];
        }else {
            page = data["nextPage"];
        }
        // fetch結束前 將isloading調為false
        isloading = false;
    })
};

// 監聽搜尋欄位keyin
let inputElem = document.querySelector(".inputBar");
function keyin(evt){
    let key = inputElem.value;
    inputElem.setAttribute("value", key);
}
inputElem.addEventListener("keydown", keyin);

// 點搜尋框出現分類選項
function category(){
    fetch("/api/categories").then(
        function(response){return response.json();}
    ).then(function(data){
        let category = data["data"];
        //最外圍的container
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
            // 為每個分類搜尋選項設定事件監控  當使用者點擊選項 透過更改input標籤的value屬性
            // 將分類選項帶入input標籤
            function choose(evt){
                let elem = document.querySelector(".inputBar");
                // 透過setAttribute更改input的value值
                elem.setAttribute("value", category[i])
                // 點擊分類搜尋後 關閉選項清單
                let elemMenu = document.querySelector(".itemsContainer");
                elemMenu.style.display="none";
            }
            //監聽使用者點擊的選項
            itemDiv.addEventListener("click", choose);
        }
        itemcontainerDiv.appendChild(newDiv);
        let searchElem = document.querySelector(".search");
        searchElem.insertAdjacentElement("afterend", itemcontainerDiv);
    });

}
category()

// 點擊搜尋欄展開搜尋分類清單
function showMenu(){
    let elem = document.querySelector(".itemsContainer");
    elem.style.display="block"; //更改.itemsContainer的屬性值
}

// 點擊搜尋欄以外的區域隱藏搜尋分類清單
function overMenu(){
    let elem = document.querySelector(".itemsContainer");
    elem.style.display="none";
}

// 關鍵字搜尋
function search(){
    page = 0;//重設page=0 因page為全域變數 在無限載入時page已不為 0
    let inputElement = document.querySelector(".inputBar");
    keyword = inputElement.value;
    //原始資料為 "其  他"，但在分類API時做移除空白處理 也就是調為"其他" 但會造成用keyword="其他"搜尋失敗
    if(keyword=="其他"){
        keyword = "其  他"
    };
    url = `/api/attractions?page=0&keyword=${keyword}`;
    //把原本景點內容清除 在nextPages()就可將資料新增在景點區域
    newDiv.innerHTML = "";
    nextPages(url);
}
