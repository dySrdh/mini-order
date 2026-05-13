import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NAMES = [
  "Aditya Pratama","Budi Santoso","Citra Dewi","Dian Rahayu","Eko Nugroho",
  "Fitri Handayani","Gilang Ramadhan","Hani Kusuma","Irwan Setiawan","Joko Widodo",
  "Kartika Sari","Luthfi Hakim","Maya Anggraini","Naufal Rizky","Olivia Putri",
  "Pandu Wibowo","Qori Amelia","Rizky Firmansyah","Siti Nurhaliza","Taufik Hidayat",
  "Umar Faruq","Vina Melinda","Wahyu Saputra","Xena Clarissa","Yusuf Mansur",
  "Zahra Nadia","Agus Salim","Bagas Wicaksono","Clara Intan","Daffa Arkan",
];

const STATUSES = ["Pending", "Paid", "Cancelled"] as const;

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.order.deleteMany();

  for (let i = 0; i < 30; i++) {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        customerName: NAMES[i],
        totalPrice: parseFloat((Math.random() * 990 + 10).toFixed(2)),
        status,
        createdAt,
      },
    });

    if (status !== "Pending") {
      await prisma.auditLog.create({
        data: {
          orderId: order.id,
          fromStatus: "Pending",
          toStatus: status,
          createdAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("✅ Seeded 30 orders");
}

main().finally(() => prisma.$disconnect());
