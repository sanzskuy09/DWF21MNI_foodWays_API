const jwt = require("jsonwebtoken");

exports.authenticated = async (req, res, next) => {
  let header, token;

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  ) {
    return res.status(401).send({
      status: "Failed",
      message: "Access Denied",
    });
  }

  try {
    const secretKey = "lvj3lkas82r17kj";

    const verified = jwt.verify(token, secretKey);

    req.userId = verified;

    next();
  } catch (error) {
    res.status(400).send({
      status: "Failed",
      message: "Invalid Token",
    });
  }
};
