/*
  Warnings:

  - You are about to drop the column `Description` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `Developer` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `Title` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId,genreId]` on the table `GameGenre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `GameKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `developer` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[GameKey] DROP CONSTRAINT [GameKey_gameId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Game] DROP CONSTRAINT [Game_Title_key];

-- AlterTable
ALTER TABLE [dbo].[Game] DROP COLUMN [Description],
[Developer],
[Title];
ALTER TABLE [dbo].[Game] ADD [description] NVARCHAR(1000),
[developer] NVARCHAR(1000) NOT NULL,
[price] DECIMAL(32,16) NOT NULL,
[title] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[GameKey] ADD [orderItemId] INT,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [GameKey_status_df] DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE [dbo].[Cart] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Cart_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Cart_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[CartItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cartId] INT NOT NULL,
    [gameId] INT NOT NULL,
    [quantity] INT NOT NULL CONSTRAINT [CartItem_quantity_df] DEFAULT 1,
    [addedAt] DATETIME2 NOT NULL CONSTRAINT [CartItem_addedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CartItem_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CartItem_cartId_gameId_key] UNIQUE NONCLUSTERED ([cartId],[gameId])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [total] DECIMAL(32,16) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Order_status_df] DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Order_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [orderId] INT NOT NULL,
    [gameId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [pricePaid] DECIMAL(32,16) NOT NULL,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[Game] ADD CONSTRAINT [Game_title_key] UNIQUE NONCLUSTERED ([title]);

-- CreateIndex
ALTER TABLE [dbo].[GameGenre] ADD CONSTRAINT [GameGenre_gameId_genreId_key] UNIQUE NONCLUSTERED ([gameId], [genreId]);

-- CreateIndex
ALTER TABLE [dbo].[GameKey] ADD CONSTRAINT [GameKey_key_key] UNIQUE NONCLUSTERED ([key]);

-- CreateIndex
ALTER TABLE [dbo].[RefreshToken] ADD CONSTRAINT [RefreshToken_userId_key] UNIQUE NONCLUSTERED ([userId]);

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CartItem] ADD CONSTRAINT [CartItem_gameId_fkey] FOREIGN KEY ([gameId]) REFERENCES [dbo].[Game]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CartItem] ADD CONSTRAINT [CartItem_cartId_fkey] FOREIGN KEY ([cartId]) REFERENCES [dbo].[Cart]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GameKey] ADD CONSTRAINT [GameKey_gameId_fkey] FOREIGN KEY ([gameId]) REFERENCES [dbo].[Game]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GameKey] ADD CONSTRAINT [GameKey_orderItemId_fkey] FOREIGN KEY ([orderItemId]) REFERENCES [dbo].[OrderItem]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_gameId_fkey] FOREIGN KEY ([gameId]) REFERENCES [dbo].[Game]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
