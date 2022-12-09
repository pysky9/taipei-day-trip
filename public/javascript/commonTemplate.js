const bodyElem = document.querySelector("body");

navBar()
footer()
loginSignupMenu()

function navBar(){

    const navBarContainer = document.createElement("div");
    navBarContainer.className = "navContainer";

    const navContainer = document.createElement("div");
    navContainer.className = "nav";

    const title = document.createElement("div");
    title.className = "title";
    const titleHref = document.createElement("a");
    titleHref.setAttribute("href", "/");
    titleHref.style.textDecoration = "none";
    titleHref.style.color = "#448899";
    titleHref.textContent = "台北一日遊";
    title.appendChild(titleHref);
    navContainer.appendChild(title);

    const navItemContainer = document.createElement("div");
    navItemContainer.className = "nav-item";
    const bookingSchedule = document.createElement("div");
    bookingSchedule.className = "item";
    bookingSchedule.textContent = "預定行程";
    navItemContainer.appendChild(bookingSchedule);
    const loginSignup = document.createElement("div");
    loginSignup.className = "item";
    loginSignup.id = "loginBtnStatus";
    loginSignup.textContent = "登入/註冊";
    navItemContainer.appendChild(loginSignup);
    navContainer.appendChild(navItemContainer);

    navBarContainer.appendChild(navContainer);

    bodyElem.appendChild(navBarContainer);
}

function footer(){
    const indexLastDiv = document.querySelector(".container");
    const attractionLastDiv = document.querySelector(".trafficInfo")


    const footerContainer = document.createElement("div");
    footerContainer.className = "footer";
    const footerContent = document.createElement("div");
    footerContent.className = "footerContent";
    footerContent.textContent = "COPYRIGHT @ 2022 台北一日遊";
    footerContainer.appendChild(footerContent);

    if (indexLastDiv){
        indexLastDiv.insertAdjacentElement("afterend", footerContainer);
    }else if (attractionLastDiv){
        attractionLastDiv.insertAdjacentElement("afterend", footerContainer);
    }
}

function loginSignupMenu(){
    
    const backgroundGreyPage = document.createElement("div");
    backgroundGreyPage.className = "memberblock";
    backgroundGreyPage.setAttribute("onclick", "loginDisapear();");
    bodyElem.appendChild(backgroundGreyPage);

    const memberContainer = document.createElement("memberContainer");
    memberContainer.className = "memberContainer";

    const memberPrefix = document.createElement("memberPrefix");
    memberPrefix.className = "memberPrefix";
    memberContainer.appendChild(memberPrefix);

    const closeImg = document.createElement("img");
    closeImg.src = "/image/close.png";
    closeImg.className = "closeImg";
    closeImg.setAttribute("onclick", "loginDisapear();");
    memberContainer.appendChild(closeImg);

    const memberTitle = document.createElement("div");
    memberTitle.className = "memberTitle";
    memberTitle.textContent = "登入會員帳號";
    memberContainer.appendChild(memberTitle);

    const memberBoxUsername = document.createElement("div");
    memberBoxUsername.className = "memberBoxUsername";
    const usernameBar = document.createElement("input");
    usernameBar.setAttribute("type", "text");
    usernameBar.setAttribute("name", "name");
    usernameBar.setAttribute("placeholder", "輸入姓名");
    usernameBar.setAttribute("pattern", "[A-Za-z]{3}");
    usernameBar.className = "memberInputBar";
    usernameBar.id = "names";
    memberBoxUsername.appendChild(usernameBar);
    memberContainer.appendChild(memberBoxUsername);

    const emailContainer = document.createElement("div");
    emailContainer.className = "memberBox";
    const emailBar = document.createElement("input");
    emailBar.setAttribute("type", "email");
    emailBar.setAttribute("name", "email");
    emailBar.setAttribute("placeholder", "輸入電子郵件");
    emailBar.setAttribute("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$");
    emailBar.className = "memberInputBar";
    emailBar.id = "emails"
    emailContainer.appendChild(emailBar);
    memberContainer.appendChild(emailContainer);

    const passwordContainer = document.createElement("div");
    passwordContainer.className = "memberBox";
    const passwordBar = document.createElement("input");
    passwordBar.setAttribute("type", "password");
    passwordBar.setAttribute("name", "password");
    passwordBar.setAttribute("placeholder", "輸入密碼");
    passwordBar.setAttribute("pattern", "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}");
    passwordBar.className = "memberInputBar";
    passwordBar.id = "passwords";
    passwordContainer.appendChild(passwordBar);
    memberContainer.appendChild(passwordContainer);

    const memberBtn = document.createElement("button");
    memberBtn.className = "memberBtn";
    memberBtn.id = "btnInfo";
    memberBtn.textContent = "登入帳戶";
    memberBtn.setAttribute("onclick", "clicked();");
    memberContainer.appendChild(memberBtn);

    const memberStatus = document.createElement("div");
    memberStatus.className = "memberStatus";
    memberStatus.textContent = "還沒有帳戶?點此註冊";
    memberContainer.appendChild(memberStatus);

    backgroundGreyPage.insertAdjacentElement("afterend", memberContainer);

}