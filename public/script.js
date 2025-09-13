document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/note/get/all", {method: "POST"});
        const data = await response.json();
        data.forEach(data => {
            let note = data.note;
            if(note.length > 10) {
                note = note.slice(0, 10) + "...";
            }
            const notesDiv = document.querySelector(".notes");
            const newDiv = document.createElement("div");
            newDiv.className = "note";
            newDiv.id = `note_${data.note_id}`;
            const newText = document.createElement("label");
            newText.style = "color: white;font-weight: bold;text-align:left;";
            newText.textContent = note;
            newDiv.appendChild(newText);
            notesDiv.appendChild(newDiv);
        });
    } catch(error) {
        console.error(`Error: ${error}`);
    }
});

document.querySelector("#addNote").addEventListener("click", () => {
    document.querySelector(".addnotes").style.display = "flex";
    document.querySelector(".notes").style.display = "none";
});

document.getElementById("add").addEventListener("click", async () => {
    const note = document.querySelector("#note").value || null;
    if(note === null) return alert("note section cannot be empty");
    try {
        const response = await fetch("/note/add", {
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({note: note})
        });
        if(!response.ok) return console.error("Communication with the server failed");
        const data = await response.json();
        if(data.success == true) {
            window.location.reload();
        }
    } catch(error) {
        console.error(`Error: ${error}`);
    }
});

document.addEventListener("click", async (event) => {
    if(event.target.id) {
        let id = event.target.id.split("_")[1];
        try {
            const response = await fetch("/note/get", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({id: id})
            });
            if(!response.ok) return console.error("Communication with the server failed");
            const data = await response.json();
            if(data.success == true) {
                const noteDiv = document.querySelector(".noteDiv");
                const newText = document.createElement("p");
                newText.style = "color: white;";
                newText.textContent = data.note;
                newText.id = data.id;
                noteDiv.appendChild(newText);
                document.querySelector(".noteDiv").style.display = "flex";
                document.querySelector(".notes").style.display = "none";
            }
        } catch(error) {
            console.error(`Error: ${error}`);
        }
    }
});

const back = () => {
    window.location.reload();
};

const deleteBtn = async () => {
    const noteDiv = document.querySelector(".noteDiv");
    const id = document.querySelector("p").id;
    try {
        const response = await fetch("/note/delete", {
            method: "DELETE",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({id: id})
        });
        const data = await response.json();
        if(data.success == true) {
            window.location.reload();
        } else alert("Delete failed");
    } catch(error) {
        console.error(`Error: ${error}`);
    }
};
