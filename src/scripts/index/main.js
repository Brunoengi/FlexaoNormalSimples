desenhoinicial()
function dimensionar() {

    apagarTodos(typeof dominio); //Reseta os gráficos caso não seja a primeira vez que o usuário aperta no calcular

    if (typeof dominio !== "undefined") {
        //Essa variável só é definida no final do processo, de modo que haverá o reset quando o operador apertar o calcular da segunda vez em diante
        desenhoinicial();
    }

    let [h, b, d, fck, fyk, E, gamac, gamas, gamaf, amk, beta] = pegarInputs().map(el => pegarValues(el))

    if (fck <= 50) {
        var alamb = 0.8;
        var alfac = 0.85;
        var eu = 3.5;
        var qlim = 0.8 * beta - 0.35;
    } else {
        var alamb = 0.8 - (fck - 50) / 400;
        var alfac = 0.85 * (1 - (fck - 50) / 200);
        var eu = 2.6 + 35 * ((90 - fck) / 100) ** 4;
        var qlim = 0.8 * beta - 0.45;
    }
    // Conversão de unidades: transformando para kN e cm
    amk = 100 * amk;
    fck = fck / 10;
    fyk = fyk / 10;
    E = 100 * E;
    // Resistências de cálculo
    let fcd = fck / gamac;
    let tcd = alfac * fcd;
    let fyd = fyk / gamas;
    let amd = gamaf * amk;

    // Parâmetro geométrico
    let delta = (h - d) / d;
    // Momento limite
    let amilim = alamb * qlim * (1 - 0.5 * alamb * qlim);
    // Momento reduzido solicitante
    let ami = amd / (b * d * d * tcd);

    /*--------------------Ver como fazer depois-----------------------------*/
    if (ami <= amilim) {
        // Armadura simples
        var qsi = (1 - Math.sqrt(1 - 2 * ami)) / alamb;
        var aas = (alamb * qsi * b * d * tcd) / fyd;
        var asl = 0;

    } else {
        // Armadura dupla
        var qsia = eu / (eu + 10);

    /*--------------------Ver como fazer depois-----------------------------*/

        // Deformação da armadura de compressão
        var esl = (eu * (qlim - delta)) / qlim;
        esl = esl / 1000;
        var ess = Math.abs(esl);
        var eyd = fyd / E;
        // Cálculo da tensão no aço
        if (ess < eyd) {
            var tsl = E * ess;
        } else {
            var tsl = fyd;
        }
        if (esl < 0) {
            tsl = -tsl;
        }

        // Cálculo das áreas de aço quando armadura dupla
        var asl = ((ami - amilim) * b * d * tcd) / ((1 - delta) * tsl);
        var aas = ((alamb * qlim + (ami - amilim) / (1 - delta)) * b * d * tcd) / fyd;
    }
    // Armadura mínima
    var a = 2 / 3;
    fck = 10 * fck;
    fyd = 10 * fyd;
    if (fck <= 50) {
        romin = (0.078 * fck ** a) / fyd;
    } else {
        romin = (0.5512 * Math.log10(1 + 0.11 * fck)) / fyd;
    }
    if (romin < 0.0015) {
        romin = 0.0015;
    }
    asmin = romin * b * h;
    if (aas < asmin) {
        aas = asmin;
    }
    //Área de aço tracionada e área de aço comprimida

    let ast = Number(aas.toFixed(2))
    let asc = Number(asl.toFixed(2))

    //Textos e respostas

    let textosRespostas = {
        'tracao':[document.getElementById('txtTracionada'),document.getElementById('resAreaTracionada')],
        'compressao':[document.getElementById('txtComprimida'),document.getElementById('resAreaComprimida')]
    }

    textosRespostas['tracao'][0].innerText = 'Tracionada: '
    textosRespostas['compressao'][0].innerText = 'Comprimida: '
    textosRespostas['tracao'][1].innerText = ast + " cm² "
    textosRespostas['compressao'][1].innerText = asc + " cm²"

    //FIM DA PRIMEIRA ETAPA E INÍCIO DA SEGUNDA

    //Cálculo do qsi
    if (ami > amilim) {
        qsi = (1 - Math.sqrt(1 - 2 * amilim)) / alamb;
    } else {
        qsi = (1 - Math.sqrt(1 - 2 * ami)) / alamb;
    }

    //linha neutra
    xa = qsi * d;


    //Concreto do tipo 1
    if (fck <= 50) {
        eu = 3.5 / 1000
        eo = 0.002
    } else {
        eu = (2.6 + 35 * ((90 - fck) / 100) ** 4) / 1000
        eo = ((2 + 0.085 * ((fck - 50) ** 0.53))) / 1000
    }

    //Verificar se a posição da linha neutra está acima do limite permitido pela NBR
    if (fck <= 50) {
        xlim = 0.45 * d;
    } else {
        xlim = 0.35 * d;
    }

    if (xa > xlim) {
        dominio = "3";
        ruptura = " A ruptura acontece no concreto";
        xa = xlim;
        eps = (eu * ((d - xa) / xa));
        epc = eu;
    }
    else {
        dominio = "2";
        ruptura = "A ruptura acontece no aço";
        eps = 10 / 1000;
        epc = (0.01 * xa) / (d - xa);
        if (epc > eu) {
            dominio = "3";
            epc = eu;
            ruptura = " A ruptura acontece no concreto";
            eps = (eu * ((d - xa) / xa));
        }
    }

    //Apenas convertendo o valor de kN/cm² para MPa
    fyk = 10 * fyk

    if (fyk == 500) {
        eoaco = 2.07 / 1000;
    } else if (fyk == 600) {
        eoaco = 2.48 / 1000;
    } else {
        console.log("Não foi utilizado aço CA-50 nem CA-60, o aço utilizado foi: " + fyk)
    }

    //Escrevendo o domínio 
    document.getElementById('resDominio').innerHTML = "Domínio: " + dominio;

    //Resultante de tração
    let resTracao = aas * fyd / 10; //Divide por 10 para deixar em kN


    //refazendo o segundo desenho com as deformações ultimas e de escoamento do aço e do concreto
    apagar(ctx2)

    redesenharDesenho2(ctx2, eu, eo, fyk)
    desenharLinhaNeutra(ctx1, ctx2, ctx3, xa, xlim, h)

    desenharAlamb(ctx1, alamb, xa, xlim, h)

    //Tensão no concreto - Desenho 3 
    desenharTensaoConcreto(ctx3, alamb, xa, xlim, h)


    //Escrevendo area de aço tracionada na figura 1
    escreverAreaAco(ctx1, aas, asl)
  

    //Linha de deformação - Desenho 2 
    desenharLinhaDeformacao(ctx2, epc, eps)

    //Escrevendo a deformação do concreto e aço - Desenho 2
    escreverLinhaDeformacao(ctx2, epc, eps)

    //escrevendo LN
    desenharLN(ctx1, xa, xlim, h)

    //desenhando as setas referente ao desenho 3 das resultntes
    desenhoSeta(ctx3, alamb, xa, xlim, h, resTracao)

    //Escrevendo a resultante de compressão
    if (asl == 0) {
        resCompressao = resTracao;
    }
    else {
        resCompressaoAco = asl * fyd / 10; //Divide por 10 para transformar em kN
        resCompressao = resTracao - resCompressaoAco
        ctx3.beginPath();
        ctx3.fillStyle = '#6464FF';
        ctx3.strokeStyle = '#6464FF';
        ctx3.fillRect(-20, 103, -40, 5);
        ctx3.moveTo(40, 105);
        ctx3.lineTo(-20, 105);
        ctx3.lineTo(-15, 110);
        ctx3.moveTo(-20, 105);
        ctx3.lineTo(-15, 100);
        //Escrevendo texto da força do aço na seção comprimida
        ctx3.font = "bold 12px Arial";
        ctx3.fillText(resCompressaoAco.toFixed(2) + " kN", 45, 100);
        ctx3.stroke();

    }
    ctx3.beginPath();
    ctx3.fillStyle = '#ffa500';
    ctx3.fillText(resCompressao.toFixed(2) + " kN", 45, 95 + alamb * (230 * Math.min(xa, xlim)) / (2 * h));
    ctx3.stroke();

    //Desenhando o valor do momento resultante na figura 3
    ctx3.beginPath();
    ctx3.fillStyle = "#d3d3d3";
    ctx3.font = "bold 14px Arial"
    ctx3.fillText("M", 50, 200);
    ctx3.font = "bold 12px Arial";
    ctx3.fillText("Rd", 63, 205);
    ctx3.fillText((amd / 100) + "kN.m", 88, 200);
    ctx3.stroke();

    //Fazendo as cotas do desenho 1 e colocando os textos
    ctx1.beginPath();
    ctx1.setLineDash([]);

    //Criando a cota da linha neutra 
    ctx1.strokeStyle = '#d3d3d3';
    ctx1.moveTo(70, 80);
    ctx1.lineTo(70, 80 + ((230 * Math.min(xa, xlim)) / h));
    ctx1.moveTo(65, 80);
    ctx1.lineTo(75, 80);
    ctx1.moveTo(65, 80 + ((230 * Math.min(xa, xlim)) / h));
    ctx1.lineTo(75, 80 + ((230 * Math.min(xa, xlim)) / h));
    ctx1.fillText(xa.toFixed(2) + ' cm', 75, 85 + ((230 * Math.min(xa, xlim)) / (2 * h)))

    //Criando a cota da seção comprimida lambida * x
    ctx1.moveTo(-80, 80);
    ctx1.lineTo(-70, 80);
    ctx1.moveTo(-75, 80);
    ctx1.lineTo(-75, 80 + alamb * (230 * xa) / h);
    ctx1.moveTo(-70, 80 + alamb * (230 * xa) / h);
    ctx1.lineTo(-80, 80 + alamb * (230 * xa) / h);

    //Criando o texto do lambida multiplicado por X
    ctx1.fillText(alamb.toFixed(2) + ' x', -113, 85 + alamb * (230 * xa) / (2 * h))
    ctx1.stroke();

    //Fazendo a cota do desenho 3
    ctx3.beginPath();
    ctx3.strokeStyle = 'white';
    ctx3.moveTo(-80, 80 + alamb * (230 * Math.min(xa, xlim)) / (2 * h));
    ctx3.lineTo(-80, 289);
    ctx3.moveTo(-75, 80 + alamb * (230 * Math.min(xa, xlim)) / (2 * h));
    ctx3.lineTo(-85, 80 + alamb * (230 * Math.min(xa, xlim)) / (2 * h));
    ctx3.moveTo(-85, 289);
    ctx3.lineTo(-75, 289);
    ctx3.stroke();
    ctx3.beginPath();
    ctx3.fillStyle = 'white';


    //Escrevendo o texto da cota do desenho 3
    ctx3.fillText((d - (alamb * (xa / 2))).toFixed(2) + " cm", -75, 200)
    ctx3.stroke();

    //Enviando os dados para o main.js

    let dadoPrincipal = {
        alamb: alamb,
        alfac: alfac,
        eu: eu,
        qlim: qlim,
        amk: amk,
        fck: fck,
        fyk: fyk,
        E: E,
        fcd: fcd,
        tcd: tcd,
        fyd: fyd,
        amd: amd,
        delta:delta,
        amilim: amilim,
        ami: ami,
        asl: asl,
        aas: aas,
        a: a,
        romin: romin,
        asmin: asmin,
        ast: ast,
        aas: aas

    }

    window.api.dadosRotinaPrincipal(dadoPrincipal);
}