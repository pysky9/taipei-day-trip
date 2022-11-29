let fee = document.querySelector(".fee");
let carouselName = document.querySelector(".carouselName");
let carouselCategory = document.querySelector(".carouselCategory");
let carouselMrt = document.querySelector(".carouselMrt");
let siteDetail = document.querySelector(".siteDetail");
let address = document.querySelector(".address");
let mrtInfo = document.querySelector(".mrtInfo");
let pathName = window.location.pathname;
let url = `/api${pathName}`;
let clickPage = 0;
let right = document.querySelector(".leftArrow");
let left = document.querySelector(".rightArrow");

function getData(){
    fetch(url).then(function(response){
        return response.json();
    }).then(function(data){
        let siteData = data["data"];
        carouselName.textContent = siteData["name"];
        carouselCategory.textContent = siteData["category"];
        carouselMrt.textContent = siteData["mrt"];
        siteDetail.textContent = siteData["description"];
        address.textContent = siteData["address"];
        mrtInfo.textContent = siteData["transport"];

        let images = siteData["images"];
        let leftArrow = document.querySelector(".leftArrow")
        let rightArrow = document.querySelector(".rightArrow");
        let dotContainer = document.createElement("div");
        dotContainer.className = "dotCircle";
        for (let i = 0; i < images.length; i++){
            let imgElement = document.createElement("img");
            imgElement.className = "carouselPic";
            if(i > 0){
                imgElement.style.display = "none";
            }else{imgElement.style.display = "block";}
            imgElement.src = images[i];
            leftArrow.insertAdjacentElement("beforebegin",imgElement)

            let dotElement = document.createElement("span");
            dotElement.className = "dot";
            if(i > 0){
                dotElement.style.backgroundColor = "#FFFFFF";
            }else{
                dotElement.style.backgroundColor = "#000000";
            }
            dotContainer.appendChild(dotElement);
            rightArrow.insertAdjacentElement("afterend", dotContainer);
        }
    })
}
getData();

right.addEventListener("click",function(){
    let imageRoll = document.querySelectorAll(".carouselPic");
    let dotRoll = document.querySelectorAll(".dot");
    imageRoll[clickPage].style.display = "none";
    dotRoll[clickPage].style.backgroundColor = "#FFFFFF";
    clickPage++;
    if(clickPage < imageRoll.length){
        imageRoll[clickPage].style.display = "block";
        dotRoll[clickPage].style.backgroundColor = "#000000";
    }else{
        clickPage = 0;
        imageRoll[clickPage].style.display = "block";
        dotRoll[clickPage].style.backgroundColor = "#000000";
    }
})

left.addEventListener("click", function(){
    let imageRoll = document.querySelectorAll(".carouselPic");
    let dotRoll = document.querySelectorAll(".dot");
    let imageLength = imageRoll.length
    imageRoll[clickPage].style.display = "none";
    dotRoll[clickPage].style.backgroundColor = "#FFFFFF";
    clickPage = clickPage - 1;
    if(clickPage < 0){
        clickPage = imageLength - 1;
        imageRoll[clickPage].style.display = "block";
        dotRoll[clickPage].style.backgroundColor = "#000000";
    }else{
        imageRoll[clickPage].style.display = "block";
        dotRoll[clickPage].style.backgroundColor = "#000000";
    }
})

function morning(){
    fee.textContent = "新台幣2000元";
}

function afternoon(){
    fee.textContent = "新台幣2500元";
}