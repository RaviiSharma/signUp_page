const express = require('express');
const router = express.Router();
const userController = require("../Controllers/usersController")
 const userMW = require("../MiddleWare/commonMW")


router.post("/signUp", userController.signUp)
router.post("/login", userController.loginUser)

router.get("/getUser/:userId", userMW.authentication,userController.getUser)
router.get("/getAllUsers", userMW.authentication,userController.getAllUsers)

router.put("/UpdateUsers/:userId", userMW.authentication,userController.UpdateUsers)



module.exports = router;