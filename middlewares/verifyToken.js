import jwt from "jsonwebtoken";

// all login users (user | admin)
export const verifyToken = (req, res, next) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const authHeader = req.headers.authorization || req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if (err) return res.status(403).json("invalid token");

      req.user = data;
      next();
    });
  } else return res.status(401).json("not authenticated");
};

// if own user or admin
export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
      next();
      return;
    }

    return res.status(403).json("you are not allowed to access this page");
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to access this page");
    }
  });
};

export default {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
