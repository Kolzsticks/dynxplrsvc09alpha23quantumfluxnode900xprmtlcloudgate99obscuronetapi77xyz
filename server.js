// server.js
import http from "http";
import https from "https";
import { URL } from "url";

const PORT = 5000;

const server = http.createServer((req, res) => {
  // Allow frontend (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Handle /api/student/:matric
  if (req.url.startsWith("/api/student/")) {
    const matric = req.url.split("/").pop();

    const targetUrl = `https://uirms.ui.edu.ng/backend/student.php?action=get_student_data_res&matricNo=${matric}`;

    https.get(new URL(targetUrl), (apiRes) => {
      let body = "";
      apiRes.on("data", (chunk) => (body += chunk));
      apiRes.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(body);
      });
    }).on("error", (err) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch student data" }));
      console.error(err);
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
