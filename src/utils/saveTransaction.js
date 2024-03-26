export default function saveTransaction(inputAddress, outputAddress, time, connection) {
    return new Promise((resolve, reject) => {
      const saveUser = (address) => {
        return new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO users (wallet_address) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), wallet_address=VALUES(wallet_address)',
            [address],
            (err, result) => {
              if (err) reject(err);
              else resolve(result.insertId);
            }
          );
        });
      };
  
      Promise.all([saveUser(inputAddress), saveUser(outputAddress)])
        .then(ids => {
          const [inputId, outputId] = ids;
          connection.query(
            'INSERT INTO transactions (sender_id, receiver_id, timestamp) VALUES (?, ?, ?)',
            [inputId, outputId, time],
            err => {
              if (err) reject(err);
              else resolve();
            }
          );
        }).catch(err => reject(err));
    });
  }