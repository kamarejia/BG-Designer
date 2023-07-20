const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
});

const listItems = document.querySelectorAll('.sidebar-menu li');
listItems.forEach(item => {
    item.addEventListener('click', () => {
        listItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active');
    });
});

class Card {
    constructor(Id, title, cardWidth, cardHeight, cardNumber, textColor, frontColor, backColor, contents, frontImage, backImage, parentElement=document.body) {
        this.Id = Id;
        this.title = title;
        this.cardWidth = cardWidth;
        this.cardHeight = cardHeight;
        this.cardNumber = cardNumber;
        this.textColor = textColor;
        this.frontColor = frontColor;
        this.backColor = backColor;
        this.contents = contents ? contents :"No contents";
        this.frontImage = frontImage;
        this.backImage = backImage;

        this.frontImageSrc = null;
        this.backImageSrc = null;

        this.playing = true;
        this.isFlipped = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.cardElement = this.createFrontCardElement(parentElement);
        if(parentElement==document.body){
            this.backCardElement = this.createBackCardElement(parentElement);
            this.playing = false;
        }
    }
    
    copyMyInstance(id){
        let newCard = new Card(id,
            this.title,
            this.cardWidth,
            this.cardHeight,
            this.cardNumber,
            this.textColor,
            this.frontColor,
            this.backColor,
            this.contents,
            this.frontImage,
            this.backImage,
            document.getElementById("game-board"))
        return newCard
    }
    createFrontCardElement(parentElement) {

        //カード作成
        let cardElement = document.createElement('div');
        cardElement.id = this.Id;
        cardElement.className = 'card';

        cardElement.style.width = this.cardWidth + 'px';
        cardElement.style.height = this.cardHeight + 'px';
      
        cardElement.style.backgroundColor = this.frontColor; 
        cardElement.style.border = '2px solid ' + this.frontColor;

        // カードタイトルをカードの1/15の大きさで作成
        let cardTitle = document.createElement('h2');
        cardTitle.className = 'cardElement-title';
        cardTitle.innerText = this.title;

        cardTitle.style.color = this.textColor;
        cardTitle.style.fontSize = (this.cardHeight / 15) + 'px';
        cardTitle.style.letterSpacing = '-1px'; 
        cardTitle.style.overflow = 'hidden';
        cardTitle.style.textOverflow = 'ellipsis';
        cardTitle.style.whiteSpace = 'nowrap';
        cardTitle.style.width = this.cardWidth + 'px'; 

        cardElement.appendChild(cardTitle);


        //画像をカードの14/15の大きさで作成
        if (this.frontImage) {
            let cardImage = document.createElement('img');
            cardImage.className = 'card-image';

            cardImage.style.width = this.cardWidth + 'px';
            cardImage.style.height = (this.cardHeight * 14 / 15) + 'px';
            cardImage.style.backgroundColor = this.frontColor;
            cardImage.style.border = 'none';
            cardImage.style.borderRadius = '12px'; 
            cardImage.draggable = false;

            let reader = new FileReader();
            reader.onloadend = function() {
                cardImage.src = reader.result;
            }
            reader.readAsDataURL(this.frontImage);

            cardElement.appendChild(cardImage);
        }

        parentElement.appendChild(cardElement);
  
        this.addDragListener(cardElement);
        this.addFkeydownListener(cardElement);
        return cardElement;
    }
    createBackCardElement(parentElement){
        //カード作成
        let cardElement = document.createElement('div');
        cardElement.id = this.id;
        cardElement.className = 'card';

        cardElement.style.width = this.cardWidth + 'px';
        cardElement.style.height = this.cardHeight + 'px';
      
        cardElement.style.backgroundColor = this.backColor; 
        cardElement.style.border = '2px solid ' + this.backColor;

        //画像を作成
        if (this.backImage) {
            let cardImage = document.createElement('img');
            cardImage.className = 'card-image';

            cardImage.style.width = this.cardWidth + 'px';
            cardImage.style.height = this.cardHeight + 'px';
            cardImage.style.backgroundColor = this.backColor;
            cardImage.style.border = 'none';
            cardImage.style.borderRadius = '12px'; 
            cardImage.draggable = false;

            let reader = new FileReader();
            reader.onloadend = function() {
                cardImage.src = reader.result;
            }
            reader.readAsDataURL(this.backImage);

            cardElement.appendChild(cardImage);
        }

        parentElement.appendChild(cardElement);
  
        this.addDragListener(cardElement);
      
        return cardElement;

    }
    addFkeydownListener(cardElement){
        document.addEventListener("keydown", function(event) {
            if (event.key === "F" || event.key === "f") {
                let cardInstance = null;
                if(cardElement.style.borderColor == "orange"){
                    for(let card in gameBoardList){
                        if(gameBoardList[card].Id == cardElement.id)cardInstance = gameBoardList[card];
                    }
                    cardInstance.flip(cardElement)
                }
            }
        });
    }
    addDragListener(cardElement){
        let currentDroppable = null;
        cardElement.addEventListener('mousedown', function(event) {
        event.preventDefault(); 
        let cardInstance = null;
        for(let card in gameBoardList){
            if(gameBoardList[card].Id == cardElement.id)cardInstance = gameBoardList[card];
        }
        if(cardInstance != null){
            for(let card in gameBoardList){
                gameBoardList[card].cardElement.style.borderColor = null;
                //gameBoardList[card].cardElement.style.border = '2px solid ' + cardElement.frontColor;
            }
            cardElement.style.borderColor = "orange";
            cardInstance.displayContents()
        }
        
        let shiftX = event.clientX - cardElement.getBoundingClientRect().left;
        let shiftY = event.clientY - cardElement.getBoundingClientRect().top;
  
    
        cardElement.style.position = 'absolute';
        cardElement.style.zIndex = 1000;
    
        moveAt(event.clientX,event.clientY)
    
        function moveAt(pageX, pageY) {
            cardElement.style.left = pageX - shiftX + 'px';
            cardElement.style.top = pageY - shiftY + 'px';
        }
    
        function onMouseMove(event) {
            moveAt(event.clientX,event.clientY)
    
            cardElement.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            cardElement.hidden = false;
    
            if (!elemBelow) return;
    
            let droppableBelow = elemBelow.closest('.droppable');
            if (currentDroppable != droppableBelow) {
              if (currentDroppable) {
                  leaveDroppable(currentDroppable);
                }
                currentDroppable = droppableBelow;
                if (currentDroppable) {
                    enterDroppable(currentDroppable);
                }
            }
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
      });
    }
    flip(cardElement) {
        this.isFlipped =! this.isFlipped;
        cardElement.style.backgroundColor = this.isFlipped ? this.backColor : this.frontColor;
        if(this.isFlipped){
            cardElement.querySelector("h2").style.display = "none";
            cardElement.querySelector("img").src = this.backImage;
        }else{
            cardElement.querySelector("h2").style.display = "block";
            cardElement.querySelector("img").src = this.frontImage;
        }
    }
    displayContents() {
        let sideModal = document.querySelector('.sideModal');
        let titleElement = sideModal.querySelector('h2');
        let contentsElement = sideModal.querySelector('p');

        titleElement.textContent = this.title;
        contentsElement.textContent = this.contents;

        if(sideModal.style.right == '0'){
            sideModal.style.right = '-100%';
        }

        sideModal.style.right = '0';
      }
    toJSON() {
        return {
            Id: this.Id,
            title: this.title,
            cardWidth: this.cardWidth,
            cardHeight: this.cardHeight,
            cardNumber: this.cardNumber,
            textColor: this.textColor,
            frontColor: this.frontColor,
            backColor: this.backColor,
            contents: this.contents,
            frontImage: this.frontImage, 
            backImage: this.backImage 
        };
    }
 
}


let cardId = 0;
let cardList = {};
function createCard(){
    let title = document.getElementById('title').value;

    let cardWidth = document.getElementById('width').value;
    let cardHeight = document.getElementById('height').value;

    let cardNumber = document.getElementById("card-num").value;

    let textColor = document.getElementById('textcolor').value;
    let frontColor = document.getElementById('frontcolor').value;
    let backColor = document.getElementById("backcolor").value;

    let contents = document.getElementById("contents").value;

    let frontImage = document.getElementById('frontimage').files[0];
    let backImage = document.getElementById("backimage").files[0];

    let newCard = new Card("card"+cardId, title, cardWidth, cardHeight, cardNumber, textColor, frontColor, backColor, contents, frontImage, backImage );
    cardList["card"+cardId] = newCard;
    createCompBoard(newCard);
    
    displayCards("card"+cardId);
    cardId++;
}
    
function createCompBoard(newCard) {
    let compBoardContainer = document.querySelector(".comp-board-container");

    let newCompBoard = document.querySelector(".comp-board").cloneNode(true);
    newCompBoard.id = newCard.id;

    newCompBoard.querySelector(".card-title h2").textContent = newCard.title;

    newCompBoard.querySelector(".card-num").textContent = "x" + newCard.cardNumber;

    // カードサイズの設定
    newCompBoard.querySelector(".front-size-box").textContent = "Width: " + newCard.cardWidth + "px";
    newCompBoard.querySelector(".back-size-box").textContent = "Height: " + newCard.cardHeight + "px";

    // カードカラーの設定
    // テキストカラー
    let fontColorBox = newCompBoard.querySelector(".font-color-box");
    fontColorBox.textContent = "Text: ";
    let fontColorBar = document.createElement("span");
    fontColorBar.style.backgroundColor = newCard.textColor;
    fontColorBar.style.height = "18px";
    fontColorBar.style.width = "50px";
    fontColorBar.style.display = "inline-block";
    fontColorBar.style.borderRadius = "8px";
    fontColorBox.appendChild(fontColorBar);

    // 前面カラー
    let frontColorBox = newCompBoard.querySelector(".front-color-box");
    frontColorBox.textContent = "Front: ";
    let frontColorBar = document.createElement("span");
    frontColorBar.style.backgroundColor = newCard.frontColor;
    frontColorBar.style.height = "18px";
    frontColorBar.style.width = "50px";
    frontColorBar.style.display = "inline-block";
    frontColorBar.style.borderRadius = "8px";
    frontColorBox.appendChild(frontColorBar);

    // 裏面カラー
    let backColorBox = newCompBoard.querySelector(".back-color-box");
    backColorBox.textContent = "Back: ";
    let backColorBar = document.createElement("span");
    backColorBar.style.backgroundColor = newCard.backColor;
    backColorBar.style.height = "18px";
    backColorBar.style.width = "50px";
    backColorBar.style.display = "inline-block";
    backColorBar.style.borderRadius = "8px";
    backColorBox.appendChild(backColorBar);

    // contentsの設定
    newCompBoard.querySelector(".contents p").textContent = newCard.contents;

    // 画像ファイル名の設定
    if(newCard.frontImage){newCompBoard.querySelector(".front-image-box").textContent = "Front: " + newCard.frontImage.name;}
    
    if(newCard.backImage){newCompBoard.querySelector(".back-image-box").textContent = "Back: " + newCard.backImage.name;}

    // カードエレメントの挿入
    let frontAppElem = newCompBoard.querySelector(".front-app-elem");
    let cardElement = newCard.cardElement;
    cardElement.style.position = 'relative';
    frontAppElem.appendChild(cardElement);

    let backAppElem = newCompBoard.querySelector(".back-app-elem");
    let backCardElement = newCard.backCardElement;
    backCardElement.style.position = 'relative';
    backAppElem.appendChild(backCardElement);

    // input-board要素の取得
    let inputBoard = document.getElementById("input-board");

    // 新しいcomp-boardをinput-boardの前に追加
    compBoardContainer.insertBefore(newCompBoard, inputBoard);

    toggleDisplayInputBoard(0)
}

function toggleDisplayInputBoard(state){
    if(state==1){
        let inputBoard = document.getElementById("input-board");
        inputBoard.style.display = "block";

    }else if(state==0){
        let inputBoard = document.getElementById("input-board");
        inputBoard.style.display = "none";
    }
}
document.body.addEventListener('click', function(e) {
    if(e.target.classList.contains('comp-del')) {
        // 確認アラート表示
        let confirmDelete = confirm("本当にこのカードを削除してもよろしいですか？");
        if(confirmDelete) {
            // 親の .comp-board を取得して削除
            e.target.closest('.comp-board').remove();
        }
    }
});
document.body.addEventListener('click', function(e) {
    if(e.target.classList.contains('comp-copy')) {
        let compBoard = e.target.closest('.comp-board');

        let cardInfo = {
            title: compBoard.querySelector('.card-title h2').innerText,
            cardWidth: parseInt(compBoard.querySelector('.front-size-box').innerText.split(':')[1]),
            cardHeight: parseInt(compBoard.querySelector('.back-size-box').innerText.split(':')[1]),
            cardNumber: parseInt(compBoard.querySelector('.card-num').innerText.substring(1)),
            textColor: rgbToHex(compBoard.querySelector('.font-color-box span').style.backgroundColor),
            frontColor: rgbToHex(compBoard.querySelector('.front-color-box span').style.backgroundColor),
            backColor: rgbToHex(compBoard.querySelector('.back-color-box span').style.backgroundColor),
            contents: compBoard.querySelector('.contents p').innerText,
            frontImage: compBoard.querySelector('.front-image img') ? compBoard.querySelector('.front-image img').src : null,
            backImage: compBoard.querySelector('.back-image img') ? compBoard.querySelector('.back-image img').src : null,
        };

        document.getElementById('title').value = cardInfo.title;

        document.getElementById('width').value = cardInfo.cardWidth;
        document.getElementById('height').value = cardInfo.cardHeight;

        document.getElementById("card-num").value = cardInfo.cardNumber;

        document.getElementById('textcolor').value = cardInfo.textColor;
        document.getElementById('frontcolor').value = cardInfo.frontColor;
        document.getElementById("backcolor").value = cardInfo.backColor;

        document.getElementById("contents").value = cardInfo.contents;

        if (cardInfo.frontImage) {
            document.getElementById('front-image').src = cardInfo.frontImage;
        }
        if (cardInfo.backImage) {
            document.getElementById('back-image').src = cardInfo.backImage;
        }
        toggleDisplayInputBoard(1);
    }
});

function rgbToHex(rgb) {
    let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}


function cardListToJson(cardList) {
    const cardListJson = {};

    for (const cardId in cardList) {
        cardListJson[cardId] = cardList[cardId].toJSON();
    }

    return JSON.stringify(cardListJson);
}

function upload(filename) {
    const cardDataJson = cardListToJson(cardList);

    // Blobを作成
    const jsonBlob = new Blob([cardDataJson], {type : 'application/json'});

    // FormDataオブジェクトを作成
    const formData = new FormData();
    formData.append('file', jsonBlob, filename+'.json');

    fetch("http://127.0.0.1:5000/upload", {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function download(filename) {
    fetch(`http://127.0.0.1:5000/download?filename=${filename}`)
    .then(response => response.blob())
    .then(blob => {
        // BlobからJSONを読み込む
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = JSON.parse(reader.result);
                resolve(result);
            }
            reader.onerror = reject;
            reader.readAsText(blob);
        });
    })
    .then(data => {
        console.log('Success:', data);
        jsonToCardList(data);
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function getFileNames() {
    return fetch('http://127.0.0.1:5000/files', {  
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log('File Names:', data);
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

//アップロード
function openUploadModal(){
    let modal = document.querySelector('#uploadModal');
    modal.style.display = "block";
}
function closeUploadModal(){
    let modale = document.querySelector('#uploadModal');
    modale.style.display = "none";
}
function applyFileUpload(){
    namedFile = document.getElementById("name-file").value;
    upload(namedFile);
    closeUploadModal();
}

//ダウンロード
let fileSelect = document.querySelector('#file-select');
function openDownloadModal() {
    let modal = document.querySelector('#downloadModal');
    let fileNames = ['none']; 
    
    getFileNames().then(data => {
        console.log(data)
        fileNames = data;
        while(fileSelect.firstChild){
            fileSelect.removeChild(fileSelect.firstChild);
        }
        fileNames.forEach(fileName => {
            let option = document.createElement('option');
            option.value = fileName;
            option.text = fileName;
            fileSelect.add(option);
        });
    })
    modal.style.display = "block";
}
function closeDownloadModal() {
    let modal = document.querySelector('#downloadModal');
    modal.style.display = "none";
}

function confirmSelection() {
    let selectedFile = fileSelect.options[fileSelect.selectedIndex].value;
    console.log("Selected file: " + selectedFile);
    download(selectedFile);
    closeDownloadModal();
}

function jsonToCardList(data) {
    const cardList = {};

    for (const cardId in data) {
        const cardData = data[cardId];

        cardList[cardId] = new Card(
            cardData.Id,
            cardData.title,
            cardData.cardWidth,
            cardData.cardHeight,
            cardData.cardNumber,
            cardData.textColor,
            cardData.frontColor,
            cardData.backColor,
            cardData.contents,
            cardData.frontImage ? new Blob([new Uint8Array(cardData.frontImage)]) : null,
            cardData.backImage ? new Blob([new Uint8Array(cardData.backImage)]) : null,
        );
        createCompBoard(cardList[cardId])
        
    }
    //for(let cardId in cardList){
        displayCards(cardId)
    //}
    return cardList;
}


//画面遷移
function moveToGameplay(){
    let compBoardContainer = document.getElementById("comp-board-container");
    compBoardContainer.style.display = "none";

    let gameBoardContainer = document.getElementById("game-board-container");
    gameBoardContainer.style.display = "flex";
}
function moveToComponents(){
    let gameBoardContainer = document.getElementById("game-board-container");
    gameBoardContainer.style.display = "none";

    let compBoardContainer = document.getElementById("comp-board-container");
    compBoardContainer.style.display = "flex";
}

//ゲームプレイ
let gameBoardList=[]
function displayCards(id) {
    let card = cardList[id];

    for (let i = 0; i < card.cardNumber; i++) {
        let newCard = card.copyMyInstance(card.Id + "-" + (i+1));
        gameBoardList.push(newCard);
    }
}


  