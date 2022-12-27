// import noBookingPage from "./javascript/booking.js";
const loginBtnStatus = document.querySelector("#loginBtnStatus");
const memberContainer = document.querySelector(".memberContainer");
const memberTitle = document.querySelector(".memberTitle");
const memberBoxUsername = document.querySelector(".memberBoxUsername");
const memberBtn = document.querySelector(".memberBtn");
const memberStatus = document.querySelector(".memberStatus");
const names = document.querySelector("#names");
const emails = document.querySelector("#emails");
const passwords = document.querySelector("#passwords");
const bookingTrip = document.querySelector("#bookingTrip");

loginBtnStatus.addEventListener("click", function(event){
    let userStatus = loginBtnStatus.textContent;
    if (userStatus === "登入/註冊"){
        clickLogin();
    }else{
        logout();
    }
})

function clickLogin(){
    const member = document.querySelector(".memberblock");
    member.style.display = "block";
    memberContainer.style.display = "block";
}

function loginDisapear(){
    const member = document.querySelector(".memberblock");
    const memberContainer = document.querySelector(".memberContainer");
    member.style.display = "none";
    memberContainer.style.display = "none";
    location.reload(); // 關閉跳脫視窗後 重新整理頁面
}

memberStatus.addEventListener("click", function(event){
    const errorInfoElem = document.querySelector(".erriInfo");
    if (errorInfoElem){
        errorInfoElem.remove();
    }
    if(memberStatus.textContent === "已經有帳戶?點此登入"){
        memberContainer.style.height = "285px";
        memberContainer.style.top = "220px";
        memberTitle.textContent = "登入會員帳號";
        memberBoxUsername.style.display = "none";
        memberBtn.textContent = "登入帳戶";
        memberStatus.textContent = "還沒有帳戶?點此註冊";
    }else{
        memberContainer.style.height = "342px";
        memberContainer.style.top = "249px";
        memberTitle.textContent = "註冊會員帳號";
        memberBoxUsername.style.display = "block";
        memberBtn.textContent = "註冊新帳戶";
        memberStatus.textContent = "已經有帳戶?點此登入";
    }

})

const btnInfo = document.querySelector("#btnInfo");
function clicked(){
    
    if(btnInfo.textContent === "登入帳戶"){
        login();
    }else if (btnInfo.textContent === "註冊新帳戶"){
        signup();
    }
}

function login(){
    
    fetch("/api/user/auth", {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body:JSON.stringify({
            "email": `${emails.value}`,
            "password": `${passwords.value}`
        })
    }).then(function(response){
        return response.json();
    }).then(function(data){
        const infoElem = document.createElement("div");
        infoElem.className = "erriInfo";
        if(data.ok){
            location.reload();
        }
        else if(data.error){
            infoElem.textContent = `${data.message}`;
        }
        infoElem.style.paddingTop = "5px";
        infoElem.style.marginBottom = "0px";
        memberBtn.insertAdjacentElement("afterend", infoElem);
        memberContainer.style.height = "295px";
        memberContainer.style.top = "225px";
        emails.addEventListener("click", function(event){
            infoElem.remove();
            memberContainer.style.height = "285px";
            memberContainer.style.top = "220px";
        });
        btnInfo.addEventListener("click", function(event){
            infoElem.remove();
            names.value = "";
            emails.value = "";
            passwords.value = "";
        });
    })
};

function signup(){
    fetch(`/api/user`, {
        method: "POST",
        headers:{
            "content-type" : "application/json",
            "Accept": "application/json"
        },
        body:JSON.stringify({
            "name": `${names.value}`,
            "email": `${emails.value}`,
            "password": `${passwords.value}`
        })
    }).then(function(response){
        return response.json();
    }).then(function(data){
        const infoElem = document.createElement("div");
        infoElem.className = "erriInfo";
        if(data.ok){
            infoElem.textContent = "註冊成功，請登入";
        }else if (data.error){
            infoElem.textContent = `${data.message}`;
        }
        infoElem.style.paddingTop = "5px";
        infoElem.style.marginBottom = "0px";
        memberBtn.insertAdjacentElement("afterend", infoElem);
        memberContainer.style.height = "362px";
        memberContainer.style.top = "258px";
        memberBoxUsername.addEventListener("click", function(event){
            infoElem.remove();
            memberContainer.style.height = "342px";
            memberContainer.style.top = "249px";
        });
        btnInfo.addEventListener("click", function(event){
            infoElem.remove();
            names.value = "";
            emails.value = "";
            passwords.value = "";
        });
    })
}


function checkLoginStatus(){
    fetch("/api/user/auth").then(function(response){
        return response.json();
    }).then(function(result){
        if(result.data){
            let userData = result.data;

            loginBtnStatus.textContent = "登出系統";
        }else{
            loginBtnStatus.textContent = "登入/註冊";
        }
    })
}

checkLoginStatus();

function logout(){
    fetch("/api/user/auth",{
        method: "DELETE",
        headers:{
            "content-type" : "application/json",
            "Accept": "application/json"
        }
    }).then(function(response){
        return response.json();
    }).then(function(data){
        if (data.ok){
            location.reload();
        }
    })
}

// nav-bar booking trip
bookingTrip.addEventListener("click", function(event){
    fetch("/api/booking").then(function(response){
        return response.json();
    }).then(function(data){
        if (data.data || data.data === null){
            location.href = "/booking";
        }
        if (data.error){
            clickLogin();
        }
    })
})

function errorMessageBox(message){

    const bodyElem = document.querySelector("body");

    const messageContainer = document.createElement("div");
    messageContainer.className = "messageContainer";
    messageContainer.style.display = "block";

    const messagePrefix = document.createElement("div");
    messagePrefix.className = "messagePrefix";
    messageContainer.appendChild(messagePrefix);

    const closeImg = document.createElement("img");
    closeImg.className = "closeImg";
    closeImg.src = "/image/close.png";
    messageContainer.appendChild(closeImg);

    closeImg.addEventListener("click", function(event){
        messageContainer.style.display = "none";
    })

    const messageContent = document.createElement("div");
    messageContent.className = "messageContent";
    messageContent.textContent = `${message}`;
    messageContainer.appendChild(messageContent);

    bodyElem.insertAdjacentElement("afterend", messageContainer);
}
