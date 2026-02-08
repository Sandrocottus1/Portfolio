let board=[
    ['','','O'],
    ['','X',''],
    ['','',''],
];
let player1='X';
let player2='O';
function setup(){
    createCanvas(400,400);
}
function draw(){
    background(220);
    let w=width/3;
    let h=height/3;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let x=w*i;
            let y=h*j;
            let spot=board[i][j];
            textSize(32);
            if(spot==player1){
                ellipse(x,y,w);
            }else if (spot==player2){
                line(x,y,x+w,y+h);
                line(x+w,y,x,y+h);
            }
            
        }
    }
}