const path = require('path');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const req = require('express/lib/request');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');



const con = mysql.createConnection({
    host:'127.0.0.1',
    user:'user',
    password:'passworduser',
    database:'mynodeappdb'
});

con.connect(function(err){
    if(err)throw err;
    console.log('Connected');
});

app.get('/',(req,res)=>{
    const sql = "SELECT * from mydata";
    con.query(sql,function(err,result,fields){
        if(err)throw err;
        res.render('index',{mydata:result});
    });
});

app.post('/',(req,res)=>{
    const sql = "INSERT INTO mydata SET ?";
    con.query(sql,req.body,function(err,result,fields){
        if(err)throw err;
        console.log(result);
        res.redirect('/');      
    });
});

app.get('/create',(req,res)=>res.sendFile(path.join(__dirname,'html/form.html')));

app.get('/delete/:id',(req,res)=>{
    const sql = "DELETE FROM mydata WHERE id = ?";
    con.query(sql,
        [req.params.id],function(err,result,fields){
            if(err)throw err;
            console.log(result);
            res.redirect('/');
    });
});

app.post('/update/:id',(req,res)=>{
    const sql = "UPDATE mydata SET ? WHERE id = " + req.params.id;
    con.query(sql,req.body,function(err,result,fields){
        if(err)throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.get('/edit/:id',(req,res)=>{
    const sql = "SELECT * FROM mydata WHERE id = ?";
    con.query(sql,[req.params.id],function(err,result,fields){
        if(err)throw err;
        res.render('edit',{mydata:result});
    });
});

app.listen(port,()=> console.log(`Example app listening on port ${port}!`));
