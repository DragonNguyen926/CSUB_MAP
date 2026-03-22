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
    {
      slug: "science-iii",
      name: "Science III (CSUB)",
      aliases: ["science iii", "science 3", "sci iii", "sci 3"],
      campus: "CSUB",
      centerLat: 35.34907676153863,
      centerLng: -119.1036877781172,
    },
    {
      slug: "science-i",
      name: "Science I (CSUB)",
      aliases: ["science i", "science 1", "sci i", "sci 1"],
      campus: "CSUB",
      centerLat: 35.34969424406757,
      centerLng: -119.10374142228994,
    },
    {
      slug: "science-ii",
      name: "Science II (CSUB)",
      aliases: ["science ii", "science 2", "sci ii", "sci 2"],
      campus: "CSUB",
      centerLat: 35.34964830221941,
      centerLng: -119.10322375596316,
    },
    {
      slug: "its",
      name: "ITS (CSUB)",
      aliases: ["its", "information technology services", "it services"],
      campus: "CSUB",
      centerLat: 35.351644055479284,
      centerLng: -119.1032954310504,
    },
    {
      slug: "runner-cafe",
      name: "Runner Cafe (CSUB)",
      aliases: ["runner cafe", "cafe", "coffee", "food", "runner coffee"],
      campus: "CSUB",
      centerLat: 35.350859985072184,
      centerLng: -119.10230763251735,
    },
    {
      slug: "starbucks",
      name: "Starbucks (CSUB)",
      aliases: ["starbucks", "coffee", "sbux"],
      campus: "CSUB",
      centerLat: 35.349663318048144,
      centerLng: -119.1012937575289,
    },
    {
      slug: "student-recreation-center",
      name: "Student Recreation Center (CSUB)",
      aliases: ["src", "gym","campus gym", "student recreation center", "rec center", "fitness center"],
      campus: "CSUB",
      centerLat: 35.34895668550058,
      centerLng: -119.10157270725855,
    },
  ]

  await Promise.all(
    buildings.map((b) =>
      prisma.building.upsert({
        where: { slug: b.slug },
        create: b,
        update: b,
      })
    )
  )

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