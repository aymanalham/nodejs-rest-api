const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("Invalid token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        req.role = decoded.role;

        next();

    } catch (error) {
        return res.status(401).send("Invalid or expired token");
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).send("Admins only");
    }

    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware
};