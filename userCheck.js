console.log('Starting userCheck.js');

const fs = require('fs');

var fetchUser = () => {
  try{
    users = JSON.parse(fs.readFileSync('users_check.json'));
    console.log ('salida de fectchUser: ' + JSON.stringify(users));
    return users;
  } catch (e) {
    return [];
  }
}

var removeUser = (userid) => { //eliminar el campo del objeto
  users = fetchUser();
  var filteredUsers = users.filter((user) => user.userid !== userid);
  saveUser(filteredUsers);
  return users.length !== filteredUsers.length;
};

var saveUser = (users) => {
    fs.writeFileSync('users_check.json',JSON.stringify(users));
}


var chancea1 = (userid) => {
  users = fetchUser();
  users[userid-1].chance='1';
  saveUser(users);
}

var chancea0 = (userid) => {
  users = fetchUser();
  users[userid-1].chance='0';
  saveUser(users);
}



var addUser = (userid,phoneNumber,chance,cuentapreguntas,arraypreguntas,id,idultimapregunta,conteoderespuestascorrectas,status,fechauso,turno) => {
  var users = fetchUser();
  var user = {
    userid,
    phoneNumber,
    chance,
    cuentapreguntas,
    arraypreguntas,
    id,
    idultimapregunta,
    conteoderespuestascorrectas,
    status,
    fechauso,
    turno
  };


  var duplicateUsers = users.filter((user) => user.userid === userid);

//  console.log('Duplicado: ',duplicateNotes);

  if (duplicateUsers.length === 0) {
    users.push(user);
    saveUser(users);
    return user;
  }
};

var aumentarcuentapreguntas = (id) => {
  var users = fetchUser();
  users[id-1].cuentapreguntas=users[id-1].cuentapreguntas+1;
  saveUser(users);
}

var modificarstatusfin = (id) => {
  var users = fetchUser();
  users[id-1].status="1";
  saveUser(users);
}

var modificarstatusini = (id) => {
  var users = fetchUser();
  users[id-1].status="0";
  saveUser(users);
}

var aumentarrespuestascorrectas = (id) => {
  var users = fetchUser();
  users[id-1].conteoderespuestascorrectas=users[id-1].conteoderespuestascorrectas+1;
  saveUser(users);
}

var resetearpreguntas = (id) => {
  var users = fetchUser();
  users[id-1].cuentapreguntas=0;
  saveUser(users);
}

var resetearrespuestascorrectas = (id) => {
  var users = fetchUser();
  users[id-1].conteoderespuestascorrectas=0;
  saveUser(users);
}

var grabaridpreguntaactual = (id,idpregunta,idverdadero) => {
  var users = fetchUser();
  users[id-1].idultimapregunta=idpregunta;
  users[id-1].status=Number(idverdadero);
  saveUser(users);
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

Date.prototype.diaactual = function() {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate());
  return dat;
}

var setearfecha = (id) => {
  var users = fetchUser();
  var fecha= new Date();
  users[id-1].fechauso=fecha.addDays(5);
  saveUser(users);
}


var comparafecha = (id) => {
  var users = fetchUser();
  var fecha= new Date();
  var fechauserjson= new Date(users[id-1].fechauso);
  console.log(fechauserjson);
  console.log(users[id-1].fechauso);
  console.log(Date.parse(fecha.diaactual()));
  if(Date.parse(fecha.diaactual()) >= Date.parse(fechauserjson)){
    users[id-1].turno='1';
    saveUser(users);
    return true;
  } else {
    users[id-1].turno='0';
    saveUser(users);
    return false;
  }}


var minusindex = (id,indice) => {
  var users = fetchUser();
  //var usuarioamodificararray = users.filter((user) => user.id === id);
  var index =users[id-1].arraypreguntas.indexOf(indice);

  
    if (index > -1) {
    users[id-1].arraypreguntas.splice(index, 1);
    }


  saveUser(users);
}

var resetarray = (id) => {
  var users = fetchUser();
  users[id-1].arraypreguntas=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  saveUser(users);
}




module.exports = {
  addUser,
  fetchUser,
  removeUser,
  chancea1,
  chancea0,
  aumentarcuentapreguntas,
  resetearpreguntas,
  grabaridpreguntaactual,
  aumentarrespuestascorrectas,
  resetearrespuestascorrectas,
  modificarstatusfin,
  modificarstatusini,
  setearfecha,
  comparafecha,
  minusindex,
  resetarray
} ;
