const { signupSchema, signInSchema } = require("../validators/validations.js");
const bcrypt = require("bcrypt");
const { users, roles } = require("../models");

require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 9;
    }

    const search = req.query.search;
    let conditions = {};

    if (search) {
      search = search.toString();
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const allUsers = await users.findAll({
      where: conditions,
      order: [["id", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    return res.status(200).json({ message: "success", users: allUsers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const jwt = require("jsonwebtoken"); // Ensure you have this package installed

const JWT_SECRET = process.env.JWT_SECRET;

const signUp = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { username, email, password } = req.body;

    const emailExists = await users.findOne({ where: { email } });

    if (emailExists) {
      return res.status(400).json({ error: "Email is already used before" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.create({
      username,
      password: hashedPassword,
      email,
      roleId: 1,
    });

    const userRole = await roles.findOne({ where: { id: newUser.roleId } });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    const userdata = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: userRole ? userRole.name : newUser.roleId, // Return the role name
    };

    res.json({ message: "success", userdata, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { error } = signInSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { email, password } = req.body;

    const user = await users.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const userRole = await roles.findOne({ where: { id: user.roleId } });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    const userData = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: userRole ? userRole.name : user.roleId,
    };

    res.json({ message: "success", userdata: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signOut = async (req, res) => {
  res.json({ message: "success, you are signed out" });
};

module.exports = { getAllUsers, signUp, signIn, signOut };
