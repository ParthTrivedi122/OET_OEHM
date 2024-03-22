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
    host: "35.200.243.194",
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

app.post("/getCourseData",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline where "+req.fields.key+"= '"+req.fields.semester+"'", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json({"result":result});
  });

});

app.post("/getCourseDataAll",async(req,res)=>{
   
  con.query("SELECT * FROM courses_offline ", function (err, result, fields) {
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
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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

// app.post("/getStudentDataSemOehmOnline", async (req, res) => {
//   var sem=req.fields.semesterFilter;
//   var type=req.fields.courseFilter;
//   if(sem==undefined || sem==""){
//     if(type==undefined || type==""){
//       try {
//         const result = await new Promise((resolve, reject) => {
//             con.query("SELECT * FROM students_online_oehm ", function (err, result, fields) {
//                 if (err) throw err;
//                 resolve(result);
//             });
//         });
  
//         const courseDetailsPromises = result.map(student => {
//             return new Promise((resolve, reject) => {
//                 con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                     if (err) throw err;
//                     if (results && results.length > 0) {
//                       resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                   } else {
//                       resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                   }
//                 });
//             });
//         });
  
//         const courseDetails = await Promise.all(courseDetailsPromises);
  
//         res.json({ "result": result, "course": courseDetails });
//     } catch (err) {
//         console.error("Error retrieving data:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
//   }else{
//     try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm where course_type='"+type+"'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
//     }
//   }else{
//     if(type==undefined || type==""){
//       try {
//         const result = await new Promise((resolve, reject) => {
//             con.query("SELECT * FROM students_online_oehm where semester='"+sem+"'", function (err, result, fields) {
//                 if (err) throw err;
//                 resolve(result);
//             });
//         });
  
//         const courseDetailsPromises = result.map(student => {
//             return new Promise((resolve, reject) => {
//                 con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                     if (err) throw err;
//                     if (results && results.length > 0) {
//                       resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                   } else {
//                       resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                   }
//                 });
//             });
//         });
  
//         const courseDetails = await Promise.all(courseDetailsPromises);
  
//         res.json({ "result": result, "course": courseDetails });
//     } catch (err) {
//         console.error("Error retrieving data:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
//   }else{
//     try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm where course_type='"+type+"' and semester='"+sem+"'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
//   }
// }
  
// });


app.post("/getStudentDataSem6OehmOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oehm WHERE semester = '6'", function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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


app.post("/getStudentOnlineData", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online WHERE student_id = '"+req.fields.id+"' and semester='"+req.fields.semester+"' and course_type='"+req.fields.type+"'", function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });
      console.log(result);
      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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


app.post("/getStudentDataOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oehm WHERE "+req.fields.key+" = '"+req.fields.semester+"'", function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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





app.post("/getStudentDataOnlineall", async (req, res) => {
  try {
      let query = "SELECT * FROM students_online WHERE 1=1"; // Initial query
     
      const { semester, courseType, branch } = req.fields; // Assuming the frontend sends the selected filters in the request body
      console.log("semester is ",semester);
      if (semester && semester !== "--Select Semester--") {
          query += ` AND semester = '${semester}'`;
      }

      if (courseType && courseType !== "--Select Course Type--") {
          query += ` AND course_type = '${courseType}'`;
      }

      if (branch && branch !== "--Select Branch--") {
          query += ` AND branch = '${branch}'`;
      }
      console.log("Query is =",query);
      const result = await new Promise((resolve, reject) => {
          con.query(query, function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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


app.post("/getSubjectDataOffline", async (req, res) => {
  try {
      let query = "SELECT * FROM courses_offline WHERE 1=1"; // Initial query
     
      const { semester, courseType, branch } = req.fields; // Assuming the frontend sends the selected filters in the request body
      console.log("semester is ",semester);
      if (semester && semester !== "--Select Semester--") {
          query += ` AND semester = '${semester}'`;
      }

      if (courseType && courseType !== "--Select Course Type--") {
          query += ` AND course_type = '${courseType}'`;
      }

      if (branch && branch !== "--Select Branch--") {
          query += ` AND branch = '${branch}'`;
      }
      console.log("Query is =",query);
      const result = await new Promise((resolve, reject) => {
          con.query(query, function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });

     
      res.json({ "result": result });
  } catch (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "Internal server error" });
  }
});










app.post("/getCourseOehmData",async(req,res)=>{
  console.log(req.fields.id);
  con.query("SELECT * FROM courses_offline_oehm WHERE course_id = '"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    res.json({"result":result});
});
});


// app.post("/getStudentOehmOnlineData",async(req,res)=>{
//   console.log(req.fields.id);
// try {
//   const result = await new Promise((resolve, reject) => {
//     con.query("SELECT * FROM students_online_oehm WHERE student_id = '" + req.fields.id + "'", function (err, result, fields) {
//       console.log(result[0].course_id);
//       if (err) throw err;
//       con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [result[0].course_id], function (err, courses, fields) {
//         console.log(courses);
//           if (err) throw err;
//           resolve({"result": result, "courses": courses}); 
//       });
//   });
//   });

// } catch (err) {
//   console.error("Error retrieving data:", err);
//   res.status(500).json({ error: "Internal server error" });
// }
// });

app.post("/getCourseOetData",async(req,res)=>{
  console.log(req.fields.id);
  con.query("SELECT * FROM courses_offline_oet WHERE course_id = '"+req.fields.id+"'", function (err, result, fields) {
    if (err) throw err;
    res.json({"result":result});
});
});

app.post("/editOehmCourse",async(req,res)=>{
  con.query("UPDATE courses_offline SET course_id = '" + req.fields.course_id + "', course_name = '" + req.fields.course_name + "', faculty_name = '" + req.fields.faculty_name + "', semester = '" + req.fields.semester + "', faculty_email = '" + req.fields.faculty_email + "' WHERE course_id='"+req.fields.course_id+"' and course_type='OEHM'", function (err, result, fields) {
    if (err) throw err;
    console.log("result is" + result);
    res.json({"updated": "yes"});
});

});



app.post("/editOnlineStudent", async (req, res) => {
  const { student_id, course_type, semester, course_id, course_name,student_name,total_hours,completion } = req.fields;
  
  con.query("UPDATE students_online SET course_id = ?,student_name=?  ,total_hours=?  , semester = ?,course_completed=? WHERE student_id = ? AND course_type = ? AND semester = ?", 
  [course_id,student_name,total_hours , semester, student_id, course_type, semester,completion], 
  function (err, result, fields) {  
      if (err) {
          console.error("Error updating student online data:", err);
          res.status(500).json({ error: "An error occurred while updating student online data" });
          return;
      }
      console.log("Updated student online data:", result);
      res.json({ "updated": "yes" });
  });
});





app.post("/editOetCourse",async(req,res)=>{
  con.query("UPDATE courses_offline SET course_id = '" + req.fields.course_id + "', course_name = '" + req.fields.course_name + "', faculty_name = '" + req.fields.faculty_name + "', semester = '" + req.fields.semester + "', faculty_email = '" + req.fields.faculty_email + "' WHERE course_id='"+req.fields.course_id+"' and course_type='OET'", function (err, result, fields) {
    if (err) throw err;
    console.log("result is" + result);
    res.json({"updated": "yes"});
});

});


app.post("/getStudentDataSem6OetOnline", async (req, res) => {
  try {
      const result = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM students_online_oet WHERE semester = '6'", function (err, result, fields) {
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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
              if (err) throw err;
              resolve(result);
          });
      });

      const courseDetailsPromises = result.map(student => {
          return new Promise((resolve, reject) => {
              con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
                  if (err) throw err;
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

app.post("/deleteStudentDataOnline",async(req,res)=>{
  // console.log(req.fields.id);
 con.query("delete FROM students_online WHERE student_id='"+req.fields.id+"' and semester='"+req.fields.semester+"'", function (err, result, fields) {
   if (err) throw err;
   // console.log("result is"+result);
   res.json({"deleted":"yes"});
 });

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


app.post("/deleteSubjectData",async(req,res)=>{
   // console.log("subject_id"+req.fields.id);
  con.query("delete FROM courses_offline WHERE course_id='"+req.fields.id+"' and semester='"+req.fields.semester+"' and course_type='"+req.fields.type+"'", function (err, result, fields) {
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