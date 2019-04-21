// 这是我们的玩家要躲避的敌人 
var Enemy = function(init_y, speed, player) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.real_x = 0;
    this.player = player;
    // 防止入参错误，进行转换，调用方只用关注相对位置，例如1,2,3,4,5,6
    if(init_y<=2){
        this.real_y = 65;
        this.y = 2;
    }
    if(init_y==3){
        this.real_y = 145;
        this.y = 3;
    }
    if(init_y>=4){
        this.real_y = 225;
        this.y = 4;
    }
    this.speed = speed;
    this.end = 0;
    this.conflict = 0;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.real_x += dt * this.speed;
    // 如果已经跑出屏幕外，释放数组里对应的对象枚举
    if(this.real_x > 606){
        this.end = 1;
    }
    // 检测碰撞
    if(this.player.y == this.y && this.player.real_x > this.real_x - 80 && this.player.real_x < this.real_x + 80 ){
        this.conflict = 1;
        console.log(this.player.real_x);
        console.log(this.real_x);
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.real_x, this.real_y);
};

// Enemy.prototype.checkConflict = function(){
//     if(this.player.y == this.y && this.player.real_x < this.real_x + 50 && this.player.real_x > this.real_x - 50 ){
//         this.conflict = 1;
//     }
// };

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
class Player {
    constructor(init_x, init_y){
        this.picture = 'images/char-boy.png';
        this.x = init_x;
        this.y = init_y;
        this.success = 0;
    }
    // 因为render处直接处理了绘制的功能，这里只用针对游戏成功的情况做判断
    update(dt) {
        if(this.y == 1){
            this.success = 1;
        }
    }
    // 调用方仅关注相对位置，内部做px的转换
    render(){
        this.real_x = 101 * (this.x-1);
        this.real_y = 80 * (this.y-1);
        ctx.drawImage(Resources.get(this.picture), this.real_x, this.real_y);
    }
    // 处理键盘过来的指令，需要注意不能超出屏幕
    handleInput(move_direction){
        switch(move_direction) {
            case 'left':
                if(this.x >= 2){
                    this.x -= 1; 
                }
                break;
            case 'down':
                if(this.y <= 5){
                    this.y += 1;
                }
                break;
            case 'right':
                if(this.x <= 4){
                    this.x += 1;
                }
                break;
            case 'up':
                if(this.y >= 2){
                    this.y -= 1;
                }
                break;
        }
    }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

//初始化玩家和敌人数组
let player = new Player(3, 6);
let allEnemies = [];
// 控制屏幕中的bugs数量
const all_enemy = 7;
const interval = 500;

function enemy_create(){
    // bugs出现行数和速度随机，行数2～4，速度150～250
    let y = Math.floor(Math.random()*3)+2;
    let bug_speed = Math.floor(Math.random()*101)+150;
    // 确保屏幕中出现足够bugs
    if (allEnemies.length < all_enemy){
        allEnemies.push(new Enemy(y, bug_speed, player));
    }
    // 游戏通关处理
    if (player.success == 1){
        player = new Player(3, 6);
        allEnemies = [];
    }
    for (let i in allEnemies){
        // bugs和player碰撞处理
        if (allEnemies[i].conflict == 1){
            player = new Player(3, 6);
            allEnemies = [];
            break;
        }
        // 出现在屏幕外bugs重新补充上
        if (allEnemies[i].end == 1){
            allEnemies[i] = new Enemy(y, bug_speed, player);
        }
    }
}
// 设置定时器，不断生产bugs
let interval_id = setInterval(enemy_create, interval);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});