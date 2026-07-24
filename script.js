const  canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.jpg'
})

const shop = new Sprite({
    position: {
        x: 200,
        y: 350
    },
    imageSrc: './assets/shop.png',
    scale: 1.5,
    framesMax: 6 

})

const player = new Fighter({
    
    position: {
        x: 0,
        y: 0,
    },
    hitBoxW: 70 ,
    hitBoxH: 150,
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0 
    },
    imageSrc: './assets/Bunny/Idle2.png',
    framesMax: 8,
    scale: 1.5,
    offset:{
        x: 90 ,
        y: 110
    },
    sprites: {
        idle: {
            imageSrc: './assets/Bunny/Idle2.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/Bunny/Run2.png',
            framesMax: 8,
           
        },
        jump: {
            imageSrc: './assets/Bunny/Jump2.png',
            framesMax: 2,
            
        },
        fall: {
            imageSrc: './assets/Bunny/Fall2.png',
            framesMax: 2,
        
        },
        attack1: {
            imageSrc: './assets/Bunny/Attack1-5.png',
            framesMax: 6,
        
        },
        takeHit: {
            imageSrc: './assets/Bunny/Take Hit2.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './assets/Bunny/Death2.png',
            framesMax: 8,
        }


    
    },
    attackBox: {
        offset: {
            x: 50,
            y: -50
        }, 
        width: 150,
        height: 100,
    },
    maxPosition:{
        xBegin: -40,
        xEnd: 1000,
        y: -100
    }

})

const enemy = new Fighter({
    
    position: {
        x: 900,
        y: 145,
    },
    hitBoxW: 150 ,
    hitBoxH: 170,
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0 
    },
    imageSrc: './assets/Dragon/Idle2.png',
    framesMax: 4,
    scale: 1.5,
    offset:{
        x: 115 ,
        y: 90
    },
    sprites: {
        idle: {
            imageSrc: './assets/Dragon/Idle2.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/Dragon/Run2.png',
            framesMax: 8,
           
        },
        jump: {
            imageSrc: './assets/Dragon/Jump2.png',
            framesMax: 2,
            
        },
        fall: {
            imageSrc: './assets/Dragon/Fall2.png',
            framesMax: 2,
        
        },
        attack1: {
            imageSrc: './assets/Dragon/Attack1-5.png',
            framesMax: 4,
        
        },
        takeHit: {
            imageSrc: './assets/Dragon/Take Hit2.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './assets/Dragon/Death2.png',
            framesMax: 8,
        }
    },
    attackBox: {
        offset: {
            x: -110,
            y: -10
        }, 
        width: 140,
        height: 120,
    },
    maxPosition:{
        xBegin: -40,
        xEnd: 1000,
        y: -190
    }
})



console.log (player);


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    c.fillStyle = 'hsla(214, 56%, 64%, 0.24)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movements

    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //player jumping

    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }
    //enemy movements
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }

    //enemy jumping

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect collision & enemy gets hit

    if( 
       rectangularCollision ({
        rectangle1: player,
        rectangle2: enemy
       }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {

        enemy.takeHit()
        player.isAttacking = false
        
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        console.log('wee')
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // detect collision & player gets hit
    if( 
       rectangularCollision ({
        rectangle1: enemy,
        rectangle2: player
       }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('hoo')
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }


    // END GAME BASED ON health
    if (enemy.health <= 0 || player.health <= 0) {

        determineWinner({player, enemy, timerId})
        
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd' 
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }
    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
        
    }
   
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
             keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }
        
    //enemy keys
    switch (event.key) {
         case 'ArrowRight':
             keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
      
    }
   
})

