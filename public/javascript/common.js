
const loginBtnStatus = document.querySelector("#loginBtnStatus");
const memberContainer = document.querySelector(".memberContainer");
const memberTitle = document.querySelector(".memberTitle");
const memberBoxUsername = document.querySelector(".memberBoxUsername");
const memberBtn = document.querySelector(".memberBtn");
const memberStatus = document.querySelector(".memberStatus");
const names = document.querySelector("#names");
const emails = document.querySelector("#emails");
const passwords = document.querySelector("#passwords")

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
    if(memberStatus.textContent === "已經有帳戶?點此登入"){
        memberContainer.style.height = "265px";
        memberContainer.style.top = "210px";
        memberTitle.textContent = "登入會員帳號";
        memberBoxUsername.style.display = "none";
        memberBtn.textContent = "登入帳戶";
        memberStatus.textContent = "還沒有帳戶?點此註冊";
    }else{
        memberContainer.style.height = "322px";
        memberContainer.style.top = "238px";
        memberTitle.textContent = "註冊會員帳號";
        memberBoxUsername.style.display = "block";
        memberBtn.textContent = "註冊新帳戶";
        memberStatus.textContent = "已經有帳戶?點此登入";
    }

})

function clicked(){
    const btnInfo = document.querySelector("#btnInfo");
    if(btnInfo.textContent === "登入帳戶"){
        login();
    }else{
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
        let infoElem = document.createElement("div");
        if(data.ok){
            infoElem.textContent = "登入成功";
            location.reload();
        }else if(data.error){
            infoElem.textContent = `${data.message}`;
        }
        infoElem.style.padding = "5px";
        memberBtn.insertAdjacentElement("afterend", infoElem);
        memberContainer.style.height = "295px";
        memberContainer.style.top = "225px";
        emails.addEventListener("click", function(event){
            infoElem.remove();
            names.value = "";
            emails.value = "";
            passwords.value = "";
            memberContainer.style.height = "265px";
            memberContainer.style.top = "210px";
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
        let infoElem = document.createElement("div");
        if(data.ok){
            infoElem.textContent = "註冊成功，請登入";
        }else if (data.error){
            infoElem.textContent = `${data.message}`;
        }
        infoElem.style.padding = "5px";
        memberBtn.insertAdjacentElement("afterend", infoElem);
        memberContainer.style.height = "362px";
        memberContainer.style.top = "258px";
        memberBoxUsername.addEventListener("click", function(event){
            infoElem.remove();
            names.value = "";
            emails.value = "";
            passwords.value = "";
            memberContainer.style.height = "322px";
            memberContainer.style.top = "238px";
        });
    })
}

function checkLoginStatus(){
    fetch("/api/user/auth").then(function(response){
        return response.json();
    }).then(function(result){
        if(result.data){
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
