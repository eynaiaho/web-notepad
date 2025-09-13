const express = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
const app = express();

app.use(express.json());
app.use(express.static("public"))

app.post('/note/add', (req, res) => {
    const {note} = req.body;
    if(!note) return res.status(400).send({error: "Note Required"});
    db.run(
        "INSERT INTO notes(note) VALUES(?)", [note], (e) => {
            if(e) {
                console.error(`SQLite Err: ${e}`);
                return res.status(500).send("Database Error");
            }
            db.get("SELECT * FROM notes WHERE note = ?", [note], (e, r) => {
                if(e) {
                    console.error(`SQLite Err: ${e}`);
                    return res.status(500).send("Database Error");
                }
                if(r) {
                    res.json({success: true, id: r.note_id});
                }
            })
        }
    )
});

app.post('/note/get/all', (req, res) => {
    db.all("SELECT * FROM notes", [], (e, r) => {
        if(e) {
            console.error(`SQLite Err: ${e}`);
            return res.status(500).send("Database Error");
        }
        if(r) res.json(r);
    });
});

app.post('/note/get', (req, res) => {
    const {id} = req.body;
    if(!id) return;
    db.get("SELECT * FROM notes WHERE note_id = ?", [id], (e, r) => {
        if(e) {
            console.error(`SQLite Err: ${e}`);
            return res.status(500).send("Database Error");
        }
        if(r) res.json({success: true, note: r.note, id: r.note_id});
    });
});

app.delete('/note/delete', (req, res) => {
    const {id} = req.body;
    db.get("SELECT * FROM notes WHERE note_id = ?", [id], (e, r) => {
        if(e) {
            console.error(`SQLite Err: ${e}`);
            return res.status(500).send("Database Error");
        }
        if(r) {
            db.run("DELETE FROM notes WHERE note_id = ?", [id], (e) => {
                if(e) {
                    console.error(`SQLite Err: ${e}`);
                    return res.status(500).send("Database Error");
                }
                res.json({success: true});
            });
        }
    });
});

app.listen(80, () => console.log("Server is available!"));
