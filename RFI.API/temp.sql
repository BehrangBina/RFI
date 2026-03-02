CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "News" (
    "Id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Summary" TEXT NOT NULL,
    "Category" TEXT,
    "Date" TEXT NOT NULL,
    "ReadTimeMinutes" INTEGER,
    "VideoUrl" TEXT,
    "ImageUrl" TEXT,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "PK_News" PRIMARY KEY ("Id")
);

CREATE TABLE "NewsSections" (
    "Id" INTEGER NOT NULL,
    "NewsId" INTEGER NOT NULL,
    "SectionType" TEXT NOT NULL,
    "Title" TEXT,
    "OrderIndex" INTEGER NOT NULL,
    CONSTRAINT "PK_NewsSections" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_NewsSections_News_NewsId" FOREIGN KEY ("NewsId") REFERENCES "News" ("Id") ON DELETE CASCADE
);

CREATE TABLE "KeyPoints" (
    "Id" INTEGER NOT NULL,
    "NewsSectionId" INTEGER NOT NULL,
    "Title" TEXT,
    "Description" TEXT NOT NULL,
    "OrderIndex" INTEGER NOT NULL,
    CONSTRAINT "PK_KeyPoints" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_KeyPoints_NewsSections_NewsSectionId" FOREIGN KEY ("NewsSectionId") REFERENCES "NewsSections" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_KeyPoints_NewsSectionId" ON "KeyPoints" ("NewsSectionId");

CREATE UNIQUE INDEX "IX_News_Slug" ON "News" ("Slug");

CREATE INDEX "IX_NewsSections_NewsId" ON "NewsSections" ("NewsId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260131103312_AddNewsEntities', '8.0.11');

COMMIT;

START TRANSACTION;

CREATE TABLE "Events" (
    "Id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "Location" TEXT,
    "Category" TEXT NOT NULL,
    "Summary" TEXT NOT NULL,
    "Description" TEXT,
    "AttendeeCount" INTEGER,
    "VideoUrl" TEXT,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "PK_Events" PRIMARY KEY ("Id")
);

CREATE TABLE "EventImages" (
    "Id" INTEGER NOT NULL,
    "EventId" INTEGER NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Caption" TEXT,
    "OrderIndex" INTEGER NOT NULL,
    CONSTRAINT "PK_EventImages" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventImages_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE
);

CREATE TABLE "EventSections" (
    "Id" INTEGER NOT NULL,
    "EventId" INTEGER NOT NULL,
    "SectionType" TEXT NOT NULL,
    "Title" TEXT,
    "Content" TEXT NOT NULL,
    "OrderIndex" INTEGER NOT NULL,
    CONSTRAINT "PK_EventSections" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventSections_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_EventImages_EventId" ON "EventImages" ("EventId");

CREATE UNIQUE INDEX "IX_Events_Slug" ON "Events" ("Slug");

CREATE INDEX "IX_EventSections_EventId" ON "EventSections" ("EventId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260131122336_AddEventEntities', '8.0.11');

COMMIT;

START TRANSACTION;

CREATE TABLE "HeroSlides" (
    "Id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Subtitle" TEXT,
    "Description" TEXT,
    "ImageUrl" TEXT NOT NULL,
    "ButtonText" TEXT,
    "ButtonLink" TEXT,
    "OrderIndex" INTEGER NOT NULL,
    "IsActive" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    CONSTRAINT "PK_HeroSlides" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260203115613_AddHeroSlides', '8.0.11');

COMMIT;

START TRANSACTION;

CREATE TABLE "SubjectCategories" (
    "Id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" TEXT,
    "OrderIndex" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "PK_SubjectCategories" PRIMARY KEY ("Id")
);

CREATE TABLE "Trainings" (
    "Id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Summary" TEXT,
    "VideoUrl" TEXT,
    "ImageUrl" TEXT,
    "ReadTimeMinutes" INTEGER,
    "OrderIndex" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "SubjectCategoryId" INTEGER NOT NULL,
    CONSTRAINT "PK_Trainings" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Trainings_SubjectCategories_SubjectCategoryId" FOREIGN KEY ("SubjectCategoryId") REFERENCES "SubjectCategories" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_SubjectCategories_Slug" ON "SubjectCategories" ("Slug");

CREATE UNIQUE INDEX "IX_Trainings_Slug" ON "Trainings" ("Slug");

CREATE INDEX "IX_Trainings_SubjectCategoryId" ON "Trainings" ("SubjectCategoryId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260211095320_AddTrainingEntities', '8.0.11');

COMMIT;

START TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260228094326_InitialPostgres', '8.0.11');

COMMIT;

