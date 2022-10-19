/*

DB Module

*/

(() => {

	/*

	DB Object

	*/
	
	let db = async options => {
		if(options === undefined || options === null){
			return db._error("Options is not specified");
		}
		
		options = options || {};

		if(options.type === undefined || options.type === null){
			return db._error("Type of DB is not specified");
		}

		db.options = options;
		if(db.types[db.options.type] !== undefined){
			return await db.types[db.options.type].init(db.options);
		}

		return db._error(`"${options.type}" is not presented in this package.`);
	};

	db.types = {};

	/*

	MongoDB

	*/

	db.types.mongo = {
		init: async options => {
			options.host = options.host || "localhost";
			options.port = options.port || 27017;
			let mongodb = require("mongodb");
			var MongoClient = mongodb.MongoClient;
			var MongoServer = mongodb.Server;
			let server = new MongoServer(options.host, options.port);
			let mongo = await MongoClient.connect(server);
			if(!mongo){
				return db._error(`Connot connect to MongoDB with ${options.host}:${options.port}`);
			}

			return {
				client: mongo,
				server: server,
				ObjectID: mongodb.ObjectID
			};
		}
	};

	/*

	MySQL

	*/

	db.types.mysql = {

		init: options => {
			options.host = options.host || "localhost";
			if(options.user === undefined || options.user === null){
				return db._error("User is not specified");
			}
			if(options.database === undefined || options.database === null){
				return db._error("DB is not specified");
			}
			if(options.password === undefined || options.password === null){
				return db._error("Password is not specified");
			}

			let mysql = db.types.mysql;
			const mysql2 = require("mysql2");
			mysql.pool = mysql2.createPool({
				connectionLimit: options.connectionLimit || 5,
				multipleStatements: true,
				host: options.host,
				user: options.user,
				database: options.database,
				password: options.password
			});

			delete options.password;
			options.pool = mysql.pool;
			options.query = mysql.query;

			return options;
		},

		/*

		MySQL Query

		*/

		query: function(query, options, cb){
			if(options === undefined || options === null){
				options = [];
			} else {
				let queryType;
				if(query.match(/INSERT/)){
					queryType = "insert";
				} else if(query.match(/UPDATE/)){
					queryType = "update";
				}
				for(let [i,el] of options.entries()){
					if(queryType === "insert"){
						for(let i in el){
							if(el[i] && typeof el[i] === "object" && typeof el[i].getMonth !== "function"){
								el[i] = JSON.stringify(el[i]);
							}
						}
					} else if(queryType === "update"){
						if(el && typeof el === "object" && typeof el.getMonth !== "function"){
							options[i] = JSON.stringify(el);
						}
					}
				}
			}

			return new Promise(resolve => {
				let pool = this.pool;
				pool.getConnection((err, connection) => {
					if(connection){
						connection.query(query, options, function(err, result){
							if(err){
								if(process.env.test !== undefined && process.env.test !== null){
									throw new Error(err);
								}
								result = false;
							} else if(result === undefined || (!result.length && !Object.keys(result).length)){
								result = false;
							}

							pool.releaseConnection(connection);
							resolve(result);
							if(cb !== undefined){
								cb(err, result);
							} else {
								console.error(err);
							}
						});
					} else {
						if(process.env.test !== undefined && process.env.test !== null){
							throw new Error(err);
						}
						resolve(false);
						if(cb !== undefined){
							cb(err, false);
						} else {
							console.error(err);
						}
					}
				});
			});
		}
	}

	/*

	Send Error

	*/

	db._error = (msg) => {
		if(process.env.test !== undefined && process.env.test !== null){
			throw new Error(msg);
		} else {
			console.error(err);
		}
		return false;
	};

	module.exports = db;

})();