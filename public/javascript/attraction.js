const title = document.querySelector("title");
const fee = document.querySelector(".fee");
const carouselName = document.querySelector(".carouselName");
const carouselCategory = document.querySelector(".carouselCategory");
const carouselMrt = document.querySelector(".carouselMrt");
const siteDetail = document.querySelector(".siteDetail");
const address = document.querySelector(".address");
const mrtInfo = document.querySelector(".mrtInfo");
const right = document.querySelector(".leftArrow");
const left = document.querySelector(".rightArrow");

let pathName = window.location.pathname;
let url = `/api${pathName}`;
let clickPage = 0;


function getData(){
    fetch(url).then(function(response){
        return response.json();
    }).then(function(data){
        const siteData = data["data"];
        title.textContent = `台北一日遊 | ${siteData["name"]}`;
        carouselName.textContent = siteData["name"];
        carouselCategory.textContent = siteData["category"];
        carouselMrt.textContent = siteData["mrt"];
        siteDetail.textContent = siteData["description"];
        address.textContent = siteData["address"];
        mrtInfo.textContent = siteData["transport"];

        const leftArrow = document.querySelector(".leftArrow")
        const rightArrow = document.querySelector(".rightArrow");
        const dotContainer = document.createElement("div");
        let images = siteData["images"];
        
        dotContainer.className = "dotCircle";
        for (let i = 0; i < images.length; i++){
            const imgElement = document.createElement("img");
            imgElement.className = "carouselPic";
            if(i > 0){
                imgElement.style.display = "none";
            }else{imgElement.style.display = "block";}
            imgElement.src = images[i];
            leftArrow.insertAdjacentElement("beforebegin",imgElement)

            const dotElement = document.createElement("span");
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
    const imageRoll = document.querySelectorAll(".carouselPic");
    const dotRoll = document.querySelectorAll(".dot");

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
    const imageRoll = document.querySelectorAll(".carouselPic");
    const dotRoll = document.querySelectorAll(".dot");
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
