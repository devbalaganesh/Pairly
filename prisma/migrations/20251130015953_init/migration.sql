-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_paused" BOOLEAN NOT NULL DEFAULT false,
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "name" TEXT,
    "birthdate" TIMESTAMP(3),
    "gender" TEXT,
    "bio" TEXT,
    "location" BYTEA,
    "photos" JSONB,
    "prompts" JSONB,
    "preferences" JSONB,
    "inferred_persona" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "min_age" INTEGER NOT NULL,
    "max_age" INTEGER NOT NULL,
    "preferred_genders" VARCHAR(255)[],
    "dealbreaker_ethnicity" BOOLEAN NOT NULL DEFAULT false,
    "dealbreaker_religion" BOOLEAN NOT NULL DEFAULT false,
    "max_distance_km" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" UUID NOT NULL,
    "match_id" UUID,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "body" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "match_id" UUID NOT NULL,
    "user_a" UUID NOT NULL,
    "user_b" UUID NOT NULL,
    "matched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "swipes" (
    "user_pair" TEXT NOT NULL,
    "swiper" UUID NOT NULL,
    "swipee" UUID NOT NULL,
    "direction" TEXT NOT NULL,
    "swipe_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "swipes_pkey" PRIMARY KEY ("user_pair","swiper","swipee")
);

-- CreateTable
CREATE TABLE "profile_visibility" (
    "viewer_id" UUID NOT NULL,
    "viewed_id" UUID NOT NULL,
    "first_seen_at" TIMESTAMP(3),
    "is_seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "profile_visibility_pkey" PRIMARY KEY ("viewer_id","viewed_id")
);

-- CreateTable
CREATE TABLE "likes_received" (
    "user_id" UUID NOT NULL,
    "liker_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "likes_received_pkey" PRIMARY KEY ("user_id","liker_id")
);

-- CreateTable
CREATE TABLE "swipe_history" (
    "user_pair" TEXT NOT NULL,
    "from_user" UUID NOT NULL,
    "to_user" UUID NOT NULL,
    "direction" TEXT NOT NULL,
    "swipe_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swipe_history_pkey" PRIMARY KEY ("user_pair","from_user","to_user")
);

-- CreateTable
CREATE TABLE "chat_index" (
    "match_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "last_read_at" TIMESTAMP(3),

    CONSTRAINT "chat_index_pkey" PRIMARY KEY ("match_id","user_id")
);

-- CreateTable
CREATE TABLE "seen_profiles" (
    "viewer_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seen_profiles_pkey" PRIMARY KEY ("viewer_id","profile_id")
);

-- CreateTable
CREATE TABLE "user_feed_cache" (
    "user_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feed_cache_pkey" PRIMARY KEY ("user_id","rank")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "matches_user_a_user_b_key" ON "matches"("user_a", "user_b");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_a_fkey" FOREIGN KEY ("user_a") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_b_fkey" FOREIGN KEY ("user_b") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_received" ADD CONSTRAINT "likes_received_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_received" ADD CONSTRAINT "likes_received_liker_id_fkey" FOREIGN KEY ("liker_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
