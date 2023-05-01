function pegarInputs(){
    const inputs = [...document.querySelectorAll('.info')]
    console.log(inputs)
    return inputs
}

function pegarValues(input){
    return input.value
}

function desenhoinicial(){

    desenho1 = document.getElementById("desenho1");
    desenho2 = document.getElementById("desenho2");
    desenho3 = document.getElementById("desenho3");
    
    ctx1 = desenho1.getContext("2d");
    ctx2 = desenho2.getContext("2d");
    ctx3 = desenho3.getContext("2d");
    
    ctx1.translate(150,0);
    ctx2.translate(150,0);
    ctx3.translate(150,0);
    
    ctx1.beginPath();
    ctx1.setLineDash([]);
    ctx1.strokeStyle = '#d3d3d3'
    ctx1.lineWidth="2";
    ctx1.moveTo(50,80);
    ctx1.lineTo(50,310);
    ctx1.lineTo(-50,310);
    ctx1.lineTo(-50,80);
    ctx1.lineTo(50,80);
    ctx1.stroke()
    
    //14 pixels para cada 1/1000
    ctx2.beginPath();
    ctx2.setLineDash([]);
    ctx2.strokeStyle = '#d3d3d3'
    ctx2.lineWidth="2";
    ctx2.moveTo(-49,80);
    ctx2.lineTo(0,80);
    ctx2.lineTo(0,287);
    ctx2.lineTo(140,287);
    
    ctx2.moveTo(-49,80);
    ctx2.lineTo(-49,88);
    
    ctx2.moveTo(-28,80);
    ctx2.lineTo(-28,88);
    
    ctx2.moveTo(140,287);
    ctx2.lineTo(140,279);
    
    ctx2.moveTo(29,287);
    ctx2.lineTo(29,279);
    
    ctx2.stroke()
    
    ctx3.beginPath();
    ctx3.setLineDash([]);
    ctx3.strokeStyle = '#d3d3d3'
    ctx3.lineWidth="2";
    ctx3.moveTo(-120,80);
    ctx3.lineTo(-20,80);
    ctx3.lineTo(-20,310);
    ctx3.lineTo(-120,310);
    ctx3.stroke()
    
    ctx2.font="bold 12px Montserrat"
    ctx2.fillStyle = '#d3d3d3'
    ctx2.fillText('3.50‰',-60,70)
    ctx2.fillText('2.00‰',-25,70)
    
    ctx2.fillText('10‰',125,270)
    ctx2.fillText('2.07‰',20,270)
    
    ctx3.beginPath();
    ctx3.arc(45,200,40,1.5*Math.PI,2.5*Math.PI);
    ctx3.stroke();
    
    ctx3.beginPath();
    ctx3.setLineDash([]);
    ctx3.moveTo(45,148);
    ctx3.lineTo(45,170);
    ctx3.lineTo(25,159);
    ctx3.lineTo(45,148)
    ctx3.stroke();
}


function apagarTodos(type){
    
    if(type!== "undefined"){ //Essa variável só é definida no final do processo, de modo que haverá o reset quando o operador apertar o calcular da segunda vez em diante
        
        ctx1.clearRect(-300, -300, 600, 600);
        ctx2.clearRect(-300, -300, 600, 600);
        ctx3.clearRect(-300, -300, 600, 600);

        ctx1.translate(-150,0);
        ctx2.translate(-150,0);
        ctx3.translate(-150,0);
    }
}

function apagar(ctx){
    ctx.clearRect(-300, -300, 600, 600);
}

// desenhar linha neutra
function desenharLinhaNeutra(ctx1, ctx2, ctx3, xa, xlim, h){
        ctx1.beginPath();
        ctx1.strokeStyle = 'white'
        ctx1.setLineDash([5, 5]);
        ctx1.lineWidth = "2";
        ctx1.moveTo(150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx1.lineTo(-150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx1.stroke();
    
        ctx2.beginPath();
        ctx2.strokeStyle = 'white'
        ctx2.setLineDash([5, 5]);
        ctx2.lineWidth = "2";
        ctx2.moveTo(150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx2.lineTo(-150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx2.stroke();
    
        ctx3.beginPath();
        ctx3.strokeStyle = 'white'
        ctx3.setLineDash([5, 5]);
        ctx3.lineWidth = "2";
        ctx3.moveTo(150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx3.lineTo(-150, 80 + ((230 * Math.min(xa, xlim)) / h));
        ctx3.stroke();
}

//Fazendo o desenho 2 novamente apos a inserção de dados 14 pixels para cada 1/1000
function redesenharDesenho2(ctx2, eu, eo, fyk){
    ctx2.beginPath();
    ctx2.setLineDash([]);
    ctx2.strokeStyle = '#d3d3d3'
    ctx2.lineWidth = "2";
    ctx2.moveTo(-eu * 14000, 80);
    ctx2.lineTo(0, 80);
    ctx2.lineTo(0, 287);
    ctx2.lineTo(140, 287);

    //deformações ultimas
    ctx2.moveTo(-eu * 14000, 80);
    ctx2.lineTo(-eu * 14000, 88);
    ctx2.moveTo(140, 287);
    ctx2.lineTo(140, 279);

    //deformações para inicio do patamar de escoamento
    ctx2.moveTo(-eo * 14000, 80);
    ctx2.lineTo(-eo * 14000, 88);

    if (fyk == 500 || fyk == 600) {
        ctx2.moveTo(eoaco * 14000, 287);
        ctx2.lineTo(eoaco * 14000, 279);
    }

    ctx2.stroke()

    ctx2.font = "bold 12px Montserrat";
    ctx2.fillText((eu * 1000).toFixed(2)+'‰', -60, 70);
    ctx2.fillText((eo * 1000).toFixed(2)+'‰', -25, 70);

    if (fyk == 500 || fyk == 600) {
        ctx2.fillText((eoaco * 1000).toFixed(2)+'‰', 20, 270);
    }

    ctx2.fillText(10+'‰', 125, 270);
}

function desenharAlamb(ctx1, alamb, xa, xlim, h){
    
    ctx1.beginPath();
    ctx1.setLineDash([5, 3]);
    ctx1.strokeStyle = '#ffa500'
    ctx1.lineWidth = "2";
    ctx1.moveTo(50, 80 + alamb * (230 * Math.min(xa, xlim)) / h);
    ctx1.lineTo(-50, 80 + alamb * (230 * Math.min(xa, xlim)) / h);
    ctx1.stroke();
}

function desenharTensaoConcreto(ctx3, alamb, xa, xlim, h){
    ctx3.beginPath();
    ctx3.strokeStyle = '#ffa500'
    ctx3.lineWidth = "2";
    ctx3.moveTo(-20, 80 + alamb * (230 * Math.min(xa, xlim)) / h);
    ctx3.lineTo(20, 80 + alamb * (230 * Math.min(xa, xlim)) / h);
    ctx3.lineTo(20, 80);
    ctx3.lineTo(-20, 80);
    ctx3.stroke();
}

function escreverAreaAco(ctx1, aas, asl){
    ctx1.beginPath();
    ctx1.fillStyle = "#FF6464";
    ctx1.fillRect(-20, 287, 40, 5);

    ctx1.font = "bold 12px Montserrat";
    ctx1.fillText(aas.toFixed(2) + ' cm²', -22, 282);

    //Escrevendo a área de aço comprimida na figura 1, desenha apenas se estiver com armadura dupla

    if (asl > 0) {
        ctx1.beginPath();
        ctx1.fillStyle = "#6464FF";
        ctx1.fillRect(-20, 103, 40, 5);

        ctx1.font = "bold 12px Montserrat";
        ctx1.fillText(asl.toFixed(2) + ' cm²', -22, 98);
    }
}

function desenharLinhaDeformacao(ctx2, epc, eps){
    ctx2.beginPath();
    ctx2.strokeStyle = "#FF6464"
    ctx2.lineWidth = "1";
    ctx2.moveTo(-epc * 14000, 80);
    ctx2.lineTo(eps * 14000, 287);
    ctx2.stroke();
}

function escreverLinhaDeformacao(ctx2, epc, eps){
    ctx2.beginPath();
    ctx2.fillStyle = 'white'
    ctx2.font = "bold 16px Arial";
    ctx2.fillText((epc*1000).toFixed(2)+'‰',-120,100);
    ctx2.stroke();

    ctx2.beginPath();
    ctx2.fillStyle = 'white'
    ctx2.font = "bold 16px Arial";
    ctx2.fillText((eps*1000).toFixed(2)+'‰',-120,280);
    ctx2.stroke();
}