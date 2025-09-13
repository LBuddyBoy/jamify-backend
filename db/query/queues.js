export async function createQueue({ user_id }) {
  const SQL = `
    INSERT INTO queues(user_id)
    VALUES($1)
    RETURNING *
    `;
  const {
    rows: [queue],
  } = await db.query(SQL, [user_id]);
  return queue;
}

export async function getQueueByUserId(user_id) {
  const SQL = `
    SELECT *
    FROM queues
    WHERE user_id = $1
    `;
    
  const {
    rows: [queue],
  } = await db.query(SQL, [user_id]);

  return queue;
}

export async function updateQueue(user_id, { song_ids, current_index }) {
  const SQL = `
    UPDATE queues
    SET song_ids = $2, current_index = $3
    WHERE user_id = $1
    RETURNING *
    `;
  const {
    rows: [queue],
  } = await db.query(SQL, [user_id, song_ids, current_index]);
  return queue;
}

export async function deleteQueue(user_id) {
  const SQL = `
    DELETE FROM queues
    WHERE user_id = $1
    RETURNING *
    `;
  const {
    rows: [queue],
  } = await db.query(SQL, [user_id]);
  return queue;
}
