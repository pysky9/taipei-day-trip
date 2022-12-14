let userName;
let email;
let attractionId;
let siteName;
let siteAddress;
let imageURL;
let date;
let fees;
let tripTime;

TPDirect.setupSDK(126889, "app_855EHG5Iev5Bv96GQKHmMpCgiKmUqOObJ1nxz7RBZpVGKugBhFClwz5pS58I", "sandbox");

function getUserData(){
    fetch("/api/user/auth").then(function(response){
        return response.json();
    }).then(function(result){
        if(result.data){
            let userData = result.data;
            userName = userData.name;
            email = userData.email;
        }
        checkBookingStatus();
    })
}

function checkBookingStatus(){
    fetch("/api/booking").then(function(response){
        return response.json();
    }).then(function(bookingResult){

        if (bookingResult.error){
            location.href = "/";
            return;
        }
        if (bookingResult.data == null){
            noBookingPage(userName);
            return;
        }
        let bookingInfo = bookingResult.data;

        let attractionData = bookingInfo.attraction;
        attractionId = attractionData.id;
        siteName = attractionData.name;
        imageURL = attractionData.image;
        siteAddress = attractionData.address;
        date = bookingInfo.date;
        fees = bookingInfo.price;
        tripTime = bookingInfo.time;
        let time;
        if (tripTime === "morning"){
            time = "早上9點到下午4點";
        }else{
            time = "下午2點到晚上9點";
        }
        bookingInfomation(userName, email, siteName, imageURL, date, time, fees, siteAddress);
    })
}

function deleteBooking(){
    fetch("/api/booking", {method: "DELETE"}).then(function(response){
        return response.json();
    }).then(function(data){
        if(data.ok){
            location.reload();
        }
    })
}

function bookingInfomation(userName, email, siteName, imageURL, date, time, fees, siteAddress){
    const bookingUser = document.querySelector(".bookingUser");
    bookingUser.textContent = `您好，${userName}，待預訂的行程如下：`;

    // contain siteImage and booking-trip-information
    const bookingContent = document.querySelector(".bookingContent");
    
    // create site image 
    const bookingImgContainer = document.createElement("div");
    bookingImgContainer.className = "bookingImgContainer";
    const bookingImg = document.createElement("img");
    bookingImg.className = "bookingImg";
    bookingImg.src = imageURL;
    bookingImgContainer.appendChild(bookingImg);
    bookingContent.appendChild(bookingImgContainer);

    // create booking trip information
    const bookingScheduleContainer = document.createElement("div");
    bookingScheduleContainer.className = "bookingScheduleContainer";
    const bookingSite = document.createElement("div");
    bookingSite.className = "bookingSite";
    bookingSite.textContent = `台北一日遊：${siteName}`;
    bookingScheduleContainer.appendChild(bookingSite);
    const bookingDates = document.createElement("div");
    bookingDates.className = "bookingDates";
    bookingDates.textContent = `日期：${date}`;
    bookingScheduleContainer.appendChild(bookingDates);
    const bookingTime = document.createElement("div");
    bookingTime.className = "bookingTime";
    bookingTime.textContent = `時間：${time}`;
    bookingScheduleContainer.appendChild(bookingTime);
    const bookingFees = document.createElement("div");
    bookingFees.className = "bookingFees";
    bookingFees.textContent = `費用：${fees}`
    bookingScheduleContainer.appendChild(bookingFees);
    const bookingAddress = document.createElement("div");
    bookingAddress.className = "bookingAddress";
    bookingAddress.textContent = `地點：${siteAddress}`;
    bookingScheduleContainer.appendChild(bookingAddress);
    const deleteImg = document.createElement("img");
    deleteImg.className = "delete";
    deleteImg.src = "/image/icon_delete.png";
    deleteImg.setAttribute("onclick", "deleteBooking();");
    bookingScheduleContainer.appendChild(deleteImg);
    bookingContent.appendChild(bookingScheduleContainer);

    // divided line
    const dividingLine = document.createElement("div");
    dividingLine.className = "dividingLine"
    const horizonLine = document.createElement("hr");
    dividingLine.appendChild(horizonLine);
    bookingContent.insertAdjacentElement("afterend", dividingLine);

    // create contact-info container
    const memberContactInfomation = document.createElement("div");
    memberContactInfomation.className = "memberContactInfomation";

    const informationTitle = document.createElement("span");
    informationTitle.className = "informationTitle";
    informationTitle.textContent = "您的聯絡資訊";
    memberContactInfomation.appendChild(informationTitle);

    const nameDiv = document.createElement("div");
    nameDiv.className = "contactInfo";
    nameDiv.textContent = "聯絡姓名："
    const nameInputBar = document.createElement("input");
    nameInputBar.className = "InfoBar";
    nameInputBar.value= `${userName}`;
    nameInputBar.setAttribute("type", "name");
    nameInputBar.setAttribute("name", "name");
    nameDiv.appendChild(nameInputBar);
    memberContactInfomation.appendChild(nameDiv);

    const mailDiv = document.createElement("div");
    mailDiv.className = "contactInfo";
    mailDiv.textContent = "連絡信箱：";
    const mailInputBar = document.createElement("input");
    mailInputBar.className = "InfoBar";
    mailInputBar.value = `${email}`;
    mailInputBar.setAttribute("type", "email");
    mailInputBar.setAttribute("name", "email");
    mailDiv.appendChild(mailInputBar);
    memberContactInfomation.appendChild(mailDiv);

    const phoneDiv = document.createElement("div");
    phoneDiv.className = "contactInfo";
    phoneDiv.textContent = "手機號碼：";
    const phoneInputBar = document.createElement("input");
    phoneInputBar.className = "InfoBar";
    phoneInputBar.id = "phone";
    phoneInputBar.setAttribute("type", "tel");
    phoneInputBar.setAttribute("name", "tel");
    phoneDiv.appendChild(phoneInputBar);
    memberContactInfomation.appendChild(phoneDiv);

    const contactReminder = document.createElement("div");
    contactReminder.className = "contactReminder";
    contactReminder.textContent = "請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。";
    memberContactInfomation.appendChild(contactReminder);

    dividingLine.insertAdjacentElement("afterend", memberContactInfomation);

    // divided line 2
    const dividingLine2 = document.createElement("div");
    dividingLine2.className = "dividingLine"
    const horizonLine2 = document.createElement("hr");
    dividingLine2.appendChild(horizonLine2);
    memberContactInfomation.insertAdjacentElement("afterend", dividingLine2);

    // create credit card infomation container
    const creditcardInfomation = document.createElement("div");
    creditcardInfomation.className = "creditcardInfomation";

    const creditcardTitle = document.createElement("div");
    creditcardTitle.className = "creditcardTitle";
    creditcardTitle.textContent = "您的付款資訊";
    creditcardInfomation.appendChild(creditcardTitle);

    const cardNumber = document.createElement("div");
    cardNumber.className = "creditInfo";
    cardNumber.textContent = "卡片號碼：";
    const cardNumberInputBar = document.createElement("div");
    cardNumberInputBar.className = "tpfield";
    cardNumberInputBar.id = "card-number";
    cardNumber.appendChild(cardNumberInputBar);
    creditcardInfomation.appendChild(cardNumber);

    const cardExpireTime = document.createElement("div");
    cardExpireTime.className = "creditInfo";
    cardExpireTime.textContent = "逾期時間：";
    const cardExpireTimeInputBar = document.createElement("div");
    cardExpireTimeInputBar.className = "tpfield";
    cardExpireTimeInputBar.id = "card-expiration-date";
    cardExpireTime.appendChild(cardExpireTimeInputBar);
    creditcardInfomation.appendChild(cardExpireTime);

    const cardSecurityCode = document.createElement("div");
    cardSecurityCode.className = "creditInfo";
    cardSecurityCode.textContent = "驗證密碼：";
    const cardSecurityCodeInputBar = document.createElement("div");
    cardSecurityCodeInputBar.className = "tpfield";
    cardSecurityCodeInputBar.id = "card-ccv";
    cardSecurityCode.appendChild(cardSecurityCodeInputBar);
    creditcardInfomation.appendChild(cardSecurityCode);

    dividingLine2.insertAdjacentElement("afterend", creditcardInfomation);

    // divided line 3
    const dividingLine3 = document.createElement("div");
    dividingLine3.className = "dividingLine"
    const horizonLine3 = document.createElement("hr");
    dividingLine3.appendChild(horizonLine3);
    creditcardInfomation.insertAdjacentElement("afterend", dividingLine3);

    //  create order button container
    const priceAndOrder = document.createElement("div");
    priceAndOrder.className = "priceAndOrder";

    const totalPrice = document.createElement("div");
    totalPrice.className = "totalPrice";
    totalPrice.textContent = `總價：新台幣${fees}元`;
    priceAndOrder.appendChild(totalPrice);

    const orderBtn = document.createElement("button");
    orderBtn.className = "orderBtn";
    orderBtn.textContent = "確認訂購並付款";
    priceAndOrder.appendChild(orderBtn);

    dividingLine3.insertAdjacentElement("afterend", priceAndOrder);

    // create footer 
    const footerContainer = document.createElement("div");
    footerContainer.className = "footer";
    const footerContent = document.createElement("div");
    footerContent.className = "footerContent";
    footerContent.textContent = "COPYRIGHT @ 2022 台北一日遊";
    footerContainer.appendChild(footerContent);
    priceAndOrder.insertAdjacentElement("afterend", footerContainer);

    //--- 金流  ---//
    TPDirectCardSetup();
    TPDirect.ccv.setupCardType(TPDirect.CardType.VISA);
    TPDirect.ccv.setupCardType(TPDirect.CardType.JCB);
    TPDirect.ccv.setupCardType(TPDirect.CardType.AMEX);
    TPDirect.ccv.setupCardType(TPDirect.CardType.MASTERCARD);
    TPDirect.ccv.setupCardType(TPDirect.CardType.UNIONPAY);
    TPDirect.ccv.setupCardType(TPDirect.CardType.UNKNOWN);

    orderBtn.addEventListener("click",orderSubmit);

}

// -- 使用者沒有預定 動態顯示畫面 -- //
function noBookingPage(userName){
    const bookingUser = document.querySelector(".bookingUser");
    bookingUser.textContent = `您好，${userName}，待預訂的行程如下：`;
    bookingUser.style.height = "50px";
    bookingUser.style.marginBottom = "80px";
    const describeTitle = document.createElement("div");
    describeTitle.textContent = `目前沒有任何待預訂的行程`;
    describeTitle.style.paddingTop = "35px";

    bookingUser.appendChild(describeTitle);

    const footerContainer = document.createElement("div");
    footerContainer.className = "footer";
    const footerContent = document.createElement("div");
    footerContent.className = "footerContent";
    footerContent.textContent = "COPYRIGHT @ 2022 台北一日遊";
    footerContainer.style.position = "absolute";
    footerContainer.style.bottom = "0";
    footerContainer.style.width = "100vw";
    footerContainer.style.height = "425px";
    footerContainer.appendChild(footerContent);
    bookingUser.insertAdjacentElement("afterend", footerContainer);
}

// -- 填寫欄位設定 -- //
function TPDirectCardSetup(){
    TPDirect.card.setup({
        fields: {
            number: {
                // css selector
                element: '#card-number',
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                // DOM object
                element: '#card-expiration-date',
                placeholder: 'MM / YY'
            },
            ccv: {
                element: '#card-ccv',
                placeholder: 'ccv'
            }
        },
        styles: {
            // Style all elements
            'input': {
                'color': 'gray'
            },
            // Styling ccv field
            'input.ccv': {
                'font-size': '16px'
            },
            // Styling expiration-date field
            'input.expiration-date': {
                'font-size': '16px'
            },
            // Styling card-number field
            'input.card-number': {
                'font-size': '16px'
            },
            // style focus state
            ':focus': {
                'color': 'black'
            },
            // style valid state
            '.valid': {
                'color': 'green'
            },
            // style invalid state
            '.invalid': {
                'color': 'red'
            },
            // Media queries
            // Note that these apply to the iframe, not the root window.
            '@media screen and (max-width: 400px)': {
                'input': {
                    'color': 'orange'
                }
            }
        },
        // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
            beginIndex: 6,
            endIndex: 11
        }
    })
}

// -- 點擊"確認訂購並付款"的回應 -- //
function orderSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        // 判斷哪個欄位錯誤 回應給使用者
        let message;
        if (tappayStatus.status.number === 1){
            message = "卡號欄位還沒有填寫";
        }else if (tappayStatus.status.number === 2){
            message = "卡號欄位有錯誤";
        }else if (tappayStatus.status.expiry === 1){
            message = "逾期時間欄位還沒有填寫";
        }else if (tappayStatus.status.expiry === 2){
            message = "逾期時間欄位有錯誤";
        }else if (tappayStatus.status.ccv === 1){
            message = "驗證密碼欄位還沒有填寫";
        }else {
            message = "驗證密碼欄位有錯誤";
        }
        errorMessageBox(message);
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        prime = result.card.prime;
        sentToServer(prime);
    })
}

// -- 付款資料送後端 -- //
function sentToServer(parameter){
    const phoneNumber = document.querySelector("#phone");
    const prime = parameter;
    
    phone = phoneNumber.value;
    if (!phone){
        errorMessageBox("請輸入手機號碼，謝謝。");
        return;
    }
    requestData = {
        "prime": prime,
        "order": {
            "price": fees,
            "trip": {
                "id": attractionId,
                "name": siteName,
                "address": siteAddress,
                "image": imageURL
            },
            "date": date,
            "time": tripTime
        },
        "contact": {
            "name": userName,
            "email": email,
            "phone": phone
        }
    }
    fetch("/api/orders",{
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(requestData)
    }).then((response) => (response.json())).then(
        (responseData) => {

            let paymentData = responseData.data;
            let orderNumber = paymentData.number;
            let paymentMessage = paymentData.payment.message;

            if(paymentMessage === "付款成功"){
                location.replace(`/thankyou?number=${orderNumber}`);
            }else{
                errorMessageBox("付款失敗");
            }
        }
    )
}

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

