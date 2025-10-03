import http from "http";
import https from "https";
import url from "url";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 5000;

// serve static files (like index.html) from "public" folder
const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith("/api/student/")) {
    const matricNo = parsedUrl.pathname.split("/").pop();
    const targetUrl = `https://uirms.ui.edu.ng/backend/student.php?action=get_student_data_res&matricNo=${matricNo}`;

    https
      .get(targetUrl, (apiRes) => {
        let data = "";
        apiRes.on("data", (chunk) => (data += chunk));
        apiRes.on("end", () => {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(data);
        });
      })
      .on("error", (err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
  } else {
    // serve index.html + static files
    let filePath = path.join(
      publicDir,
      parsedUrl.pathname === "/" ? "index.html" : parsedUrl.pathname
    );

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      } else {
        res.writeHead(200);
        res.end(content);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
