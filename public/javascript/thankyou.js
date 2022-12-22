// get order number from querystring
const getQueryString = window.location.search;
const orderNumbers = getQueryString.split("?number=")[1];

const pageTitleDiv = document.querySelector("#pageTitle");
const orderNumberDiv = document.querySelector("#number");
const siteNameDiv = document.querySelector("#siteName");
const siteAddressDiv = document.querySelector("#siteAddress");
const tripDateDiv = document.querySelector("#tripDate");
const tripTimeDiv = document.querySelector("#tripTime");

orderedMessage();

function orderedMessage(){
    fetch(`/api/order/${orderNumbers}`).then(
        (response) => (response.json()).then(
            (responseData) => {
                if (responseData.error){
                    location.href = "/";
                    return;
                }
                pageTitleDiv.textContent = `訂購資訊如下，請妥善保存，謝謝。`;
                orderNumberDiv.textContent = `訂單編號：${responseData.data.number}`;
                siteNameDiv.textContent = `旅遊景點：${responseData.data.trip.attraction.name}`;
                siteAddressDiv.textContent = `旅遊地址：${responseData.data.trip.attraction.address}`;
                tripDateDiv.textContent = `旅遊日期：${responseData.data.trip.date}`;
                if (responseData.data.trip.time === "morning"){
                    tripTimeDiv.textContent = `旅遊時間：早上9點到下午4點`;
                }else{
                    tripTimeDiv.textContent = `旅遊時間：下午2點到晚上9點`;
                }
                
            }
        )
    )
}