let total = 0;
let cantidad = 0;
let seguir = "no";
let verdura=" ";

//iteración do... while
do{
    if (seguir=="no"){
        alert("Bienvenido a La Ensalada Básica Verdulería. Somos una verdulería que solo vende lechuga, tomate y zanahoria");
    }
    verdura= prompt ("Que le doy? (lechuga/tomate/zanahoria)");

    //condicional if... else
    if (verdura=="lechuga"){
       cantidad= prompt("La lechuga está 200 pesos la plantita, cuantas llevas?");
    }else{
        if(verdura=="tomate"){
           cantidad= prompt("El tomate está 500 pesos el kilo, cuanto llevas?");

        }else{
            if(verdura=="zanahoria"){
               cantidad= prompt("La zanahoria está 150 pesos el kilo, cuanto llevas?");

            }else{
                alert("Perdón, no te entendí bien, me repetís?");
                seguir="si";
                continue;
            }
        }

    }
    //llamado a función para calcular en base a la verdura y cantidad especificada
    total = total + cuentaTotal(verdura,cantidad);
    alert ("Hasta ahora vamos " + total + " pesos");
    seguir = prompt("Querés algo mas? (si/no)" );
}while(seguir=="si");

alert ("El total sería " + total + " pesos");
alert ("Muchas gracias por la compra");

//declaro función
function cuentaTotal(verdura,cantidad){

    //condicional switch
    switch (verdura){
        case "lechuga":
            return cantidad*200;
        
        case "tomate":
            return cantidad*500;
        
        case "zanahoria":
            return cantidad*150;

        default:
            return 0;
    }

}
