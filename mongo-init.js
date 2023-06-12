db = db.getSiblingDB('mongodb')


db.createUser({
    user: 'root',
    pwd: 'root',
    roles: [
      {
            role: 'dbOwner',
            db: 'mongodb',
    },
  ],
});