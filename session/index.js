const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({secret: 'jojo123'}));

app.get('/viewCount', (req,res) =>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }

    res.send(`You've visited the site ${req.session.count} times`);
});

app.listen(3000, ()=>{
    console.log('Listening to 3000 port');
})