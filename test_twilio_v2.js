const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const request = require('request');
const apiai = require('apiai');
const apiaiApp = apiai('e8ea1d6dd3f148619da4a89184cc6b75');
global.existe=0;
const client = require('twilio')(
  'ACc9ff1deee6205185226349a1e27cc807',
  'a440212535d75a0dad0c7ba2972ff8b1'
);

var getContext = require("./getContextId.js");
var userCheck = require("./userCheck.js");
var pru = require("./pru.js");

var userPhoneNumber;

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'M9d[:V<3') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Envío de mensajes de api.ai al Facebook a través de un POST */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage_toAPI(event);
        }
      });
    });
    res.status(200).end();
  }
});

/*  */
function sendMessage_toAPI(event) {
// enviar mensaje que le envió el Messenger al API
  let sender = event.sender.id;
  let text = event.message.text;

  userPhoneNumber = '';


  users = userCheck.fetchUser();
  //users2 = pru.fetchUser();

  console.log('users ->' + JSON.stringify(users));
  console.log('sender ->' + sender);

  var userExist = users.filter((user) => user.userid === sender);
  

  console.log('userExist -> ' + userExist);

 if(userExist[0] && userExist[0].chance=='1')
  {
  
    userPhoneNumber = userExist[0].phoneNumber;

    var reg2 = /^\d+$/;
    if(reg2.test(event.message.text)){
      userCheck.resetearpreguntas(userExist[0].id);
      userCheck.chancea0(userExist[0].id);
      respuestaapi(event.message.text,event);
    } else{
      let messageData = {
            recipient: {id: sender},
            message: {text: "digita el numero a llamar porfavor"}
          };
            sendMessage(messageData);
    }

   
  } else if(!userExist[0]) {
   

    var reg = /^\d+$/;
    if(reg.test(event.message.text)){
     
      respuestaapi('nuevo numero '+event.message.text,event);
      userCheck.addUser(event.sender.id,'+51'+event.message.text,'0',0,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],userCheck.fetchUser().length+1,'',0,0,'2017-09-15T22:15:18.214Z','1');
       
       users = userCheck.fetchUser();
       var userExist = users.filter((user) => user.userid === sender);
      
    } else{

      if(event.message.text=='si' || event.message.text=='Si' || event.message.text=='SI'){
       
       respuestaapi('sigamos',event); 
       //userCheck.aumentarcuentapreguntas(userExist[0].id);
      }else{////////
     
      respuestaapi('nuevo numero',event);
    }
    }}

   if(userExist[0] && userExist[0].chance=='0') {
      if(userCheck.comparafecha(userExist[0].id)) {
      

      if((event.message.text=='ok' || event.message.text=='Ok' || event.message.text=='OK') && userExist[0].cuentapreguntas<2){
            var z= pru.aleatorio(userExist[0].arraypreguntas);
            if(z==undefined){
              userCheck.resetarray(userExist[0].id);
              userCheck.minusindex(userExist[0].id,userExist[0].status);
              var z= pru.aleatorio(userExist[0].arraypreguntas);
            }
            userCheck.minusindex(userExist[0].id,z);
            var pregunta= pru.selectPregunta(z);
            var alternativas= pru.selectAlternativas(z);
            userCheck.grabaridpreguntaactual(userExist[0].id,pru.selectRespuesta(z),pru.grabaridpregunta(z));
            let messageData = {
            recipient: {id: sender},
            message: {text: pregunta+alternativas}
          };
            sendMessage(messageData);
      
            userCheck.aumentarcuentapreguntas(userExist[0].id);
      }else if((event.message.text=='a' || event.message.text=='b' || event.message.text=='c' || event.message.text=='d' || event.message.text=='A' || event.message.text=='B' || event.message.text=='C' || event.message.text=='D') &&  userExist[0].cuentapreguntas==1){
            if(event.message.text!= userExist[0].idultimapregunta && event.message.text!= userExist[0].idultimapregunta.toUpperCase()){
                userCheck.resetearpreguntas(userExist[0].id);
                userCheck.setearfecha(userExist[0].id);
                let messageData = {
                recipient: {id: sender},
                message: {text: "Uy fallaste esta pregunta. Pero no te preocupes. Puedes volver a intentarlo dentro de una semana"}
                };
                sendMessage(messageData);
            }else{
            
            var z= pru.aleatorio(userExist[0].arraypreguntas);
            if(z==undefined){
              userCheck.resetarray(userExist[0].id);
              userCheck.minusindex(userExist[0].id,userExist[0].status);
              var z= pru.aleatorio(userExist[0].arraypreguntas);
            }
            userCheck.minusindex(userExist[0].id,z);
            var pregunta= pru.selectPregunta(z);
            var alternativas= pru.selectAlternativas(z);
            userCheck.grabaridpreguntaactual(userExist[0].id,pru.selectRespuesta(z),pru.grabaridpregunta(z));
            let messageData = {
            recipient: {id: sender},
            message: {text: "Muy bien, sigamos con la siguiente pregunta!              "+pregunta+alternativas}
          };
            sendMessage(messageData);
            userCheck.aumentarcuentapreguntas(userExist[0].id);
          }
      }else if((event.message.text=='a' || event.message.text=='b' || event.message.text=='c' || event.message.text=='d' || event.message.text=='A' || event.message.text=='B' || event.message.text=='C' || event.message.text=='D') &&  userExist[0].cuentapreguntas==2){
            if(event.message.text!= userExist[0].idultimapregunta && event.message.text!= userExist[0].idultimapregunta.toUpperCase()){
                userCheck.resetearpreguntas(userExist[0].id);
                userCheck.setearfecha(userExist[0].id);
                let messageData = {
                recipient: {id: sender},
                message: {text: "Uy fallaste esta pregunta. Pero no te preocupes. Puedes volver a intentarlo dentro de una semana"}
                };
                sendMessage(messageData);
            }else{
              
            var z= pru.aleatorio(userExist[0].arraypreguntas);
            if(z==undefined){
              userCheck.resetarray(userExist[0].id);
              userCheck.minusindex(userExist[0].id,userExist[0].status);
              var z= pru.aleatorio(userExist[0].arraypreguntas);
            }
            userCheck.minusindex(userExist[0].id,z);
            var pregunta= pru.selectPregunta(z);
            var alternativas= pru.selectAlternativas(z);
            userCheck.grabaridpreguntaactual(userExist[0].id,pru.selectRespuesta(z),pru.grabaridpregunta(z));
            let messageData = {
            recipient: {id: sender},
            message: {text: "Muy bien, sigamos con la siguiente pregunta!              "+pregunta+alternativas}
          };
            sendMessage(messageData);
            userCheck.aumentarcuentapreguntas(userExist[0].id);
          }
      } else if(((event.message.text=='a' || event.message.text=='b' || event.message.text=='c' || event.message.text=='d' || event.message.text=='A' || event.message.text=='B' || event.message.text=='C' || event.message.text=='D' ) &&  userExist[0].cuentapreguntas==3) || userExist[0].cuentapreguntas>=4 ){
            if((event.message.text!= userExist[0].idultimapregunta && event.message.text!= userExist[0].idultimapregunta.toUpperCase()) && userExist[0].cuentapreguntas<4){
                userCheck.resetearpreguntas(userExist[0].id);
                userCheck.setearfecha(userExist[0].id);
                let messageData = {
                recipient: {id: sender},
                message: {text: "Uy fallaste esta pregunta. Pero no te preocupes. Puedes volver a intentarlo dentro de una semana"}
                };
                sendMessage(messageData);
            }else{
              if(event.message.text=='si' || event.message.text=='Si' || event.message.text=='SI'){
                
                userCheck.setearfecha(userExist[0].id);
            userCheck.chancea1(userExist[0].id);
            let messageData = {
                recipient: {id: sender},
                message: {text: "Ingresa el numero telefónico al que quieras llamar porfavor"}
                };
                sendMessage(messageData);
              }else if(event.message.text=='no' || event.message.text=='No' || event.message.text=='NO'){
                let messageData = {
                recipient: {id: sender},
                message: {text: "listo vuelve cuando quieras para hacer tu llamada gratis"}
                };
                sendMessage(messageData);
              } else{
                userCheck.aumentarcuentapreguntas(userExist[0].id);
                if((event.message.text=='a' || event.message.text=='b' || event.message.text=='c' || event.message.text=='d' || event.message.text=='A' || event.message.text=='B' || event.message.text=='C' || event.message.text=='D') ){
              let messageData = {
                recipient: {id: sender},
                message: {text: "Felicidades!!! contestaste correctamente las 3 preguntas. Deseas hacer tu llamada ahora?(si|no)"}
                };
                sendMessage(messageData);
              } else{
                 let messageData = {
                recipient: {id: sender},
                message: {text: "Hola, otra vez! Veo en mi sistema que tienes una llamada gratis que ganaste la otra vez.Quisiera hacer uso de esa llamada ahora? (Responder Si o No)"}
                };
                sendMessage(messageData);
                }
          
          } }
      }else if(userExist[0].cuentapreguntas==0){
        if(event.message.text=='no' || event.message.text=='No' || event.message.text=='NO'){
          let messageData = {
                recipient: {id: sender},
                message: {text: "ok amigo, vuelve cuando quieras, estare esperando que cambies de opinion!          ¿jugamos?(ok|no)"}
                };
                sendMessage(messageData);
        } else{ 
          respuestaapi('perfecto',event);
      }
       
      //userCheck.aumentarcuentapreguntas(userExist[0].id);
      } else{
        let messageData = {
                recipient: {id: sender},
                message: {text: "Respuesta no valida amigo porfavor revisa las alternativas(a,b,c,d) y marca la respuesta correcta"}
                };
                sendMessage(messageData);

      }} else{
        let messageData = {
                recipient: {id: sender},
                message: {text: "Hola, otra vez! Veo en mi sistema que ya probaste hace poco y todavía no puedes volver a intentarlo. Por favor prueba nuevamente luego del "+userExist[0].fechauso+". Gracias!"}
                };
                sendMessage(messageData);}
}}

function respuestaapi(x,event){ 
   let sender = event.sender.id;
  let text = event.message.text;
  var options;

   options = {
      sessionId: 'tabby_cat'

   };
var apiai = apiaiApp.textRequest(x, options);
/* Envia respuesta de API al texto anterior al Facebook */
  apiai.on('response', (response) => {
//    let aiText = response.result.fulfillment.speech;
      //console.log('El response del API.ai: ' + JSON.stringify(response));
      let APIparameters = response.result.contexts[0];
      //console.log('APIparameters: ' + response.result.parameters.contexts[0].parameters);
      if(APIparameters){
        if(APIparameters.parameters.hasOwnProperty("numeroDestino.original")){
          //console.log('El numero a llamar es:' + APIparameters.parameters['numeroDestino.original']);

               var salesNumber = '+51' + APIparameters.parameters['numeroDestino.original'];
               var url = 'http://4cf87970.ngrok.io/outbound/' + encodeURIComponent(salesNumber)

               var options = {
                   //to: "+51966975743",
                   to: userPhoneNumber,
                   from: "+5117088798",
                   url: url,
               };

               console.log('Options de Twilio' + JSON.stringify(options));

               // Place an outbound call to the user, using the TwiML instructions
               // from the /outbound route
               client.calls.create(options);
             

        }
      }
      let aiMessage = response.result.fulfillment.messages;
      console.log('La respuesta de API es: ' + JSON.stringify(aiMessage));
      prepareSendAiMessage(sender, aiMessage);
    });

    apiai.on('error', (error) => {
      console.log(error);
    });

    apiai.end();

  }


function prepareSendAiMessage(sender, aiMessage) {
  var aiText = aiMessage[0].speech;
  console.log('El aiMessage es:' + aiMessage[0]);
  users = userCheck.fetchUser();
  var userExist = users.filter((user) => user.userid === sender);
  let messageData = {
    recipient: {id: sender},
    message: {text: aiText}
  };
  sendMessage(messageData);
}

function sendMessage(messageData) {
  console.log('El message data es:' + JSON.stringify(messageData));
  request({
    url: 'https://graph.facebook.com/v2.10/me/messages',
    qs: {access_token: 'EAACNWw9PJYoBAHZClqkGEpmhJYENf9hjnL0PtHB6NAtMNxfndsvBpE0nJGwqjDPppHOug37WX2lfzxbgifCybOAvY1bZC6QOg7JLJc4HEomjeICkZAZBtvYvAUKS62Mvr3qcBzXGHCYTxKETbyDcvpVSeYUZAO93Q9irjRZAxYngZDZD'},
    method: 'POST',
    json: messageData
  }, (error, response) => {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
      }
    });
  }




// Post para crear la llamada
 app.post('/call', function(request, response) {
     // This should be the publicly accessible URL for your application
     // Here, we just use the host for the application making the request,
     // but you can hard code it or use something different if need be

     var salesNumber = request.body.salesNumber;
     var url = 'http://' + request.headers.host + '/outbound/' + encodeURIComponent(salesNumber)

     var options = {
         to: request.body.phoneNumber,
         from: "+5117088798",
         url: url,
     };

     console.log(options);

     // Place an outbound call to the user, using the TwiML instructions
     // from the /outbound route
     client.calls.create(options)
       .then((message) => {
         console.log(message.responseText);
         response.send({
             message: 'Thank you! We will be calling you shortly.',
         });
       })
       .catch((error) => {
         console.log(error);
         response.status(500).send(error);
       });


 });

// Return TwiML instuctions for the outbound call
 app.post('/outbound/:salesNumber', function(request, response) {
     var salesNumber = request.params.salesNumber;
     var twimlResponse = new VoiceResponse();
    console.log('El Sales number is:' + salesNumber);

    twimlResponse.dial(salesNumber);

    response.send(twimlResponse.toString());

    console.log('Antes del timeout');

    const filterOpts = {
      status: 'in-progress',
      to: '+51966422904',
    };

    var callInProg;

    setTimeout(()=>{
       // enviar.res(usuario,"escribiendo");
       console.log('Entró al timeout de calls ids');
       client.calls.each(filterOpts, call => callInProg = call.sid);
       setTimeout(() => {
       client.calls(callInProg)
         .update({
           status: 'completed',
         })
         .then((call) => console.log('Se colgó la llamada con id: ' + call.sid));
       },2000)
       },50000);

 });
