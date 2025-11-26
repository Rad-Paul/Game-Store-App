import { Connection } from "tedious";

const config = {
  server: "DESKTOP-H628PQM",
  authentication: {
    type: "default",
    options: {
      userName: "Rad Paul",     
      password: "test",
    },
  },
  options: {
    database: "GamesAppDb",
    encrypt: true,
    trustServerCertificate: true,
    port: 1433,
  },
};

const connection = new Connection(config);

connection.on("connect", (err) => {
  if (err) {
    console.error("Connection failed:", err);
  } else {
    console.log("Connected successfully!");
  }
});

connection.on("end", () => {
  console.log("Connection closed");
});

connection.on("error", (err) => {
  console.error("Connection error:", err);
});

console.log("Attempting to connect...");
connection.connect();