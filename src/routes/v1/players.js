const express = require('express');
const mysql = require('mysql2/promise');

const { mysqlConfig } = require('../../config');
const isLoggedIn = require('../../middleware/auth');
const { addPlayerSchema } = require('../../middleware/valSchemas');
const validation = require('../../middleware/validation');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
            SELECT * FROM player
            `);
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

router.get('/userplayer', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
          SELECT * FROM player
          WHERE user_id = ${mysql.escape(req.user.accountId)}
          `);
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
          DELETE FROM player
          WHERE id = ${mysql.escape(req.params.id)}
          `);
    await con.end();

    return res.send({ msg: 'Succesfully deleted post', data });
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

router.post('/', isLoggedIn, validation(addPlayerSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
              INSERT INTO player (city, position, description, phone, user_id, name, last_name)
              VALUES (${mysql.escape(req.body.city)},
              ${mysql.escape(req.body.position)},
              ${mysql.escape(req.body.description)},
              ${mysql.escape(req.body.phone)},
              ${mysql.escape(req.user.accountId)},
              ${mysql.escape(req.body.name)},
              ${mysql.escape(req.body.lastName)})
              `);
    await con.end();

    if (!data.insertId || data.affectedRows !== 1) {
      return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
    }

    return res.send({
      msg: 'Succesfully added player',
      playerId: data.insertId,
    });
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

module.exports = router;
