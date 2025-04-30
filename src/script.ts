import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);

//   const newLink = await prisma.link.create({
//     data: {
//       url: "www.howtographql.com",
//       description: "Fullstack tutorial for GraphQL",
//     },
//   });
//   console.log(newLink);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
