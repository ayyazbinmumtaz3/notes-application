// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers("authorization");
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, (err, user) => {
//     if (err) return module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
