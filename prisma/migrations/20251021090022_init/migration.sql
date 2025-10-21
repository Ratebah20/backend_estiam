-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projet" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salarie" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salarie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiel" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" DOUBLE PRECISION NOT NULL,
    "projet_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterventionSalaries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterventionSalaries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InterventionMateriels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterventionMateriels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "projet_client_id_idx" ON "projet"("client_id");

-- CreateIndex
CREATE INDEX "intervention_projet_id_idx" ON "intervention"("projet_id");

-- CreateIndex
CREATE INDEX "intervention_date_idx" ON "intervention"("date");

-- CreateIndex
CREATE INDEX "_InterventionSalaries_B_index" ON "_InterventionSalaries"("B");

-- CreateIndex
CREATE INDEX "_InterventionMateriels_B_index" ON "_InterventionMateriels"("B");

-- AddForeignKey
ALTER TABLE "projet" ADD CONSTRAINT "projet_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionSalaries" ADD CONSTRAINT "_InterventionSalaries_A_fkey" FOREIGN KEY ("A") REFERENCES "intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionSalaries" ADD CONSTRAINT "_InterventionSalaries_B_fkey" FOREIGN KEY ("B") REFERENCES "salarie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionMateriels" ADD CONSTRAINT "_InterventionMateriels_A_fkey" FOREIGN KEY ("A") REFERENCES "intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionMateriels" ADD CONSTRAINT "_InterventionMateriels_B_fkey" FOREIGN KEY ("B") REFERENCES "materiel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
