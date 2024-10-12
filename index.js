const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const { roles } = require("./models"); // Ensure you import your roles model
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

async function startListening() {
  try {
    await db.sequelize.sync({ force: false }).then(async () => {
      await roles.addDefaultRoles();
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startListening();
