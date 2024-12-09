-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_post_id_fkey";

-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_post_id_fkey";

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
