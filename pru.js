

const fs = require('fs');

var fetchUser = () => {
  try{
    users = JSON.parse(fs.readFileSync('preguntas.json'));
    //console.log ('salida de fectchUser: ' + JSON.stringify(users));
    return users;
  } catch (e) {
    return [];
  }
}

var removeUser = (userid) => { //eliminar el campo del objeto
  users = fetchUser();

  var filteredUsers = users.filter((user) => user.id !== userid);
  saveUser(filteredUsers);
  return users.length !== filteredUsers.length;
};

var saveUser = (users) => {
    fs.writeFileSync('preguntas.json',JSON.stringify(users));
}

var modifyUser = (userid) => {
  users = fetchUser();
  users[userid-1].id=users[userid-1].id+1;
  saveUser(users);
}

var selectUser = (userid) => {
  users = fetchUser();
  console.log(users[userid-1]);
}

var selectPregunta = (preguntaid) => {
  users = fetchUser();
  console.log(users[preguntaid-1].pregunta);
  return (users[preguntaid-1].pregunta);

}

var selectAlternativas = (preguntaid) => {
  users = fetchUser();
  console.log(users[preguntaid-1].alternativas);
  return (users[preguntaid-1].alternativas);
}

var selectRespuesta = (preguntaid) => {
  users = fetchUser();
  console.log(users[preguntaid-1].respuesta);
  return (users[preguntaid-1].respuesta);
}


function aleatorio(array) {
  do{
    if(array.length<2){
      break;
    }
    var x =array[Math.floor(Math.random()*15)+1];
    }while(x==undefined)
  return x;
}

var grabaridpregunta = (idx) => {
  var users = fetchUser();
  return users[idx-1].id;
  //saveUser(users);
}



console.log(aleatorio([0,1]));
//removeUser('1');
//modifyUser(1);
//selectUser(1);
//var z=aleatorio();
//selectPregunta(z);
//selectAlternativas(z);

module.exports = {
  fetchUser,
  removeUser,
  aleatorio,
  selectAlternativas,
  selectPregunta,
  selectRespuesta,
  grabaridpregunta
} ;