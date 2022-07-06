const express = require('express');
const mysql = require('mysql2/promise');

const { addTeamSchema } = require('../../middleware/valSchemas');
const { mysqlConfig } = require('../../config');
const isLoggedIn = require('../../middleware/auth');
const validation = require('../../middleware/validation');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
          SELECT * FROM team
          `);
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

router.get('/userteam', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
          SELECT * FROM team
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
          DELETE FROM team
          WHERE id = ${mysql.escape(req.params.id)}
          `);
    await con.end();

    return res.send({ msg: 'Succesfully deleted post', data });
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

router.post('/', isLoggedIn, validation(addTeamSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`
            INSERT INTO team (city, league, position, description, phone, team_name, user_id)
            VALUES (${mysql.escape(req.body.city)},
            ${mysql.escape(req.body.league)},
            ${mysql.escape(req.body.position)},
            ${mysql.escape(req.body.description)},
            ${mysql.escape(req.body.phone)},
            ${mysql.escape(req.body.teamName)},
            ${mysql.escape(req.user.accountId)})
            `);
    await con.end();

    if (!data.insertId || data.affectedRows !== 1) {
      return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
    }

    return res.send({
      msg: 'Succesfully added team',
      teamId: data.insertId,
    });
  } catch (err) {
    return res.status(500).send({ msg: 'An issue was found. Please try again later.' });
  }
});

module.exports = router;
