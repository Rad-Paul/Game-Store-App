BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Game] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(1000) NOT NULL,
    [Developer] NVARCHAR(1000) NOT NULL,
    [Description] NVARCHAR(1000),
    [releaseDate] DATETIME2 NOT NULL,
    [registeredAt] DATETIME2 NOT NULL CONSTRAINT [Game_registeredAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Game_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Game_Title_key] UNIQUE NONCLUSTERED ([Title])
);

-- CreateTable
CREATE TABLE [dbo].[GameKey] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(32,16) NOT NULL,
    [gameId] INT NOT NULL,
    CONSTRAINT [GameKey_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GameGenre] (
    [id] INT NOT NULL IDENTITY(1,1),
    [gameId] INT NOT NULL,
    [genreId] INT NOT NULL,
    CONSTRAINT [GameGenre_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Genre] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Genre_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[GameKey] ADD CONSTRAINT [GameKey_gameId_fkey] FOREIGN KEY ([gameId]) REFERENCES [dbo].[Game]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GameGenre] ADD CONSTRAINT [GameGenre_gameId_fkey] FOREIGN KEY ([gameId]) REFERENCES [dbo].[Game]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GameGenre] ADD CONSTRAINT [GameGenre_genreId_fkey] FOREIGN KEY ([genreId]) REFERENCES [dbo].[Genre]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
