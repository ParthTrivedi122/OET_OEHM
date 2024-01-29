const express= require('express');
const app= express();
const cors = require('cors');
const mysql = require('mysql');
const formidable = require('express-formidable');
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

app.use(formidable());
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
  // console.log("Connected!");
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
          // console.log(result);
          res.json({"result":result});
        });
      
});

app.post("/getCourseDataSem5Oet",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oet where semester= '5'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});

app.post("/getCourseDataSem6Oehm",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oehm where semester= 6", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});


app.post("/getCourseDataSem6Oet",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oet where semester= '6'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});


app.post("/getCourseDataSem7Oehm",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oehm where semester= '7'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});


app.post("/getCourseDataSem7Oet",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oet where semester= '7'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
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
                  if (results && results.length > 0) {
                    resolve({ course_name: results[0].course_name, domain: results[0].Domain });
                } else {
                    resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
                }
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


app.post("/getStudentDataSem6OehmOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oehm WHERE semester = '6'", function (err, result, fields) {
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


app.post("/getStudentDataSem6OetOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oet WHERE semester = '6'", function (err, result, fields) {
              if (err) reject(err);
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) reject(err);
                  if (results && results.length > 0) {
                    resolve({ course_name: results[0].course_name, domain: results[0].Domain });
                } else {
                    resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
                }
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


app.post("/getStudentDataSem5OetOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oet WHERE semester = '5'", function (err, result, fields) {
              if (err) reject(err);
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) reject(err);
                  if (results && results.length > 0) {
                    resolve({ course_name: results[0].course_name, domain: results[0].Domain });
                } else {
                    resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
                }
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


app.post("/getStudentDataSem7OetOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oet WHERE semester = '7'", function (err, result, fields) {
              if (err) reject(err);
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) reject(err);
                  if (results && results.length > 0) {
                    resolve({ course_name: results[0].course_name, domain: results[0].Domain });
                } else {
                    resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
                }
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


app.post("/getStudentDataSem7OehmOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oehm WHERE semester = '7'", function (err, result, fields) {
              if (err) reject(err);
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) reject(err);
                  if (results && results.length > 0) {
                    resolve({ course_name: results[0].course_name, domain: results[0].Domain });
                } else {
                    resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
                }
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

app.post("/deleteStudentDataSem5OehmOnline",async(req,res)=>{
   // console.log(req.fields.id);
  con.query("delete FROM students_online_oehm WHERE student_id="+req.fields.id+"", function (err, result, fields) {
    if (err) throw err;
    // console.log("result is"+result);
    res.json({"deleted":"yes"});
  });

});

app.post("/deleteStudentDataSem5OetOnline",async(req,res)=>{
   
  con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"deleted":"yes"});
  });

});


app.post("/deleteSubjectDataSem5Oehm",async(req,res)=>{
   // console.log("subject_id"+req.fields.id);
  con.query("delete FROM courses_offline_oehm WHERE course_id='"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"deleted":"yes"});
  });

  

});

app.post("/deleteSubjectDataSem5Oet",async(req,res)=>{
  // console.log("subject_id"+req.fields.id);
 con.query("delete FROM courses_offline_oet WHERE course_id='"+req.fields.id+"'", function (err, result, fields) {
   if (err) throw err;
   // console.log(result);
   res.json({"deleted":"yes"});
 });
});


app.post("/addOehmCourse",async(req,res)=>{
  console.log("in add course");
 con.query("INSERT INTO courses_offline_oehm(course_id, course_name, faculty_name, semester, faculty_email) VALUES ('"+req.fields.course_id+"','"+req.fields.course_name+"','"+req.fields.faculty_name+"','"+req.fields.semester+"','"+req.fields.faculty_email+"')", function (err, result, fields) {
   if (err) throw err;
    console.log("result is"+result);
   res.json({"inserted":"yes"});
 });
});

app.post("/addOetCourse",async(req,res)=>{
  console.log("in add course");
 con.query("INSERT INTO courses_offline_oet(course_id, course_name, faculty_name, semester, faculty_email) VALUES ('"+req.fields.course_id+"','"+req.fields.course_name+"','"+req.fields.faculty_name+"','"+req.fields.semester+"','"+req.fields.faculty_email+"')", function (err, result, fields) {
   if (err) throw err;
    console.log("result is"+result);
   res.json({"inserted":"yes"});
 });
});

app.post("/deleteStudentDataSem6OetOnline",async(req,res)=>{
   
  con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"deleted":"yes"});
  });

});


app.post("/deleteStudentDataSem7OetOnline",async(req,res)=>{
   
  con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"deleted":"yes"});
  });

});




app.post("/getCourseDataSem5Oet",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline_oet where semester= '5'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});



app.listen(PORT,(err)=>{
    if(err)
    {
         // console.log("Something went wrong");
    }
    else
    {
         // console.log("Server Succesfully started on Port :",PORT);
    }
})