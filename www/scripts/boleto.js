function verificaLinhaDigitavel(){
    var aux ;
    var dig1,dig2,dig3 ;
    var numb,part,dv;
    var erro = 0 ;

    //Verifica digito verificador do 1 bloco
    aux = $('#b1').val() + $('#b2').val(); 
    aux = aux.substr(0,9);
    dig1= digitoVerificadorBloco(aux);
    $("#exiberesultado").html(aux);
    if($('#b2').val().substr(4,1) == dig1){
        bloco = $("#exiberesultado").html()+"<font style=\"background:green;color:black;\">"+dig1+'</font>';
    }
    else{
        erro = 1 ;
        bloco = $("#exiberesultado").html()+"<font style=\"background:red;color:black;\">"+dig1+'</font>'
    }
    $("#exiberesultado").html(bloco.substr(0,5)+'.'+bloco.substr(5,1000));

    //Verifica digito verificador do 2 bloco
    aux = $('#b3').val() + $('#b4').val(); 
    aux = aux.substr(0,10);
    dig2= digitoVerificadorBloco(aux);
    if($('#b4').val().substr(5,1) == dig2){
        bloco = aux+"<font style=\"background:green;color:black;\">"+dig2+'</font>';
    }
    else{
        erro = 1 ;
        bloco = aux+"<font style=\"background:red;color:black;\">"+dig2+'</font>';
    }
    $("#exiberesultado").html($("#exiberesultado").html()+' '+bloco.substr(0,5)+'.'+bloco.substr(5,1000));

    //Verifica digiro verificador do 3 bloco
    aux = $('#b5').val() + $('#b6').val(); 
    aux = aux.substr(0,10);
    dig3= digitoVerificadorBloco(aux);
    
    if($('#b6').val().substr(5,1) == dig3){
        bloco = aux+"<font style=\"background:green;color:black;\">"+dig3+'</font>';   
    }
    else{
        erro = 1 ;
        bloco = aux+"<font style=\"background:red;color:black;\">"+dig3+'</font>';
    }
    $("#exiberesultado").html($("#exiberesultado").html()+' '+bloco.substr(0,5)+'.'+bloco.substr(5,1000));

    //Enviado para o calculaNovoCodigo
    //$("#exiberesultado").html("<p style='color: #999; font-size: 15px;'>"+$("#exiberesultado").html()+" "+dv+' '+$('#b8').val()+"</p>");
   
    //Verificando se foi detectado algum erro no codigo de barras
    if( erro == 1){
        alert('Foram detectados erros no codigo de barras. Os erros estão marcados de vermelho. Corrija e tente novamente. ')
    } 
    else{
        vencimento = $('#b8').val().substr(0,4);
        
        
        $('#exibeVencimento').html("<p style='color: #999; font-size: 15px;'>Vencimento: "+fatorVencimento(vencimento,'fator')+"</p>");
        $('#exibeValor').html("<p style='color: #999; font-size: 15px;'>Valor do Boleto: "+String(parseInt($('#b8').val().substr(4,8)))+','+$('#b8').val().substr(12,2)+"</p>");
        valor = parseFloat( $('#b8').val().substr(4,8)+'.'+$('#b8').val().substr(12,2) ) ;

        calculaNovoCodigo();        
    }
}

function calculaNovoCodigo(){
    //Capturando o fator de vencimento e transformando em data formato dd/mm/AAAA
    var data1_ = fatorVencimento($('#b8').val().substr(0,4),'fator');
    //Pegando a data original e transformando em objeto data javascript
    var date1 = new Date(data1_.substr(6,4), parseInt(data1_.substr(3,2))-1, data1_.substr(0,2));
    //Pegando a data vencimento e transformando em objeto data javascript
    var date2 = new Date($('#vencimento').val().substr(6,4), parseInt($('#vencimento').val().substr(3,2)) - 1, $('#vencimento').val().substr(0,2));
    //Calculando diferenca de dias entre as datas
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    var juros = parseFloat($('#juros').val().replace(',','.'));

    var multa = parseFloat($('#multa').val().replace(',','.'));

    newfatorvencimento = diffDays + parseInt($('#b8').val().substr(0,4));

    //calculando juos em reais ou percentual
    if(!juros_.isChecked()){
        juros = juros * diffDays;
    }
    else{
        juros = (valor * (juros/100)) * diffDays;
    }
    //Calculando multa em reais ou percentual
    if(!multa_.isChecked());
    else{
        multa = valor * (multa/100) ;
    }

    novovalor = valor + juros + multa ;
    novovalor = novovalor.toFixed(2);

    //Calculando digito verificador geral
    numb = $('#b1').val()+$('#b2').val()+$('#b3').val()+$('#b4').val()+$('#b5').val()+$('#b6').val()+padzero(newfatorvencimento,4)+padzero(novovalor.replace('.',''),10);
    part = numb.substr(0,4) + padzero(newfatorvencimento,4)+padzero(novovalor.replace('.',''),10) + numb.substr(4,5) + numb.substr(10,10) + numb.substr(21,10);
    dv = mod11(part);

    $("#exiberesultado").html("<p style='color: #999; font-size: 15px;'>"+$("#exiberesultado").html()+" "+dv+' '+padzero(newfatorvencimento,4)+padzero(novovalor.replace('.',''),10)+"</p>");

    $('#campoparacopiar').val($('#b1').val()+$('#b2').val()+$('#b3').val()+$('#b4').val()+$('#b5').val()+$('#b6').val()+dv+ padzero(newfatorvencimento,4)+padzero(novovalor.replace('.',''),10));
}

function fatorVencimento(dado,tipo){
    if(tipo == 'fator'){
        var dias = parseInt(dado);

        Date.prototype.adicionarDias = function(dias) {
            var data = new Date(this.valueOf());
            data.setDate(data.getDate() + dias);
            return data;
        };

        // Meses são indexados em zero em JavaScript, logo é necessário subtrair 1 do mês desejado.
        var dataInicialFebraban = new Date(1997, 10 - 1, 7);
        dataInicialFebraban =  dataInicialFebraban.adicionarDias(dias);
        vencimento = (("0" + (dataInicialFebraban.getDate())).slice(-2) + '/' + ("0" + (dataInicialFebraban.getMonth() + 1)).slice(-2) + '/' + dataInicialFebraban.getFullYear());
        return vencimento;
    }
    else{

    }
}

function padzero(campo, tamanho){
    var newcampo = '';
    var tamreal ;
    var i ;
    tamreal = campo.length ;

    for(i = 0 ; i < (tamanho - tamreal) ; i++){
        newcampo += '0';
    }
    newcampo = newcampo + campo ;
    return newcampo;
}
function mod11(num) {  
    var base = 9;         
    var fator = 2;        
    var parcial = 0;  
    var soma = 0;

    for (i=num.length;i>0;i--) {             
        nn = num.substr(i-1,1);
        parcial = nn*fator;
        soma += parcial; 
        if (fator==base) fator=2;
        else fator++;
    }         

    resto = soma % 11;
    dv = 11 - resto;
    if (dv==0||dv==10||dv==11) dv = 1;
    return dv;
}  

function digitoVerificadorBloco(linhadigitavel){
    var digitov ;
    var soma = 0.0;
    var aux ;
    var log = '';
    var controle = 0 ; //usado para saber quando será 2 ou 1 o fator de multiplicacao

    for( i = (linhadigitavel.length - 1) ; i >= 0 ; i-- ){
        log+=i+"caractere"+linhadigitavel[i];
        if(controle%2 == 0){
            aux = parseInt(linhadigitavel[i])*2;
            if(aux > 9) aux-=9;
            log+="soma"+aux+"\n";
        }
        else{
            aux = parseInt(linhadigitavel[i])*1;
            log+="soma"+aux+"\n";

        }
        soma+=aux;
        log+="resultado"+soma+"\n";
        controle++;
    }
    
    aux = soma%10;
    if(aux == 0)
        return 0 ;
    
    aux=10-aux;

    return aux ;
}

    ons.ready(function() {
        data = new Date();
        var mes = (parseInt(data.getMonth())+1);
        var dia = data.getDate();
        if(parseInt(dia) < 10)dia = '0'+dia;
        if(mes < 10)mes = '0'+mes ;
            $('#vencimento').val(dia+'/'+mes+'/'+data.getFullYear());
            $('#b1').keyup(function(event){
                if($(this).val().length >= 5){
                    $(this).val($(this).val().substr(0,5));
                    $('#b2').focus();
                }
            });

            $('#b2').keyup(function(event){
                if($(this).val().length >= 5){
                    $(this).val($(this).val().substr(0,5));
                    $('#b3').focus();
                }
            });

            $('#b3').keyup(function(event){
                if($(this).val().length >= 5){
                    $(this).val($(this).val().substr(0,5));
                    $('#b4').focus();
                }
            });

            $('#b4').keyup(function(event){
                if($(this).val().length >= 6){
                    $(this).val($(this).val().substr(0,6));
                    $('#b5').focus();
                }
            });

            $('#b5').keyup(function(event){
                if($(this).val().length >= 5){
                    $(this).val($(this).val().substr(0,5));
                    $('#b6').focus();
                }
            });

            $('#b6').keyup(function(event){
                if($(this).val().length >= 6){
                    $(this).val($(this).val().substr(0,6));
                    $('#b7').focus();
                }
            });

            $('#b7').keyup(function(event){
                if($(this).val().length >= 1){
                    $(this).val($(this).val().substr(0,1));
                    $('#b8').focus();
                }
            });

            $('#b8').keyup(function(event){
                if($(this).val().length >= 14){
                    $(this).val($(this).val().substr(0,14));

                }
            });
    }); 