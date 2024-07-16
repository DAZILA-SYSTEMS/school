const Cred = require("../models/Credential");
const { Op } = require("sequelize");

// Verify SuperAdmin
function verifyStudent(req, res, next) {
  Cred.findOne({
    where: {
      [Op.or]: [
        {
          email: req.userLogger,
          instLinker: req.body.instLinker,
          student: 1,
          deleted: 0,
        },
        {
          contact: req.userLogger,
          instLinker: req.body.instLinker,
          student: 1,
          deleted: 0,
        },
        {
          email: req.userLogger,
          instLinker: req.body.instLinker,
          guardian: 1,
          deleted: 0,
        },
        {
          contact: req.userLogger,
          instLinker: req.body.instLinker,
          guardian: 1,
          deleted: 0,
        },
      ],
    },
  })
    .then((cred) =>
      cred
        ? ((req.credLinker =
            parseInt(cred.student) === 1 ? cred.linker : cred.refLinker),
          next())
        : res.sendStatus(403)
    )
    .catch((err) => res.sendStatus(403));
}

module.exports = verifyStudent;
