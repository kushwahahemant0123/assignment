const express= require('express');
const { Pool } = require("pg");
const path=require('path');
const app=express();
const methodOverride = require('method-override');
const e = require('express');

const port=8080;
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
const pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432, 
    database: "college",
  });

app.get('/',(req, res)=>{
    res.render('home.ejs');
});
  
app.get('/new',(req, res)=>{
    res.render('form.ejs');
})
app.post('/new',(req, res)=>{
   let {name, email ,enroll,dob, addYear, passYear, cYear, gender, branch} = req.body;
   
   let q=`INSERT INTO alumini.reg (name, email, enroll, dob,addYear, passYear, cYear, gender, branch) VALUES ('${name}','${email}','${enroll.toUpperCase()}','${dob}',${addYear},${passYear},'${cYear}','${gender}','${branch}')`;
  try{
    pool.query(q, (err, result) => {
        if(err) throw err;
        console.log("insert to db");
        res.redirect('/');
        //console.log(result);
      });
  }catch(err){
    res.send('error in db');
    console.log("error in db");
  };
});


app.patch('/students/:enrollu/edit',(req, res)=>{
  let {enrollu}= req.params;
  let {name, email, enroll, dob} =req.body;
  console.log(enrollu, name, email, dob);

  q=`UPDATE alumini.reg SET name='${name}', email='${email}', enroll='${enroll}', dob='${dob}' WHERE enroll='${enrollu}'`;
  try{
    pool.query(q, (err, result)=>{
      if(err) throw err;
      console.log(result);
      res.redirect(`/students/${enroll}`);
    });
  }catch(err){
    console.log(err);
  }
 
 });

 app.delete('/students/:enroll',(req, res)=>{
  let {enroll}= req.params;
  q=`DELETE FROM alumini.reg WHERE enroll='${enroll}'`;
  try{
    pool.query(q, (err, result)=>{
      if (err) throw err;
      console.log(`deleted the details of this enroll ${enroll}`);
      res.redirect('/students');

    })
  }catch(err){
    console.log(err)
  }
 });

app.get('/students',(req, res)=>{
  let  q="SELECT * FROM alumini.reg ORDER BY name ASC";
try{
  pool.query(q, (err, result) => {
      if(err) throw err;
      // console.log(result);
      // console.log(result.rows);
      let students=result.rows;
      res.render('students.ejs', {students});
    });
}catch(err){
  console.log(err);
};
});

app.get('/students/:enroll', (req, res)=>{
  let {enroll}=req.params;
  let  q=`SELECT * FROM alumini.reg WHERE enroll='${enroll}'`;
try{
  pool.query(q, (err, result) => {
      if(err) throw err;
      // console.log(result);
      console.log(result.rows[0]);
      let student=result.rows[0];
      res.render('show.ejs',{student});
    });
}catch(err){
  console.log(err);
}});

app.get('/students/:enroll/edit',(req, res)=>{
  let {enroll}=req.params;
  let  q=`SELECT * FROM alumini.reg WHERE enroll='${enroll}'`;
try{
  pool.query(q, (err, result) => {
      if(err) throw err;
      // console.log(result);
      console.log(result.rows[0]);
      let student=result.rows[0];
      res.render('edit.ejs',{student});
    });
}catch(err){
  console.log(err);
}});


app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})