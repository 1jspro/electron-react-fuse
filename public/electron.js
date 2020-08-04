const electron = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Async = require("async");
const Datastore = require("@seald-io/nedb");
const writeFileAtomic = require("fs-write-stream-atomic");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
let mainWindow,
  database = {};

const isDev = process.env.NODE_ENV === "development";

const dbPath = path.join(process.cwd(), "dbs");
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const dbs = [
  {
    url: "positions",
    db: "positions",
    location: async (response) => await response.data.data.positionData,
  },
  {
    url: "dynamic-forms",
    db: "dynamicForms",
    location: async (response) => await response.data.data.dynamicFormsData,
  },
  {
    url: "education-levels",
    db: "educationLevels",
    location: async (response) => await response.data.data.educationLevelData,
  },
  {
    url: "industries",
    db: "industries",
    location: async (response) => await response.data.data.industryData,
  },
  {
    url: "professions?list=true",
    db: "professions",
    location: async (response) => await response.data.data.professionData,
  },
  {
    url: "id-cards",
    db: "idCards",
    location: async (response) => await response.data.data.idCards,
  },
  {
    url: "groups",
    db: "groups",
    location: async (response) => await response.data.data.groupData,
  },
  {
    url: "members-for-idcard",
    db: "getMembersidcard",
    location: async (response) => await response.data.data.members,
  },
];

for (const { db } of dbs) {
  database[db] = new Datastore({
    filename: path.join(process.cwd(), "dbs", `${db}.json`),
  });
}

database.members = new Datastore({
  filename: path.join(process.cwd(), "dbs", "members.json"),
});

database.newCards = new Datastore({
  filename: path.join(process.cwd(), "dbs", "newCards.json"),
});

database.levelResponse = new Datastore({
  filename: path.join(process.cwd(), "dbs", `levelResponse.json`),
});

database.data = new Datastore({
  filename: path.join(process.cwd(), "dbs", `data.json`),
});

axios.defaults.baseURL = "https://app.atdamss.com/api/";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

async function replaceData(url, data) {
  const doc = await database.data.findOne({ url });
  if (doc) {
    await database.data.update({ url }, { $set: { data } });
  } else {
    await database.data.insert({ url, data });
  }
}

async function fetchItems(level_id) {
  await database.data.remove({}, { multi: true });
  await database.data.compactDatafile();

  await database.levelResponse.remove({}, { multi: true });
  await database.levelResponse.compactDatafile();

  const response1 = await axios.get(`levelResponse/${level_id}`, {});
  const levels = await response1.data.data;
  await database.levelResponse.insert(levels);

  const response2 = await axios.get(`levelDataResponse/${levels[0].id}`, {});
  const branches = await response2.data.data;
  await replaceData(`levelDataResponse/${levels[0].id}`, branches);

  for (const branch of branches) {
    const response3 = await axios.get(
      `levelDataResponse/${levels[1].id}/${branch.id}`,
      {}
    );
    const zones = await response3.data.data;
    await replaceData(`levelDataResponse/${levels[1].id}/${branch.id}`, zones);

    if (levels.length === 3) {
      for (const zone of zones) {
        const response4 = await axios.get(
          `levelDataResponse/${levels[2].id}/${zone.id}`,
          {}
        );
        const data = await response4.data.data;
        await replaceData(`levelDataResponse/${levels[2].id}/${zone.id}`, data);
      }
    }
  }
}

async function fetchMembers() {
  try {
    await database.members.remove({}, { multi: true });
    await database.members.compactDatafile();
    const res = await axios.get("members", {});
    const data = await res.data.data.members;
    await database.members.insert(data);
    // await Async.forEachLimit(
    //   data
    //     .map((v) => v.profile_pic)
    //     .filter((v) => !!v)
    //     .map((v) => path.basename(v))
    //     .filter((v) => !pics.some((pic) => pic === v)),
    //   20,
    //   async (file) => {
    //     try {
    //       const picRes = await axios.get(
    //         `https://app.atdamss.com/storage/profile_picture/${file}`,
    //         {
    //           responseType: "stream",
    //         }
    //       );
    //       await new Promise((res, rej) => {
    //         const stream = writeFileAtomic(
    //           path.join(process.cwd(), "pic", file)
    //         );
    //         picRes.data.pipe(stream);
    //         stream.on("finish", function () {
    //           res();
    //         });
    //         stream.on("error", function (err) {
    //           rej(err);
    //         });
    //       });
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // );
  } catch (err) {
    console.log(err);
  }
}

async function loadDatabase() {
  for (const { db } of dbs) {
    await database[db].loadDatabase();
  }
  await database.members.loadDatabase();
  await database.newCards.loadDatabase();
  await database.levelResponse.loadDatabase();
  await database.data.loadDatabase();
}

function createWindow() {
  if (new Date(2023, 9, 5) < new Date(Date.now())) {
    app.quit();
    throw new Error("expired");
  }
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.setIcon(path.join(__dirname, "favicon.ico"));
  mainWindow.on("ready-to-show", function () {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({
        mode: "undocked",
      });
    }
  });

  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }

  ipcMain.on("token", async (event, token, level_id) => {
    axios.defaults.headers.common.Authorization = token;
    try {
      await loadDatabase();
      const cards = await database.newCards.find({});
      await Async.forEachSeries(cards, async (member) => {
        try {
          const res = await axios.post("id-cards", member);
        } catch (err) {
          event.sender.send("error", err.response.data);
        }
      });
      const members = await database.members.find({ pushed: "none" });
      await Async.forEachSeries(members, async (member) => {
        try {
          await axios.post("members", member);
        } catch (err) {
          event.sender.send("error", err.response.data);
        }
      });
      // await fetchMembers();
      await Async.forEachSeries(dbs, async function (item) {
        const { url, db, location } = item;
        try {
          await database[db].remove({}, { multi: true });
          await database[db].compactDatafile();
          const res = await axios.get(url, {});
          const data = await location(res);
          await database[db].insert(data);
        } catch (err) {
          console.log(err);
        }
      });
      await fetchItems(level_id);
    } finally {
      event.sender.send("token");
    }
  });
  ipcMain.on("get-data", async (event, url) => {
    const doc = await database.data.findOne({ url });
    event.sender.send(`return-${url}`, doc ? doc.data : []);
  });
  ipcMain.on("get-member", async (event, memberId) => {
    const docs = await database.members.find({ _id: memberId });
    event.sender.send("return-member", docs.length > 0 ? docs[0] : null);
  });
  ipcMain.on("remove-member", async (event, id) => {
    await database.members.remove({ _id: id });
    event.sender.send("removed");
  });
  ipcMain.on("get-members", async (event, postData) => {
    try {
      const docs = await database.members
        .find(
          postData.searchText
            ? {
                $or: [
                  {
                    first_name: {
                      $regex: new RegExp(
                        postData.searchText.toLowerCase(),
                        "i"
                      ),
                    },
                  },
                  {
                    last_name: {
                      $regex: new RegExp(
                        postData.searchText.toLowerCase(),
                        "i"
                      ),
                    },
                  },
                ],
              }
            : {}
        )
        .sort({ created_at: 1 })
        .limit(postData.rowsPerPage)
        .skip(postData.page * postData.rowsPerPage);
      if (docs.length > 0) {
        docs[0].totalPage = await database.members.count();
      }
      event.sender.send("return-members", docs);
    } catch (err) {
      event.sender.send("return-members", null);
    }
  });
  ipcMain.on("get-id-cards", async (event, postData) => {
    try {
      const docs = await database.idCards
        .find(
          postData.searchText
            ? {
                $or: [
                  {
                    first_name: {
                      $regex: new RegExp(
                        postData.searchText.toLowerCase(),
                        "i"
                      ),
                    },
                  },
                  {
                    last_name: {
                      $regex: new RegExp(
                        postData.searchText.toLowerCase(),
                        "i"
                      ),
                    },
                  },
                  {
                    id_card_number: {
                      $regex: new RegExp(
                        postData.searchText.toLowerCase(),
                        "i"
                      ),
                    },
                  },
                ],
              }
            : {}
        )
        .sort({ created_at: 1 })
        .limit(postData.rowsPerPage)
        .skip(postData.page * postData.rowsPerPage);
      if (docs.length > 0) {
        docs[0].totalRecords = await database.idCards.count();
      }
      event.sender.send("return-id-cards", docs);
    } catch (err) {
      console.log(err);
      event.sender.send("return-id-cards");
    }
  });
  ipcMain.on("get-database", async (event, dbName) => {
    try {
      const docs = await database[dbName].find().sort({ created_at: 1 });
      event.sender.send(`return-${dbName}`, docs);
    } catch (err) {
      event.sender.send(`return-${dbName}`, []);
    }
  });
  ipcMain.on("register-member", async (event, member) => {
    await database.members.insert({ ...member, pushed: "none" });
  });
  ipcMain.on("generate-card", async (event, card) => {
    await database.newCards.insert(card);
  });
  ipcMain.on("fetch-data", async (event, ip) => {
    const port = 8081;
    const url = `http://${ip}:${port}`;
    // const res = await axios.get(url + "/pics");
    // const pics = await res.data;
    // for (const pic of pics) {
    //   const tmp = await axios.get(url + "/" + pic, {
    //     responseType: "stream",
    //   });
    //   tmp.data.pipe(writeFileAtomic(path.join(process.cwd(), "pic", pic)));
    // }
    const res1 = await axios.get(url + "/dbs");
    const dbs = await res1.data;
    for (const db of dbs) {
      const tmp = await axios.get(url + "/" + db, {
        responseType: "stream",
      });
      tmp.data.pipe(writeFileAtomic(path.join(process.cwd(), "dbs", db)));
    }
    await loadDatabase();
    event.sender.send("finish-fetch");
  });
  (async function () {
    await loadDatabase();
  })();
}

app.on("ready", createWindow);
