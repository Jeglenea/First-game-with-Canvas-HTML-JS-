const canvas = document.querySelector('canvas')//querySelector for taking variables or thing from our html file
const c= canvas.getContext('2d')

canvas.width=1024
canvas.height=576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7 // important

class Sprite{
    constructor({position, velocity, color='red',offset}){
        this.position=position
        this.velocity=velocity
        this.width=50 
        this.height=150
        this.lastKey
        this.attackBox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset,//for attack box
            width: 100,
            height: 50,
        }
        this.color=color
        this.isAttacking
        this.health=100
    }

    draw(){
        //Body
        c.fillStyle = this.color
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
        //Attack
        if(this.isAttacking){
        c.fillStyle='yellow'
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
            )
        }
    }

    update(){
        this.draw()
        this.attackBox.position.x=this.position.x+this.attackBox.offset.x
        this.attackBox.position.y=this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y+this.height+this.velocity.y>=canvas.height){
            this.velocity.y=0   
        }
        else this.velocity.y += gravity
    }
    attack(){
        this.isAttacking = true
        setTimeout(( ) => {
            this.isAttacking=false
        },100)
    }
}

const player=new Sprite({
    position:{
    x:0,
    y:0
    },
    velocity: {
    x:0,
    y:10
    },
    offset: {
        x:0,
        y:0
    }
})

const enemy=new Sprite({
    position:{
    x:500,
    y:100
    },
    velocity: {
    x:0,
    y:10
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    }

})

const keys = {
    a:  {
        pressed:false
    },
    d:  {
        pressed:false
    },
    ArrowRight:  {
        pressed:false
    },
    ArrowLeft:  {
        pressed:false
    }
    
}
function attackDetection({rectangle1/*player*/,rectangle2/*enemy*/}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x+rectangle2.width &&
        rectangle1.attackBox.position.y+rectangle1.attackBox.height >=rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y+rectangle2.height
    )
}

function winnerSelector({player,enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector('#gameOver').style.display='flex'
    if(player.health== enemy.health){
        document.querySelector('#gameOver').innerHTML='Tie.'
    }else if(player.health > enemy.health){
        document.querySelector('#gameOver').innerHTML='Player 1 Wins!'
        }else if(player.health < enemy.health){
            document.querySelector('#gameOver').innerHTML='Player 2 Wins!'
            }
}

let timer=60
let timerId

function timerController(){
    if(timer > 0){
        timerId = setTimeout(timerController,1000)
        timer--
        document.querySelector('#timer').innerHTML=timer//innerHTML chooses inside of div's
    }
    if(timer== 0){
        winnerSelector({player,enemy,timerId})
}
}
timerController()

function animate(){
    window.requestAnimationFrame(animate)
    //console.log('Working')
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player
    if (keys.a.pressed &&  player.lastKey === 'a'){
        player.velocity.x = -5
    }else if (keys.d.pressed &&  player.lastKey === 'd'){
        player.velocity.x = 5
    }

    //Enemy
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    }
    //Detect collusion player
    if(
        attackDetection({
            rectangle1:player,
            rectangle2:enemy
        })&&player.isAttacking
        ){
        player.isAttacking = false
        enemy.health-=20 
        document.querySelector('#enemyHealth').style.width=enemy.health+'%'  
        console.log('player attack')
    }
    if(
        attackDetection({
            rectangle1:enemy,
            rectangle2:player
        })&&enemy.isAttacking
        ){
        enemy.isAttacking = false   
        player.health-=20 
        document.querySelector('#playerHealth').style.width=player.health+'%'
        console.log('enemy attack')
    }
    // End game based on health status 
    if(enemy.health<=0 || player.health<=0){
        winnerSelector({player,enemy,timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //Player
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break    
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break   
        case 'w':
            player.velocity.y = -15
            break
        case ' ':
            player.attack()
            break

        //Enemy
            case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break    
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break   
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            enemy.attack()
            break      
    }
    //console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    //Player
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break    
        case 'a':
            keys.a.pressed = false
            break      
    }
    //Enemy
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break    
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
       
    }
    //console.log(event.key)
})