const sqlite3 = require('sqlite3');
const func = require('./func.js');

function study_edit(req, res) {
    const db = new sqlite3.Database(__dirname + '/../data.db');

    if(req.session['user_name']) {
        let user_name = req.session['user_name'];

        db.all("select doc_data from study_data where doc_id = ? and set_name = 'user_name'", [req.params.id], function(err, db_data) {
            if(db_data.length > 0) {
                db.all("select set_data from user_data where user_name = ? and set_name = 'auth'", [user_name], function(err, db_data_2) {
                    if(db_data_2[0].set_data === 'admin' || req.session['user_name'] === db_data[0].doc_data) {
                        let data = req.body;

                        let team_name = data.team_name;
                        let content = data.content;
                        let date = data.date;

                        try {
                            date = new Date(date);
                            if(isNaN(date.getTime())) {
                                throw new Error();
                            }
                
                            date = func.date_change(date);
                        } catch {
                            date = func.get_date();
                        }

                        if(content === '') {
                            db.run("delete from study_data where doc_id = ?", [req.params.id]);
                        } else {
                            db.run("update study_data set doc_data = ? where doc_id = ? and set_name = 'team_name'", [
                                team_name,
                                req.params.id
                            ]);
                            db.run("update study_data set doc_data = ? where doc_id = ? and set_name = 'content'", [
                                content,
                                req.params.id
                            ]);
                            db.run("update study_data set doc_data = ? where doc_id = ? and set_name = 'date'", [
                                date,
                                req.params.id
                            ]);
                        }

                        res.json({
                            "req" : "ok"
                        });
                        db.close();
                    } else {
                        res.json({
                            "req" : "error",
                            "reason" : "user_name !== doc_user_name && user_auth !== \"admin\""
                        });
                        db.close();
                    }
                });
            } else {
                res.json({
                    "req" : "error",
                    "reason" : "document not exist"
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
    study_edit : study_edit
};