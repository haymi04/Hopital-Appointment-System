const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/profile", protect, (req,res)=>{
    res.json({
        message:"Protected route accessed",
        user:req.user
    });
});
//role
router.get(
    "/admin-test",
    protect,
    authorize("ADMIN"),
    (req, res) => {

        res.json({
            message: "Welcome Admin",
            user: req.user
        });

    }
);

module.exports = router;