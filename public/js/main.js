/* Your code starts here */

var app = {};

app.init = function() {
    var socket;
    var name;

    var start = function() {
        //create a name input using prompt
        //first is the prompt, second arg is the in the input
        name = prompt('What is your name?', 'type your name here');
        //init socket with server
        //meaning connect to the server
        //don't need to put anything in io.connect() bc
        //server is hosting everything incl socket
        socket = io.connect();

        socket.emit('userInfo', {
            userName: name,
            userID: socket.id,
        }); 

        socket.on('timeline', function(res){
            console.log(res);
            var tplToCompile = $('#tpl-chat-item').html();
            var compiled = _.template(tplToCompile)(res);
            $('#chat-container').prepend(compiled);
        })

        socket.on('greetings', function(res) {
            console.log(res);
            startMsg(res);
        });

        socket.on('confirm', function(res) {
            console.log(res);
        });

        socket.on('current users', function(res) {
            console.log('current users: '+res);
        });

        socket.on('broadcast message', function(res) {
            console.log(res);
        });

        attachEvents();

    };

    var attachEvents = function() {
        var state = 0;
        //keeping every eventlistener 
        $('#js-btn-send').on('click', function() {
            //after user clicks
            var chat_msg = $('#js-ipt-text').val();
            console.log(chat_msg);
            var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
            var isScript;
            isScript = re.test(chat_msg);
            //.emit submits or sends an event
            //you can name it anything and you can
            //attach anything (string, num etc.)
            //but usually it's an object
            socket.emit('message', {
                // message_one: "hey lovely.",
                // message_two: "hola!",
                user: name,
                msg: chat_msg,
                state: state,
                timestamp: 'now'
            });
            // Reset input field
            $('#js-ipt-text').val('');
        });

        $('#chat-input').keyup(function(event){
            if(event.keyCode == 13){
             var chat_msg = $('#js-ipt-text').val();
             console.log('enter pressed & value is: '+chat_msg);
             var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
            var isScript;
            isScript = re.test(chat_msg);
            console.log(isScript);

            console.log('Sending: ' + chat_msg);
            // emit a chat message to server
            socket.emit('message', {
                name: name,
                msg: chat_msg,
                state: state,
                timestamp: 'now'
            });
            // Reset input field
            $('#js-ipt-text').val('');
            }
        });

    //mousemove event test
    // $(window).on('mousemove', function(res){
    //   //could also do pageX, pageY; sometimes one works
    //   //better than the other
    //   var posX = res.clientX;
    //   var posY = res.clientY;

    //   console.log(posX, posY);

    //   socket.emit('mouse position', {
    //     x: posX,
    //     y: posY
    //   })
    // });

    //listen for clients
    socket.on('clients', function(res) {
        console.log('this is the res: '+res);
        var tplToCompile = $('#tpl-chat-item').html();
        var compiled = _.template(tplToCompile)(res);
        $('#chat-container').prepend(compiled);
        console.log(res.data);
    });

    socket.on('botRes', function(res) {
        var tplToCompile = $('#tpl-bot-item').html();
        var compiled = _.template(tplToCompile)({
            timestamp: 'now',
            msg: res.msg,
            name: res.name,
            state: res.state
        });
        
            $('#chat-container').prepend(compiled);
        console.log(res.data);
    });
 };

var startMsg = function(response){
    // console.log('start message is: '+response.msg + name);
    // var greeting = response.msg+', '+ name+'. What would you like to name this meeting?';
    var tplToCompile = $('#tpl-bot-item').html();
    var compiled = _.template(tplToCompile)(response);
    $('#chat-container').prepend(compiled);
}

start();
};

app.init();