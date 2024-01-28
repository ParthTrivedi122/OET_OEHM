const express= require('express');
const app= express();
const cors = require('cors');
const mysql = require('mysql');
// const session = require("express-session");
// const Login=require("./schema/registeredSchema");
// const Customer=require("./schema/customerSchema");
// const product=require('./schema/productSchema');
// const multer  = require('multer');

const PORT=8000;

app.use(cors());

// Specify allowed origins, methods, and headers
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Replace with your client's domain
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
}));
var con = mysql.createConnection({
    host: "13.234.60.137",
    user: "admin_kjsce",
    password: "uP58a70f#",
    database: "oet-oehm"
  });

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "oet-oehm"
//   });


app.post("/getdata",async(req,res)=>{
   
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  res.json({"msg":"Connected"});
//   var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
});
});


app.post("/getCourseDataSem5Oehm",async(req,res)=>{
   
        con.query("SELECT * FROM courses_offline_oehm where semester= '5'", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.json({"result":result});
        });
      
});

app.post("/getStudentDataSem5OehmOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oehm WHERE semester = '5'", function (err, result, fields) {
              if (err) reject(err);
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) reject(err);
                  resolve({ course_name: results[0].course_name, domain: results[0].Domain });
              });
          });
      });

      const courseDetails = await Promise.all(courseDetailsPromises);

      res.json({ "result": result, "course": courseDetails });
  } catch (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/getCourseDataSem5Oet",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oet where semester= '5'", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.json({"result":result});
  });

});



app.listen(PORT,(err)=>{
    if(err)
    {
         console.log("Something went wrong");
    }
    else
    {
         console.log("Server Succesfully started on Port :",PORT);
    }
})