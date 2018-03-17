  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB0OhrJvWYv4mKeY-rxhMLEEfXJ290Uq5A",
    authDomain: "trainschedules-2fc39.firebaseapp.com",
    databaseURL: "https://trainschedules-2fc39.firebaseio.com",
    projectId: "trainschedules-2fc39",
    storageBucket: "",
    messagingSenderId: "422088065588"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding trains
  $("#submit").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#trainName").val().trim();
    var departTime =  moment($("#trainDepart").val().trim(), "HH:mm").format("HH:mm");
    var destination = $("#finalDest").val().trim();
    var trainTime =  moment($("#trainTime").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#freq").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      depart:departTime,
      dest: destination,
      trnTime: trainTime,
      frqncy: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.depart)
    console.log(newTrain.dest);
    console.log(newTrain.trnTime);
    console.log(newTrain.frqncy);
  
    // Alert
    alert("New train successfully added");
  
    // Clears all of the text-boxes
    $("#trainName").val("");
    $("departTime").val("");
    $("#finalDest").val("");
    $("#trainTime").val("");
    $("#freq").val("");
  
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on( "child_added" , function(snapshot) {
    var frequencyTrain = snapshot.val().frqncy
    var trainTimeFormatted = moment(snapshot.val().trnTime, 'HH:mm')
    var currentTime = moment().format('HH:mm')
    var timeDifferential = moment().diff(moment(trainTimeFormatted), "minutes")
    var timeRemainder = timeDifferential % frequencyTrain
    var timeTillTrain = frequencyTrain - timeRemainder
    var nextTrain = moment().add(timeTillTrain, "minutes").format("h:mm a")

    $(".fetchData").append(`
        <tr><td>${snapshot.val().name}</td>
        <td>${snapshot.val().depart}
        <td>${snapshot.val().dest}</td>
        <td>${snapshot.val().frqncy}</td>
        <td>${nextTrain}</td>
        <td class="text-center">${timeTillTrain}</td></tr>`)
  });