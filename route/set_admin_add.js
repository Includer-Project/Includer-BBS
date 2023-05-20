const sqlite3 = require('sqlite3');
const func = require('./func.js');

function set_admin_add(req, res) {
    const db = new sqlite3.Database(__dirname + '/../data.db');

    let data = req.body;

    let user_id = data.user_id;

    if(req.session['user_name']) {
        let user_name = req.session['user_name'];

        db.all("select set_data from user_data where user_name = ? and set_name = 'auth'", [user_name], function(err, db_data) {
            if(db_data[0].set_data === 'admin') {
                db.all("select set_data from user_data where user_name = ? and set_name = 'user_real_name' limit 1", [user_id], function(err, db_data) {
                    if(db_data.length === 0) {
                        res.json({
                            "req" : "error",
                            "reason" : "user_id not exist"
                        });
                        db.close();
                    } else {
                        let user_real_name = db_data[0].set_data;

                        db.run("update user_data set set_data = 'admin' where user_name = ? and set_name = 'auth'", [user_id]);

                        res.json({
                            "req" : "ok",
                            "user_name" : user_id,
                            "user_real_name" : user_real_name
                        });
                        db.close();
                    }
                });
            } else {
                res.json({
                    "req" : "error",
                    "reason" : "auth reject"
                });
                db.close();
            }
        });
    } else {
        res.json({
            "req" : "error",
            "reason" : "user_name not exist"
        });
        db.close();
    }
}

module.exports = {
    set_admin_add : set_admin_add
};