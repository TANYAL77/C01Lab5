test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });


  const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

beforeEach(async () => {
    //to make sure the database is reset before each test
    await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
  });

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const response = await fetch(`${SERVER_URL}/getAllNotes`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.response).toEqual([]);
  });
  

  test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    const note1 = { title: 'Note 1', content: '123' };
    const note2 = { title: 'Note 2', content: '456' };
  
    await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note1),
    });

    await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(note2),
    });


    const response = await fetch(`${SERVER_URL}/getAllNotes`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.response).toHaveLength(2);

    expect(data.response[0].title).toBe(note1.title);
    expect(data.response[1].title).toBe(note2.title);
  });
  
  test("/deleteNote - Delete a note", async () => {
    const note1 = { title: 'Note to delete', content: '123' };
    const postResponse = await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note1),
    });
    const postData = await postResponse.json();
    const noteId = postData.insertedId;

    const deleteResponse = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: 'DELETE',
      });
    const deleteDate = await deleteResponse.json();
    expect(deleteResponse.status).toBe(200);
    expect(deleteDate.response).toBe( `Document with ID ${noteId} deleted.`); 

  });
  
  test("/patchNote - Patch with content and title", async () => {
    const originalNote = { title: 'Original Title', content: 'Original Content' };
    const postResponse = await fetch(`${SERVER_URL}/postNote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(originalNote),
    });
    const postData = await postResponse.json();
    const noteId = postData.insertedId;

    const updatedNote = { title: 'Updated Title', content: 'Updated Content' };

    const patchResponse = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
    });
    const patchData = await patchResponse.json();
    expect(patchResponse.status).toBe(200); 
    expect(patchData.response).toBe(`Document with ID ${noteId} patched.`); 

  });
  
  test("/patchNote - Patch with just title", async () => {
    const originalNote = { title: 'Original Title', content: 'Original Content' };
    const postResponse = await fetch(`${SERVER_URL}/postNote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(originalNote),
  });
    const postData = await postResponse.json();
    const noteId = postData.insertedId;

    const updatedNote = { title: 'Updated Title' };

    const patchResponse = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
    });
    const patchData = await patchResponse.json();
    expect(patchResponse.status).toBe(200); 
    expect(patchData.response).toBe(`Document with ID ${noteId} patched.`); 


    const getResponse = await fetch(`${SERVER_URL}/getAllNotes`);
    const getData = await getResponse.json();
    const un = getData.response.find(note => note._id === noteId);
    expect(un.title).toBe(updatedNote.title);
    expect(un.content).toBe(originalNote.content);

  });
  
  test("/patchNote - Patch with just content", async () => {

    const originalNote = { title: 'Original Title', content: 'Original Content' };
    const postResponse = await fetch(`${SERVER_URL}/postNote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(originalNote),
  });
    const postData = await postResponse.json();
    const noteId = postData.insertedId;

    const updatedNote = { content: 'Updated Content' };

    const patchResponse = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
    });
    const patchData = await patchResponse.json();
    expect(patchResponse.status).toBe(200); 
    expect(patchData.response).toBe(`Document with ID ${noteId} patched.`); 


    const getResponse = await fetch(`${SERVER_URL}/getAllNotes`);
    const getData = await getResponse.json();
    const un = getData.response.find(note => note._id === noteId);
    expect(un.title).toBe(originalNote.title);
    expect(un.content).toBe(updatedNote.content);
  });
  
  test("/deleteAllNotes - Delete one note", async () => {
    const noteToPost = { title: 'Note to delete', content: 'wifhdsknf' };
    await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteToPost),
    });

    const deleteResponse = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: 'DELETE',
    });
    const deleteData = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);

    expect(deleteData.response).toBe(`1 note(s) deleted.`);
  });
  
  test("/deleteAllNotes - Delete three notes", async () => {
    const notesToPost = [
        { title: 'Note 1', content: '123' },
        { title: 'Note 2', content: '456' },
        { title: 'Note 3', content: '789' },
    ];

    for (const note of notesToPost) {
        await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
        });
    }

    const deleteResponse = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: 'DELETE',
    });
    const deleteData = await deleteResponse.json();

    expect(deleteResponse.status).toBe(200);
    expect(deleteData.response).toBe(`3 note(s) deleted.`);

  });
  
  test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    const noteToPost = { title: 'Note for color update', content: 'hello world' };
    const postResponse = await fetch(`${SERVER_URL}/postNote`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteToPost),
    });
    const postData = await postResponse.json();
    const noteId = postData.insertedId;

    const newColor = { color: '#FF0000' };

    const patchResponse = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColor),
    });
    const ColorData = await patchResponse.json();

    expect(patchResponse.status).toBe(200);

    expect(ColorData.message).toBe('Note color updated successfully.');

  });