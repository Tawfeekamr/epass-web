-- CreateTable
CREATE TABLE "users"
(
    "id"        SERIAL       NOT NULL,
    "email"     TEXT         NOT NULL,
    "username"  TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,
    "countryId" INTEGER      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries"
(
    "id"   SERIAL NOT NULL,
    "name" TEXT   NOT NULL,
    "code" TEXT   NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "username_rules"
(
    "id"        SERIAL  NOT NULL,
    "countryId" INTEGER NOT NULL,
    "regex"     TEXT    NOT NULL,
    "message"   TEXT    NOT NULL,

    CONSTRAINT "username_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locales"
(
    "id"        SERIAL  NOT NULL,
    "code"      TEXT    NOT NULL,
    "language"  TEXT    NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications"
(
    "id"        SERIAL       NOT NULL,
    "userId"    INTEGER      NOT NULL,
    "message"   TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries" ("code");

-- CreateIndex
CREATE UNIQUE INDEX "username_rules_countryId_key" ON "username_rules" ("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "locales_code_key" ON "locales" ("code");

-- AddForeignKey
ALTER TABLE "users"
    ADD CONSTRAINT "users_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "username_rules"
    ADD CONSTRAINT "username_rules_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications"
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
