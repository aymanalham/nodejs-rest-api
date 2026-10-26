const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
const authHeader = req.headers.authorization;

if (!authHeader) {
    return res.status(401).json({
        message: "Authentication required"
    });
}

const [scheme, token] = authHeader.split(" ");

if (
    scheme !== "Bearer" ||
    !token ||
    authHeader.split(" ").length !== 2
) {
    return res.status(401).json({
        message: "Authorization format must be Bearer <token>"
    });
}

if (!process.env.JWT_SECRET) {
    return res.status(500).json({
        message: "Authentication configuration error"
    });
}

try {
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    if (
        !decoded.userId ||
        !["user", "admin"].includes(decoded.role)
    ) {
        return res.status(401).json({
            message: "Invalid token payload"
        });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
} catch (error) {
    return res.status(401).json({
        message: "Invalid or expired token"
    });
}

};

const adminMiddleware = (req, res, next) => {
if (req.role !== "admin") {
return res.status(403).json({
message: "Administrator privileges required"
});
}

next();

};

module.exports = {
authMiddleware,
adminMiddleware
};