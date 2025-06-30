CREATE TABLE
  IF NOT EXISTS notifications (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `externalId` TEXT,
    `channel` TEXT,
    `to` TEXT,
    `body` TEXT,
    `status` TEXT,
    `timestamp` TEXT
  );

CREATE TABLE
  IF NOT EXISTS webhooks (
    `externalId` TEXT PRIMARY KEY,
    `event` TEXT,
    `timestamp` TEXT,
    `processed` INTEGER
  );