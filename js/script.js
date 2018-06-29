var BoardGame = function (initial_gird_size, light_up_color, light_up_time, level_time, level) {
    if (!new.target) {
        throw ('Is not fuction , Please call with new')
    }
    this.initial_gird_size = initial_gird_size || 3;
    this.light_up_color = light_up_color || 'red';
    this.light_up_time = light_up_time || 2000;
    this.level_time = level_time || 8000;
    this.level = level || 2
    this.score = 0;
    this.timeoutRef = null;
    this.winnerScore = function () {
        return this.initial_gird_size 
    }

    this.grid_size_increase_by = 1
    this.currentLevel = 0;

    var currntGrid = Math.floor(Math.random() * (this.initial_gird_size * this.initial_gird_size)) + 1;
    this.currntGridNum = function () {
        return currntGrid
    }
    this.setCurrentGrid = function () {
        currntGrid = Math.floor(Math.random() * (this.initial_gird_size * this.initial_gird_size)) + 1
    }
    this.designGrid();

}

BoardGame.prototype.replayGame = function () {
    clearTimeout(this.timeoutRef)
    this.score = 0;
    this.currentLevel = 0;
    this.designGrid();
}
BoardGame.prototype.nextLevel = function () {
    this.score = 0;
    this.currentLevel += 1
    this.initial_gird_size += this.grid_size_increase_by
    this.designGrid();
}
BoardGame.prototype.goToLeaderBoard = function(){
    var doc = document.querySelector("#grid")
    doc.innerHTML = ""
    var store = JSON.parse(localStorage.getItem('score'))
    for(var i = 0;i<store.length;i++){
        var span = document.createElement("Span")
        span.innerText = "Leble "+store[i].label+" with score "+store[i].score
        doc.appendChild(span)
    }
}
BoardGame.prototype.finishGame = function () {
    clearTimeout(this.timeoutRef)
    var  store = localStorage.getItem("score")? JSON.parse(localStorage.getItem("score")):[]
    store.push({label:this.currentLevel,score:this.score})
    localStorage.setItem("score",JSON.stringify(store))

    var doc = document.querySelector("#grid")
    var spna = document.createElement("span")
    var button = document.createElement("button")
    var message, win;
    if (this.score < this.winnerScore()) {
        message = "You loos the game"
        button.innerText = "Repaly"
        win = 0
    } else {
        message = "You Win the game "
        button.innerText = "NextLevel"
        win = 1
    }
    doc.style.gridTemplateColumns = "1fr 1fr"
    if(this.currentLevel >= this.level-1){
        message += ";    Game Over, Thank You"
        button.innerText = "Go to Leader"
        win = 2
        doc.style.gridTemplateColumns = "1fr 1f"
    }
    
    spna.innerHTML = "<strong>Score :</strong> " + this.score+"/"+this.winnerScore() + "<h3>" + message + "</h3>"


    button.setAttribute('class', 'button')
    var that = this;
    button.addEventListener('click', function () {
        if (win == 0) {
            that.replayGame()
        }else if(win == 2){
            that.goToLeaderBoard();
        } else {
            that.nextLevel()
        }
    })
    
    doc.innerHTML = ""
    doc.appendChild(spna)
    doc.appendChild(button)

}
BoardGame.prototype.moveToNextLevel = function (value,clickornot) {
    var random = this.currntGridNum()
    document.querySelector("#grid" + random).style.backgroundColor = ''
    if (clickornot) {
        clearTimeout(this.timeoutRef)
    }
    this.score += value
    this.setCurrentGrid()
    this.setUplight()
}

BoardGame.prototype.setUplight = function () {
    var random = this.currntGridNum()
    document.querySelector("#grid" + random).style.backgroundColor = this.light_up_color
    var that = this;
    var timeoutRef = setTimeout(function () {
        that.moveToNextLevel(0,false)
    }, this.light_up_time)
    this.timeoutRef = timeoutRef
}

BoardGame.prototype.GetOneGrid = function (number) {
    var doc = document.createElement("div")
    doc.setAttribute("id", "grid" + (number + 1))
    doc.setAttribute("class", "grid-style")
    doc.dataset.id = number + 1
    doc.innerText = number + 1
    var that = this;
    doc.addEventListener("click", function () {
        console.log(this.dataset.id, that.currntGridNum())
        if (this.dataset.id == that.currntGridNum()) {
            that.moveToNextLevel(1,true)
        } else {
            that.moveToNextLevel(-1,true)
        }

    });
    return doc;
}
BoardGame.prototype.designGrid = function () {
    var doc = document.querySelector("#grid")
    doc.style.gridTemplateColumns = "repeat(" + this.initial_gird_size + ", 1fr)";
    doc.innerHTML = ""
    var i = 0;
    for (; i < this.initial_gird_size * this.initial_gird_size; i++) {
        doc.appendChild(this.GetOneGrid(i))
        if ((i + 1) == this.initial_gird_size * this.initial_gird_size) {
            this.setUplight()
            var that = this;
            var interval = setInterval(function(){
                clearInterval(interval);
                that.finishGame()
            },this.level_time);
        }
    }

}

var boardGame = new BoardGame(3, null, 2000, 5000, 2)
// boardGame.designGrid()