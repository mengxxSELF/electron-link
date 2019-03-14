const mysql = require('mysql')
const mysql_connection = {};

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '5211314mxx',
  database: 'activity'
});

//断开连接
function _release(connection) {
  try {
    connection.release();
  } catch (err) {
    console.log('DB-关闭数据库连接异常！- 2: ' + err);
  }
}


mysql_connection.query = function (sql) {
  return new Promise(function (resolve) {

    connection.query(sql, function (error, results, fields) {

      //当查询完毕,结束连接,这种方式比较推荐,会有回调函数
      // connection.end(function (err) {
      //   // The connection is terminated now
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log('end');
      //   }

      // });

      // 释放mysql
      _release(connection);

      //当查询完毕,结束连接,这种方式会立即断开连接,并不会有回调函数
      //connection.destroy();

      //打印数据
      console.log(results);
      //console.log(fields);

      resolve(results);
    });
  });
}

module.exports = mysql_connection;
