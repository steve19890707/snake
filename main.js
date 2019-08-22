// 向量環境變化
// -------------------------------------------------------------------------
var Vector = function(x,y){
    this.x = x || 0
    this.y = y || 0
}
// 增加
Vector.prototype.add = function(v){
    return new Vector(this.x+v.x,this.y+v.y)
}
// 減少
Vector.prototype.sub = function(v){
    return new Vector(this.x-v.x,this.y-v.y)
}
// 長度
Vector.prototype.length = function(v){
    return Math.sqrt(this.x*this.x,this.y*this.y)
}
// 重新設定
Vector.prototype.set = function(x,y){
    this.x = x
    this.y = y
}
// 向量同步
Vector.prototype.equal = function(v){
    return this.x == v.x && this.y == v.y
}
// 乘法
Vector.prototype.mul = function(s){
    return new Vector(this.x*s,this.y*s)
}
// 複製一個
Vector.prototype.clone = function(s){
    return new Vector(this.x,this.y)
}
// 蛇的基本設定
// -------------------------------------------------------------------------
var Snake = function(){
    this.body = []
    // 預設長度
    this.maxLength = 5 
    this.head = new Vector()
    // 預設速度(往右加一格)
    this.speed = new Vector(1,0)
    this.direction = "Right"
}

// 新增 蛇的長度
Snake.prototype.update = function(){
    // 新增身體不影響本身位置
    let newHead = this.head.add(this.speed)
    this.body.push(this.head)
    this.head = newHead
    // 直到長度過長從前面砍掉一個
    while (this.body.length>this.maxLength){
        this.body.shift()
    }
}
// 蛇在畫面範圍的判定
Snake.prototype.checkBoundary = function(gameWidth){
    let xInRange = 0 <= this.head.x && this.head.x < gameWidth
    let yInRange = 0 <= this.head.y && this.head.y < gameWidth
    return xInRange && yInRange
}

// 蛇的方向
Snake.prototype.setDirection = function(dir){
    var target
    if (dir == "w"){
        target = new Vector(0,-1)
    }
    if (dir == "s"){
        target = new Vector(0,1)
    }
    if (dir == "a"){
        target = new Vector(-1,0)
    }
    if (dir == "d"){
        target = new Vector(1,0)
    }
    // 判斷方向正確才移動
    if(target.equal(this.speed.mul(-1)) !== true){
        this.speed = target
    }
}


// 遊戲基礎設定
// -------------------------------------------------------------------------
var Game = function(){
    this.bw = 12
    this.bs = 2
    this.gameWidth = 40
    this.speed = 30
    this.snake = new Snake()
    this.foods = []
    this.start = false
}
// 基礎執行設定(產生物件統一位置)
Game.prototype.init = function(){
    this.canvas = document.getElementById("mycanvas")
    this.ctx = this.canvas.getContext("2d")
    // 寬度(正方形)
    this.canvas.width = this.bw *this.gameWidth +this.bs*(this.gameWidth-1)
    // 高度(正方形)
    this.canvas.height = this.canvas.width
    this.render()
    this.update()
    this.generateFood()
}
// 開始遊戲
Game.prototype.startGame = function(){
    this.start = true
    this.snake = new Snake()
    $("#startBtn").hide()
    $("#score").hide()
    this.playSound("C#5",-20)
    this.playSound("E5",-20,200)
}
// 停止遊戲 
Game.prototype.endGame = function(){
    this.start = false
    $("#score").text("Score: "+(this.snake.maxLength - 5)*10)
    $("#startBtn").show()
    $("#score").show()
    this.playSound("A3")
    this.playSound("E2",-10,200)
    this.playSound("A2",-10,400)
}
// 背景格子的位置
Game.prototype.getPosition = function(x,y){
    return new Vector(
        x *this.bw + (x-1) *this.bs,
        y *this.bw + (y-1) *this.bs,
    )
}
// 畫背景格子
Game.prototype.drawBlock = function(v,color){
    this.ctx.fillStyle = color
    var pos = this.getPosition(v.x,v.y)
    this.ctx.fillRect(pos.x,pos.y,this.bw,this.bw)
}
// 食物特效
Game.prototype.drawEffect = function(x,y){
    var r = 2
    var pos = this.getPosition(x,y)
    var _this = this
    var effect = function(){
        r++
        _this.ctx.strokeStyle = colors[randomNum]
        _this.ctx.beginPath()
        _this.ctx.arc(pos.x+_this.bw/2,pos.y+_this.bw/2,r,0,Math.PI*2)
        _this.ctx.stroke()
        if(r<100){
            requestAnimationFrame(effect)
        }
    }
    requestAnimationFrame(effect)
}

// 畫面渲染
Game.prototype.render = function(){
    this.ctx.fillStyle ='rgba(0,0,0,0.3)'
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    // 小格子新增
    for(var x=0;x<this.gameWidth;x++){
        for(var y=0;y<this.gameWidth;y++){
            this.drawBlock(new Vector(x,y),'rgba(255,255,255,0.03)')
        }
    }
    // 畫蛇
    this.snake.body.forEach((sp,i)=>{
        this.drawBlock(sp,"gray")
    })
    // 畫食物
    this.foods.forEach((p)=>{
        this.drawBlock(p,colors[randomNum])
    })
    requestAnimationFrame(()=>{
        this.render()
    })
}

// 產生食物
Game.prototype.generateFood = function(){
    var x = parseInt(Math.random()*this.gameWidth)
    var y = parseInt(Math.random()*this.gameWidth)
    // 食物
    this.foods.push(new Vector(x,y))
    // 特效
    this.drawEffect(x,y)
    // 重新換色
    randomNum = Math.floor(Math.random()*colorsLength)
    this.playSound("E5",-20)
    this.playSound("A5",-20,50)
}
// 隨機顏色
var colors = [
    "blue",
    "yellow",
    "red",
    "white",
    "green",
    "pink",
]
var colorsLength = colors.length
var randomNum = Math.floor(Math.random()*colorsLength)

// 畫面更新
Game.prototype.update = function(){
    if(this.start == true) {
        // 移動音效
        this.playSound("A2",-30)
        // 蛇的更新
        this.snake.update()
        // 食物的更新
        this.foods.forEach((food,i)=>{
            if(this.snake.head.equal(food) == true){
                this.snake.maxLength++
                // 砍吃掉的食物
                this.foods.splice(i,1)
                // 新增食物
                this.generateFood()
            }
        })
        // 遊戲結束的判斷
        // 1.碰到自己結束
        this.snake.body.forEach(BP=>{
            if(this.snake.head.equal(BP)==true){
                this.endGame()
                setTimeout(function(){
                    alert("碰到自己啦!")
                },200)
            }
        })
        // 2.碰到牆壁
        if(this.snake.checkBoundary(this.gameWidth)==false){
            this.endGame()
            setTimeout(function(){
                alert("碰到牆壁啦!")
            },200)
        }
        
    }
    // 難度更新
    var framSpeed = 150
    if(this.snake.body.length >= 10){
        framSpeed = 100
    }
    if(this.snake.body.length >= 15){
        framSpeed = 50
    }
    // 背景更新
    setTimeout(()=>{
        this.update()
    },framSpeed)
}
// 遊戲音效 設定 tone.js
Game.prototype.playSound = function(note,volume,when){
    setTimeout(function(){
        var synth = new Tone.Synth().toMaster()
        synth.volume = volume || -12
        synth.triggerAttackRelease(note,"8n")
    },when || 0)


}

// 執行遊戲
// -------------------------------------------------------------------------
var game = new Game()
game.init()

// 按鈕操控
$(window).keydown(function (e) { 
    // 偵測按鈕按了哪一個鍵
    // console.log(e.key)
    // 將按鍵的值帶入移動方向
    game.snake.setDirection(e.key.replace())
})
$("#startBtn").click(function (e) { 
    game.startGame()
})
