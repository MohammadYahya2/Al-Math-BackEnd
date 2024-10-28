const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const legalDocsRoutes = require("./routes/legalDocs");
const commentsRoutes = require("./routes/comments");
const coursesRoutes = require("./routes/courses");

const { roles, users } = require("./models"); // Ensure you import your roles model
require("dotenv").config();

const PORT = process.env.PORT;

const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/users", userRoutes);
app.use("/docs", legalDocsRoutes);
app.use("/comments", commentsRoutes);
app.use("/courses", coursesRoutes);

async function startListening() {
  try {
    await db.sequelize.sync({ force: false }).then(async () => {
      await roles.addDefaultRoles();
      await users.addAdminUser("admin", "admin@admin.com", "admin1234");
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startListening();
