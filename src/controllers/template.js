exports.function = async (req, res) => {
  try {
    res.send({
      status: "success",
      message: "Success",
      data: {
        data,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
