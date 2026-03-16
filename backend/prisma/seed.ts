import { prisma } from "../src/prisma"

async function main() {
  const buildings = [
    {
      slug: "stiern-library",
      name: "Walter W. Stiern Library (CSUB)",
      aliases: ["library", "stiern", "csub library", "walter w stiern"],
      campus: "CSUB",
      centerLat: 35.3514257,
      centerLng: -119.1032583,
    },
    {
        slug: "administration-west",
        name: "Administration West (CSUB)",
        aliases: ["admin west", "administration west", "adm west", "administration"],
        campus: "CSUB",
        centerLat: 35.35045100942303,
        centerLng: -119.10535968311478,
    },
    {
      slug: "student-union",
      name: "Student Union (CSUB)",
      aliases: ["student union", "su", "csub union", "food court"],
      campus: "CSUB",
      centerLat: 35.349976578758486,
      centerLng: -119.10151612383106,
    },
    {
      slug: "housing-east",
      name: "Student Housing East (CSUB)",
      aliases: ["housing east", "east housing", "dorm east", "csub housing"],
      campus: "CSUB",
      centerLat: 35.3512172187391,
      centerLng: -119.09796238507931,
    },
  ]

  for (const b of buildings) {
    await prisma.building.upsert({
      where: { slug: b.slug },
      create: b,
      update: b,
    })
  }

  console.log(`Seeded ${buildings.length} buildings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })