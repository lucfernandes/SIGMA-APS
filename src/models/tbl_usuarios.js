module.exports.consultaUsuario = function (user) {
    return new Promise(function (resolve, err) {
        const mysql = require("mysql");

        const connection = mysql.createConnection({
            
        });

        connection.connect();

        connection.query(
            `SELECT * 
                            FROM usuarios u
                            WHERE u.nome_reconhecimento = '${user}'`,
            function (error, results, fields) {
                if (error) return err(error);
                resolve(results[0]);
            }
        );

        connection.end();

    });
    
};
