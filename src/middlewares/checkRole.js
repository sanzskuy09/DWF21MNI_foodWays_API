const { User } = require("../../models");

exports.checkRolePartner = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });
    console.log(user.role);

    if (user.role === "partner") {
      next();
    } else {
      res.status(401).send({
        status: "Failed",
        message: "Your role is not allowed to access",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// exports.checkRoleUser = async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         id: req.userId.id,
//       },
//     });

//     if (user.role === "user") {
//       next();
//     } else {
//       res.status(401).send({
//         status: "Failed",
//         message: "Your role is not allowed to access",
//       });
//     }
//   } catch (error) {
//     res.status(400).send({
//       status: "Failed",
//       message: "Your role is not allowed to access",
//     });
//   }
// };
