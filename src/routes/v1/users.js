const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const { registrationSchema } = require('../../middleware/valSchemas');
const { mysqlConfig } = require('../../config');
const validation = require('../../middleware/validation');

const router = express.Router();

router.post('/register', validation(registrationSchema), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
        INSERT INTO users (email, password)
        VALUES (${mysql.escape(req.body.email)}, '${hash}')
        `);
    await con.end();

    if (!data.insertId || data.affectedRows !== 1) {
      return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
    }

    return res.send({
      msg: 'Succesfully created account',
      userId: data.insertId,
    });
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

module.exports = router;
