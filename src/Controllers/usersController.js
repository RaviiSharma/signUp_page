const userModel = require("../Models/usersModel");

const jwt = require("jsonwebtoken");

//============================================================== createUser =======================================================================

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const isValidRequest = function (object) {
  return Object.keys(object).length > 0;
};

const isValidPassword = function (value) {
  const regexForPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{6,20}$/;
  return regexForPassword.test(value);
};
const regixValidator = function (value) {
  const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regex.test(value);
};

//Register Users
const signUp = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequest(data)) {
      return res
        .status(400)
        .send({ status: false, message: "author data is required" });
    }
    //using desturcturing
    const { UserName, Password, Role } = data;

    if (!isValid(UserName) || !regixValidator(UserName)) {
      return res.status(400).send({
        status: false,
        message: "UserName is required or its should contain character",
      });
    }

    if (!isValid(Password)) {
      console.log(Password);
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!isValidPassword(Password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid password" });
    }

    if (!isValid(Role) || !regixValidator(Role)) {
      return res.status(400).send({
        status: false,
        message: "Role is required or its should contain character",
      });
    }

    const newUser = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

// login User
const loginUser = async function (req, res) {
  try {
    let UserName = req.body.UserName;
    let Password = req.body.Password;

    if (!UserName) {
      return res
        .status(400)
        .send({ status: false, message: "UserName is mandatory" });
    }

    if (!Password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is mandatory" });
    }

    let Author = await userModel.findOne({
      UserName: UserName,
      Password: Password,
    });

    if (!Author) {
      return res.status(400).json({ error: "not found" });
    }

    let token = jwt.sign(
      {
        id: Author._id,
        role: Author.Role,
      },
      "Project-1"
    );
    res.status(201).send({ status: true, data: token });
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
};

// Get single User
const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = req.user; //decoded token
    console.log("inside endpoint", user);

    if (user.role !== "Admin") {
      const data = await userModel.findById(user.id);
      res.status(200).json({ message: "Sorry you are not Admin", data: data });
    } else {
      console.log("UserId of user", userId);
      const anyData = await userModel.findById(userId);
      res.status(200).json({ message: "Admin", data: anyData });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all Users
const getAllUsers = async (req, res) => {
  try {
    const user = req.user;
    console.log("inside endpoint", user);

    if (user.role !== "Admin") {
      return res.status(404).json({ message: "Sorry you are not Admin" });
    }

    const allUsers = await userModel.find();
    res.status(200).json({ data: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update  User
const UpdateUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("UserId of user", userId);
    let Body = req.body;
    let filter = {};
    const user = req.user; //decoded token
    console.log("inside endpoint", user);
    console.log(Body);

    if (Body["UserName"]) {
      filter["UserName"] = Body["UserName"];
    }
    if (Body["Password"]) {
      filter["Password"] = Body["Password"];
    }
    if (Body["Role"]) {
      filter["Role"] = Body["Role"];
    }
    // console.log(filter)
    if (user.role !== "Admin") {
      if (user.id == userId) {
        let updatedData = await userModel.findByIdAndUpdate(
          { _id: user.id },
          filter,
          { new: true }
        );
        res
          .status(200)
          .json({
            message:
              "Sorry you are not Admin, you can update only yours profile",
            data: updatedData,
          });
      } else {
        res
          .status(401)
          .json({
            message:
              "Sorry you are not Admin, you can not update others users profile",
          });
      }
    } else {
      const anyData = await userModel.findByIdAndUpdate(
        { _id: userId },
        filter,
        { new: true }
      );
      res.status(200).json({ message: "Admin", data: anyData });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signUp, loginUser, getUser, getAllUsers, UpdateUsers };
