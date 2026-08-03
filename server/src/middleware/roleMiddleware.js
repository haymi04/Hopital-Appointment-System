const authorize = (...roles) => {
    return (req, res, next) => {
        // Safe check: make sure req.user is set
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
};


module.exports = authorize;