///////////////////////////////////////////////////////////Configuración inicial.

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const bg = new Image();
bg.src = "./img/Battle.png";

canvas.width = innerHeight;
canvas.height = innerHeight;

///////////////////////////////////////////////////////////Clases.

class archer{
    constructor(){
        const imagen= new Image();
        imagen.src = "./img/Archer.png";

        this.img = imagen;
        this.height = 32;
        this.width = 32;

        this.pos = {
            x:canvas.width / 2 - this.width / 2,
            y:canvas.height - this.height
        }
        this.vel = 0;

        this.arrows = [];
        this.cooldown = 30;

    }

    draw(){
        if(this.cooldown < 30){
            this.cooldown += 1;
        }
        this.arrows.forEach((myarrow, index) =>{
            myarrow.draw();
            if(myarrow.pos.y <= 0-myarrow.height){
                this.arrows.splice(index,1);
            }
        });
        c.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);
        this.pos.x += this.vel;
    }

    shoot(){
        if(this.cooldown >= 15){
            this.arrows.push(new arrow(this));
            this.cooldown = 0;
        }
    }
}

class mongol{
    constructor(){
        this.height = 32;
        this.width = 32;
        this.vel = 1;
        this.pos = {
            x:Math.floor(Math.random()*canvas.width),
            y:-this.height
        }

        const imagenMongol = new Image();
        imagenMongol.src = "./img/Enemy.png";

        this.img = imagenMongol;
    }

    draw(){
        c.drawImage(this.img, this.pos.x, this.pos.y);
        this.pos.y += this.vel;
    }
}

class arrow{
    constructor({pos, height}){
        this.pos = {
            x:pos.x,
            y:pos.y
        };
        this.vel = 10;

        this.height = 32;
        this.width = 32;
        
        const imgArrow = new Image();
        imgArrow.src = "./img/Arrow_Archer.png";
        this.img = imgArrow;
    }

    draw(){
        c.drawImage(this.img, this.pos.x, this.pos.y);
        this.pos.y -= this.vel;
    }
}

///////////////////////////////////////////////////////////Configuración del juego.

const player = new archer();
let lives = 5;
let wave = 0;
let wave_length = 0;
let mongoles = [];
let time = 0;

///////////////////////////////////////////////////////////Controles.

const keyEventListener = {
    left: {pressed: false},
    right: {pressed: false},
    space: {pressed: false},
}

addEventListener("keydown", (evt)=>{
    switch(evt.key){
        case "a":
            keyEventListener.left.pressed = true;
            break;
        case "A":
            keyEventListener.left.pressed = true;
            break;
        case "ArrowLeft":
            keyEventListener.left.pressed = true;
            break;
        case "d":
            keyEventListener.right.pressed = true;
            break;
        case "D":
            keyEventListener.right.pressed = true;
            break;
        case "ArrowRight":
            keyEventListener.right.pressed = true;
            break;
        case " ":
            keyEventListener.space.pressed = true;
            break;
    }
})

addEventListener("keyup", (evt)=>{
    switch(evt.key){
        case "a":
            keyEventListener.left.pressed = false;
            break;
        case "A":
            keyEventListener.left.pressed = false;
            break;
        case "ArrowLeft":
            keyEventListener.left.pressed = false;
            break;
        case "d":
            keyEventListener.right.pressed = false;
            break;
        case "D":
            keyEventListener.right.pressed = false;
            break;
        case "ArrowRight":
            keyEventListener.right.pressed = false;
            break;
        case " ":
            keyEventListener.space.pressed = false;
            break;
    }
})

///////////////////////////////////////////////////////////Bucle principal.

function animate(){
    requestAnimationFrame(animate);

    if (time <= 90){
        time += 1;
    }else{
        mongoles.push(new mongol);
        time = 0;
    }

    if(wave_length === 0){
        wave += 1;
        wave_length = wave*5;
    }

    c.drawImage(bg, 0, 0, canvas.width, canvas.height);
    player.draw();
    
    mongoles.forEach((enemy,index)=>{
        if(enemy.pos.y >= canvas.height){
            mongoles.splice(index,1);
            lives -= 1;
            console.log(lives);
        }else{
            var existingEnemy = true;
            player.arrows.forEach((myArrow, Aindex)=>{
                if(myArrow.pos.y + myArrow.height <= enemy.pos.y  && myArrow.pos.x - myArrow.width <= enemy.pos.x
                    && myArrow.pos.x + myArrow.width >= enemy.pos.x){
                    mongoles.splice(index,1);
                    player.arrows.splice(Aindex,1);
                    existingEnemy = false;
                }
            })
            if(existingEnemy){
                enemy.draw();
            }
        }
    })

    if(keyEventListener.space.pressed){
        player.shoot();
    }
    player.vel = 0;
    if(keyEventListener.left.pressed  && player.pos.x >=0){
        player.vel += -5;
    }
    if(keyEventListener.right.pressed && player.pos.x <=canvas.width-player.width){
        player.vel += 5;
    }
}

animate();