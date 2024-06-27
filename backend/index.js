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
// var con = mysql.createConnection({
//     host: "35.200.243.194",
//     user: "admin_kjsce",
//     password: "uP58a70f#",
//     database: "oet-oehm"
//   });

var con = mysql.createConnection({
    host: "localhost",  
    user: "root",
    password: "",
    database: "oet-oehm-student"
  });

// const dbConfig = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// };

// const con = mysql.createPool({ ...dbConfig });


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





// app.post("/getStudentDataOnlineall", async (req, res) => {
//   try {
//       let query = "SELECT * FROM students_online WHERE 1=1"; // Initial query
     
//       const { semester, courseType, branch } = req.fields; // Assuming the frontend sends the selected filters in the request body
//       console.log("semester is ",semester);
//       if (semester && semester !== "--Select Semester--") {
//           query += ` AND semester = '${semester}'`;
//       }

//       if (courseType && courseType !== "--Select Course Type--") {
//           query += ` AND course_type = '${courseType}'`;
//       }

//       if (branch && branch !== "--Select Branch--") {
//           query += ` AND branch = '${branch}'`;
//       }
//       console.log("Query is =",query);
//       const result = await new Promise((resolve, reject) => {
//           con.query(query, function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataOnlineall", async (req, res) => {
//   try {
//       let query = `
//           SELECT 
//               u.roll_number AS student_id,
//               u.name AS student_name,
//               u.semester,
//               e.course_id,
//               e.type,
//               e.course_approved,
//               c.course_name,
//               c.domain,
//               e.total_hours,
//               u.branch,
//               u.email,
//               e.id,
//               e.course_completed
//           FROM users u
//           JOIN enrollments e ON u.email = e.email
//           JOIN courses_online c ON e.course_id = c.course_id
//           WHERE 1=1
//       `;

//       const { semester, branch, courseType } = req.fields;  // Removed courseType as it's not present in enrollments table
//       if (semester && semester !== "--Select Semester--") {
//           query += ` AND u.semester = '${semester}'`;
//       }

//       if (courseType && courseType !== "--Select Course Type--") {
//           query += ` AND e.type = '${courseType}'`;
//       }

//       if (branch && branch !== "--Select Branch--") {
//           query += ` AND u.branch = '${branch}'`;
//       }

//       query += " GROUP BY u.roll_number, e.course_id"; // Group by student and course

//       console.log("Query is =", query);
//       const result = await new Promise((resolve, reject) => {
//           con.query(query, async function (err, result, fields) {
//               if (err) reject(err);
//               resolve(result);
//           });
//       });

//       const getCertificates = (email,course_id) => {
//           return new Promise((resolve, reject) => {
//               con.query(
//                   "SELECT submission_link FROM submissions WHERE email = ? and course_id= ? GROUP BY submission_link",
//                   [email,course_id],
//                   function (err, results) {
//                       if (err) return reject(err);
//                       const certificates = results.map(row => `<a href="${row.submission_link}">${row.submission_link}</a><br>`);
//                       resolve(certificates);
//                   }
//               );
//           });
//       };

//       for (let student of result) {
//           student.certificates = await getCertificates(student.email);
//       }

//       // Formatting data with <br> tag
//       const formattedData = result.map(student => ({
//           id: student.id,
//           student_id: student.student_id,
//           student_name: student.student_name,
//           semester: student.semester,
//           email: student.email,
//           course_approved: student.course_approved,
//           courses_type: student.type,
//           certificates: student.certificates.join(''),
//           courses_enrolled: student.course_name || "N/A",
//           courses_links: student.links || "No links found",
//           domain: student.domain || "N/A",
//           total_hours: student.total_hours || "N/A",
//           branch: student.branch || "N/A",
//           completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
//           completion_colour: student.course_completed === 1 ? "success" : "danger"
//       }));

//       console.log("Certificates:", formattedData.map(student => student.certificates));
//       res.json({ "result": formattedData });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataOnlineall", async (req, res) => {
//   try {
//       let query = `
//           SELECT 
//               u.roll_number AS student_id,
//               u.name AS student_name,
//               u.semester,
//               e.course_id,
//               e.type,
//               e.course_approved,
//               c.course_name,
//               c.domain,
//               e.total_hours,
//               u.branch,
//               u.email,
//               e.id,
//               e.course_completed
//           FROM users u
//           JOIN enrollments e ON u.email = e.email
//           JOIN courses_online c ON e.course_id = c.course_id
//           WHERE 1=1
//       `;

//       const { semester, branch, courseType } = req.fields;  // Make sure you're using `req.body` to get the request data
//       if (semester && semester !== "--Select Semester--") {
//           query += ` AND u.semester = '${semester}'`;
//       }

//       if (courseType && courseType !== "--Select Course Type--") {
//           query += ` AND e.type = '${courseType}'`;
//       }

//       if (branch && branch !== "--Select Branch--") {
//           query += ` AND u.branch = '${branch}'`;
//       }

//       query += " GROUP BY u.roll_number, e.course_id"; // Group by student and course

//       console.log("Query is =", query);
//       const result = await new Promise((resolve, reject) => {
//           con.query(query, function (err, result, fields) {
//               if (err) reject(err);
//               resolve(result);
//           });
//       });

//       // const getCertificates = (email, course_id) => {
//       //     return new Promise((resolve, reject) => {
//       //         con.query(
//       //             "SELECT submission_link FROM submissions WHERE email = ? AND course_id = -? GROUP BY submission_link",
//       //             [email, course_id],
//       //             function (err, results) {
//       //                 if (err) return reject(err);
//       //                 const certificates = results.map(row => `<a href="${row.submission_link}">${row.submission_link}</a><br>`);
//       //                 resolve(certificates);
//       //             }
//       //         );
//       //     });
//       // };

//       // for (let student of result) {
//       //     student.certificates = await getCertificates(student.email, student.course_id);
//       // }

//       // // Formatting data with <br> tag
//       const formattedData = result.map(student => ({
//           id: student.id,
//           student_id: student.student_id,
//           student_name: student.student_name,
//           semester: student.semester,
//           email: student.email,
//           course_approved: student.course_approved,
//           courses_type: student.type,
//           // certificates: student.certificates.join(''),
//           courses_enrolled: student.course_name || "N/A",
//           courses_links: student.links || "No links found",
//           domain: student.domain || "N/A",
//           total_hours: student.total_hours || "N/A",
//           branch: student.branch || "N/A",
//           completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
//           completion_colour: student.course_completed === 1 ? "success" : "danger"
//       }));

//       console.log("Certificates:", formattedData);
//       res.json({ "result": formattedData });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/getStudentDataOnlineall", async (req, res) => {
  try {
    let query = `
      SELECT 
        u.roll_number AS student_id,
        u.name AS student_name,
        u.semester,
        e.course_id,
        e.type,
        e.course_approved,
        c.course_name,
        c.domain,
        e.total_hours,
        u.branch,
        u.email,
        e.id,
        e.course_completed
      FROM users u
      JOIN enrollments e ON u.email = e.email
      JOIN courses_online c ON e.course_id = c.course_id
      WHERE 1=1
    `;

    const { semester, branch, courseType } = req.fields;
    if (semester && semester !== "--Select Semester--") {
      query += ` AND u.semester = '${semester}'`;
    }

    if (courseType && courseType !== "--Select Course Type--") {
      query += ` AND e.type = '${courseType}'`;
    }

    if (branch && branch !== "--Select Branch--") {
      query += ` AND u.branch = '${branch}'`;
    }

    query += " GROUP BY u.roll_number, e.course_id";

    console.log("Query is =", query);
    const result = await new Promise((resolve, reject) => {
      con.query(query, function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
      });
    });

    const studentData = {};

    result.forEach(student => {
      if (!studentData[student.student_id]) {
        studentData[student.student_id] = {
          id: student.id,
          student_id: student.student_id,
          student_name: student.student_name,
          semester: student.semester,
          email: student.email,
          course_approved: student.course_approved,
          courses_type: student.type,
          courses_enrolled: "",
          courses_links: "",
          domain: "",
          total_hours: "",
          final_hours:0,
          branch: student.branch,
          completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
          completion_colour: student.course_completed === 1 ? "success" : "danger"
        };
      }
      
      studentData[student.student_id].courses_enrolled += (student.course_name || "N/A") + "<br>";
      studentData[student.student_id].courses_links += `<a href="">`+(student.links || "No links found") + "</a><br>";
      studentData[student.student_id].domain += (student.domain || "N/A") + "<br>";
      studentData[student.student_id].total_hours += (student.total_hours || "N/A") + "<br>";
      studentData[student.student_id].final_hours += (parseInt(student.total_hours) || 0) ;


    });

    const formattedData = Object.values(studentData);

    console.log("Formatted Data:", formattedData);
    res.json({ result: formattedData });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/approveStudentDataOnline",async (req,res)=>{
  console.log(req.fields.email);
  try {
    query="UPDATE enrollments SET course_approved = 1 WHERE email="+req.fields.email;
    con.query(query, async function (err, result, fields) {
      if (err) throw err;
      let querys = `
          SELECT 
              u.roll_number AS student_id,
              u.name AS student_name,
              u.semester,
              e.course_id,
              e.type,
              c.course_name,
              c.domain,
              s.submission_link ,
              e.total_hours,
              e.course_approved,
              u.branch,
              u.email,
              e.id,
              e.course_completed
          FROM users u
          JOIN enrollments e ON u.email = e.email
          JOIN courses_online c ON e.course_id = c.course_id
          LEFT JOIN submissions s ON u.email = s.email AND e.course_id = s.course_id
          WHERE e.course_approved=0
      `;
      con.query(querys, async function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        const studentData = {};
        result.forEach(student => {
          if (!studentData[student.student_id]) {
            studentData[student.student_id] = {
              id: student.id,
              student_id: student.student_id,
              student_name: student.student_name,
              semester: student.semester,
              email: student.email,
              course_approved: student.course_approved,
              courses_type: student.type,
              courses_enrolled: "",
              courses_links: "",
              domain: "",
              total_hours: "",
              final_hours:0,
              branch: student.branch,
              completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
              completion_colour: student.course_completed === 1 ? "success" : "danger"
            };
          }
          
          studentData[student.student_id].courses_enrolled += (student.course_name || "N/A") + "<br>";
          studentData[student.student_id].courses_links += `<a href="">`+(student.links || "No links found") + "</a><br>";
          studentData[student.student_id].domain += (student.domain || "N/A") + "<br>";
          studentData[student.student_id].total_hours += (student.total_hours || "N/A") + "<br>";
          studentData[student.student_id].final_hours += (parseInt(student.total_hours) || 0) ;
    
    
        });
    
        const formattedData = Object.values(studentData);
    
        res.json({"msg":"Susscess",data:formattedData})}
      )
  });
  }catch(e){
    console.log("Error is : ",e);
  }
})


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