const Datastore = require("@seald-io/nedb");

class JwtService {
  constructor(update) {
    this.db = {};
    this.update = update;
  }
}
const instance = new JwtService(async function (dbName, items = []) {
  try {
    this.db[dbName] = new Datastore({ filename: dbName, autoload: true });
    const docs = await this.db[dbName].find();
    const newDocs = items.filter((v1) => !docs.some((v2) => v2.id === v1.id));
    await this.db[dbName].insert(newDocs);
  } catch (err) {
    console.log({ dbName, err });
  }
});

export default instance;
