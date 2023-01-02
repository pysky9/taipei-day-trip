let id;
let email;
let userName;

getMembersOrderData()


function getMembersOrderData(){
    fetch("/api/user/auth").then(function(response){
        return response.json();
    }).then(function(result){
        if(result.data){
            let userData = result.data;
            id = userData.id;
            userName = userData.name;
            email = userData.email;
        }
        getOrderDataRequest();
    })
}

function getOrderDataRequest(){
    fetch("/api/ordered", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({"id":id,"name": userName, "email": email})
    }).then((response)=>(response.json())).then(
        (responseData) => {
            if (responseData.error && responseData.message==="未登入系統"){
                location.href = "/";
                // return;
            }else if (responseData.error && responseData.message==="沒有歷史訂單") {
                // const bodyElem = document.querySelector("body");
                // const noOrder = document.createElement("div");
                // noOrder.textContent = `${userName}，您無歷史訂單`
                // bodyElem.appendChild(noOrder)

                // const footerContainer = document.createElement("div");
                // footerContainer.className = "footer";
                // const footerContent = document.createElement("div");
                // footerContent.className = "footerContent";
                // footerContent.textContent = "COPYRIGHT @ 2022 台北一日遊";
                // footerContainer.style.position = "absolute";
                // footerContainer.style.bottom = "0";
                // footerContainer.style.width = "100vw";
                // footerContainer.style.height = "425px";
                // footerContainer.appendChild(footerContent);

                // noOrder.insertAdjacentElement("afterend", footerContainer);
                // const bodyElem = document.querySelector("body");

                // const messageContainer = document.createElement("div");
                // messageContainer.className = "messageContainer";
                // messageContainer.style.display = "block";
            
                // const messagePrefix = document.createElement("div");
                // messagePrefix.className = "messagePrefix";
                // messageContainer.appendChild(messagePrefix);
            
                // const closeImg = document.createElement("img");
                // closeImg.className = "closeImg";
                // closeImg.src = "/image/close.png";
                // messageContainer.appendChild(closeImg);
            
                // closeImg.addEventListener("click", function(event){
                //     messageContainer.style.display = "none";
                //     location.reload();
                // })
            
                // const messageContent = document.createElement("div");
                // messageContent.className = "messageContent";
                // messageContent.textContent = `您無歷史訂單`;
                // messageContainer.appendChild(messageContent);
            
                // bodyElem.insertAdjacentElement("afterend", messageContainer);
                const forFooter = document.querySelector(".forFooter");
                forFooter.remove();
                
                const membersInfoContainers = document.querySelector(".membersInfoContainers");
                membersInfoContainers.textContent = "會員基本資料";
                const memberName = document.createElement("div");
                memberName.className = "memberInfo";
                memberName.id = "memberName";
                memberName.textContent = `姓名：${userName}`;
                membersInfoContainers.appendChild(memberName);

                const memberEmail = document.createElement("div");
                memberEmail.className = "memberInfo";
                memberEmail.id = "memberEmail";
                memberEmail.textContent = `電子郵件：${email}`;
                membersInfoContainers.appendChild(memberEmail);
                
                const message = document.createElement("div");
                message.textContent = "您沒有歷史訂單";
                message.className = "noOrderMsg";
                
                membersInfoContainers.insertAdjacentElement("afterend", message);

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
                message.insertAdjacentElement("afterend", footerContainer);

                return;
            }
            // const navContainer = document.querySelector(".navContainer");
            const membersInfoContainers = document.querySelector(".membersInfoContainers");
            membersInfoContainers.textContent = "會員基本資料";
            const memberName = document.createElement("div");
            memberName.className = "memberInfo";
            memberName.id = "memberName";
            memberName.textContent = `姓名：${userName}`;
            membersInfoContainers.appendChild(memberName);

            const memberEmail = document.createElement("div");
            memberEmail.className = "memberInfo";
            memberEmail.id = "memberEmail";
            memberEmail.textContent = `電子郵件：${email}`;
            membersInfoContainers.appendChild(memberEmail);
            responseData.forEach(function(element){
                const ordersHistoryContainer = document.createElement("div");
                ordersHistoryContainer.className = "ordersHistoryContainer";
                const orderNumber = document.createElement("div");
                orderNumber.textContent = `訂單編號：${element.order_number}`;
                ordersHistoryContainer.appendChild(orderNumber);

                const siteName = document.createElement("div");
                siteName.textContent = `景點名稱：${element.site_name}`;
                ordersHistoryContainer.appendChild(siteName);

                const siteAddress = document.createElement("div");
                siteAddress.textContent = `景點地址：${element.site_address}`;
                ordersHistoryContainer.appendChild(siteAddress);

                const tripDate = document.createElement("div");
                tripDate.textContent = `旅遊日期：${element.trip_date}`;
                ordersHistoryContainer.appendChild(tripDate);

                let time;
                if(element.trip_time === "morning"){
                    time = "早上九點至下午四點";
                }else{
                    time = "下午兩點至晚上九點";
                }

                const tripTime = document.createElement("div");
                tripTime.textContent = `旅遊時間：${time}`;
                ordersHistoryContainer.appendChild(tripTime);

                const tripPrice = document.createElement("div");
                tripPrice.textContent = `旅遊費用：${element.trip_price}`;
                ordersHistoryContainer.appendChild(tripPrice);

                const payStatus = document.createElement("div");
                payStatus.textContent = `付款狀態：${element.order_status}`;
                ordersHistoryContainer.appendChild(payStatus);
                
                membersInfoContainers.insertAdjacentElement("afterend", ordersHistoryContainer);
            })
            const orderContainers = document.querySelectorAll(".ordersHistoryContainer");
            const orderContainer = orderContainers[orderContainers.length - 1]
            // create footer 
            const footerContainer = document.createElement("div");
            footerContainer.className = "footer";
            const footerContent = document.createElement("div");
            footerContent.className = "footerContent";
            footerContent.textContent = "COPYRIGHT @ 2022 台北一日遊";
            if(orderContainers.length === 1){
                footerContainer.style.height = "678px";
            }else if(orderContainers.length === 2){
                footerContainer.style.height = "494px";
            }else if(orderContainers.length === 3){
                footerContainer.style.height = "310px";
            }else{
                footerContainer.style.height = "126px";
            }
            footerContainer.appendChild(footerContent);
            orderContainer.insertAdjacentElement("afterend", footerContainer);
        }
    )
}