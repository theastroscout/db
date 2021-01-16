process.env.test = true;
let hqDB = require("./db");

const init = async () => {
	let mongo = await hqDB({
		type: "mongo"
	});
	console.log(mongo);
	mongo.close();

	let mysql = await hqDB({
		type: "mysql",
		database: "mysql",
		user: "root",
		password: "pTD4cAHr()[3=>m7",
		connectionLimit: 2
	});
	console.log(mysql);
	let result = await mysql.query("SELECT table_name FROM information_schema.tables");
	console.log(result);
	mysql.pool.end();
};
init();