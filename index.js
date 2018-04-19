//importando
var express = require('express');
var bodyParser = require('body-parser');
var recuest = require('request');

const APP_TOKEN = 'EAACXJlqUDXgBAEk5rwZA6ZBcrABZBKkErNQ3HV7pugleCAEiJleXJR6BuV6eeWGkaZCApajJxWFv9Br3QfJmPEKphd4KyZC9Q9nqu14yGVw3771n3txsfoBmVNragoPU3EiGghVnPOqdonPUMLI2Lvba5I65pT74n50SfZBNPmnDaxgKh9GOle';


//instancia
var app= express();
app.use(bodyParser.json());

//puerto
app.listen(3000,function(){
	console.log("el servidor se encuentra en el puerto 3000");	
});

app.get('/', function(rep, res){
	res.send('Bienvenido de nuevo');
});

app.get('/webhook', function(rep, res){
if (rep.query['hub.verify_token'] === 'hola_test'){
	res.send(rep.query['hub.challenge']);
}else{
	res.send('No tiene porqué entrar');
}
});

/*
{ object: 'page',
  entry:
   [ { id: '1045084632309942',
       time: 1524063944876,
       messaging: [Array] } ] }
^C
*/
app.post('/webhook', function(rep, res){

	var data = rep.body;
	if (data.object == 'page') {

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){

				if (messagingEvent.message) {
					reciveMessage(messagingEvent);
				}

			});
     });
		res.sendStatus(200);
}
	
});

function reciveMessage(event){
var senderID = event.sender.id;
var messageText = event.message.text;
console.log(senderID);
console.log(messageText);

evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId, message){
var finalMessage ='';

if (isContain(message,'ayuda')) {
    finalMessage = 'Por el momento no te puedo ayudar';
}else if (isContain(message,'gatito')) {

sendMessageImage(recipientId);


}else if (isContain(message,'clima')) {

finalMessage = 'Por el momento no tengo disponible el clima';



}else if (isContain(message,'info')) {

sendMessageTemplate(recipientId);



}else{
	finalMessage= 'solo sé repetir las cosas:' + message;
}
sendMessageText(recipientId, finalMessage);


}

function sendMessageText (recipientId, message){
	var messageData = {
		recipient: {
			id: recipientId
		},
		message:{
			text: message
		}
	};
 callSendAPI(messageData);
}

function sendMessageImage(recipientId){
	var messageData = {
		recipient: {
			id: recipientId
		},
		message:{
			attachment:{
              type:"image",
              payload:{
              	url: "https://api.imgur.com/FDFmXfO.jpg"
              	
			}
		}
	}
	};
 callSendAPI(messageData);
}

function sendMessageTemplate(recipientId){
	var messageData = {
		recipient: {
			id: recipientId
		},
		message:{
			attachment:{
				type: "template",
				payload:{
					template_type:"generic",
					elements:[elemenTemplate()]
				}
			}
		}
	};
 callSendAPI(messageData);
}
function elemenTemplate(){
return{
	title:"Simón Simón",
	subtitle:"Soy un amante a los gatos",
	item_url:"https://www.facebook.com/Simon-1045084632309942/",
	image_url:"https://i.imgur.com/mGBEqkL.jpg",
    buttons:[buttonTemplate()],
    }
}
function buttonTemplate(){
	return{
		type:"web_url",
		url: "https://www.facebook.com/Simon-1045084632309942/",
		title: "Mirame :)"
	}
}
	


function callSendAPI(messageData){
//petición
	recuest({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token : APP_TOKEN},
		method: 'POST',
		json: messageData
    }, function(error,response,data){
    	if (error) {
    		console.log('No es posible enviar el mensaje')
    	}else{
    		console.log('El mensaje fué enviado');
    	}
    
	});

}
/*

function getMessageWeather(temp_min){
	if (temp_min< 10) {
		return "La temperatura es de "+ temp_min+ " Será mejor que no lo bañes"
	}
	return "La temperatura es de "+ temp_min+ "es un buen día para bañar a tu gatito";
}

function getWeather(callback){
	recuest('api.openweathermap.org/data/2.5/weather?q=London ',
function(error,response, data){
	if (!error) {
		var response = JSON.parse(data);
		var temperature = response.weather.temp_min;
		callback(temperature);
	}

});

}
*/
function isContain (sentence, word){
	return sentence.indexOf(word) > -1;
}

//https://codigofacilito.com/videos/9-templates