CREATE TABLE
  IF NOT EXISTS notifications (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `externalId` TEXT,
    `channel` TEXT,
    `to` TEXT,
    `body` TEXT,
    `status` TEXT,
    `timestamp` TEXT
  )