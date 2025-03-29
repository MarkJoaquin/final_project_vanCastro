import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  console.log('❌Removing current data❌')

  await prisma.availability.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.planToClass.deleteMany()
  await prisma.planClass.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.location.deleteMany()
  await prisma.transitTime.deleteMany()

  console.log('✅Current data removed✅')

  console.log('🌱Iniciando seed...')

  // Crear instructores y guardar sus IDs
  const instructor1 = await prisma.instructor.create({
    data: {
      name: 'John Doe',
      languages: ['English', 'Portuguese'],
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password',
      licenseNumber: '1234567890',
      experienceYears: 10,
    },
  })

  const instructor2 = await prisma.instructor.create({
    data: {
      name: 'Jane Doe',
      languages: ['English', 'Portuguese'],
      email: 'jane@example.com',
      phone: '1234567890',
      password: 'password',
      licenseNumber: '1234567890',
      experienceYears: 10,
    },
  })

  // Crear disponibilidades usando los IDs de los instructores
  await prisma.availability.createMany({
    data: [
      {
        instructorId: instructor1.id,
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        instructorId: instructor1.id,
        startTime: '10:00',
        endTime: '18:00',
      },
      {
        instructorId: instructor2.id,
        startTime: '08:00',
        endTime: '16:00',
      },
      {
        instructorId: instructor2.id,
        startTime: '11:00',
        endTime: '19:00',
      },
    ],
  })

  // Crear planClasses
  const class7 = await prisma.planClass.create({
    data: {
      name: 'Class 7',
      title: 'Class 7 - Novice Driver',
      description: 'For new drivers starting their journey',
    },
  })

  const class5 = await prisma.planClass.create({
    data: {
      name: 'Class 5',
      title: 'Class 5 - Regular Driver',
      description: 'Standard passenger vehicle license',
    },
  })

  const class4 = await prisma.planClass.create({
    data: {
      name: 'Class 4',
      title: 'Class 4 - Commercial',
      description: 'Taxi, ambulance, and small buses',
    },
  })

  // Crear planes y sus relaciones - Class 7
  const roadLesson1 = await prisma.plan.create({
    data: {
      name: 'Road lesson',
      description: 'A single lesson corresponding to a class 7',
      lessons: 1,
      price: 90,
      time: 60,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class7.id
              }
            }
          }
        ]
      }
    }
  })

  const roadLesson2 = await prisma.plan.create({
    data: {
      name: 'Road lesson',
      description: 'Standard passenger vehicle license - Basic package',
      lessons: 1,
      price: 100,
      time: 90,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class7.id
              }
            }
          }
        ]
      }
    }
  })

  const roadTest = await prisma.plan.create({
    data: {
      name: 'Road test',
      description: 'A road test corresponding to a class 7',
      lessons: 1,
      price: 150,
      time: 45,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class7.id
              }
            }
          }
        ]
      }
    }
  })

  const package1 = await prisma.plan.create({
    data: {
      name: 'Package',
      description: 'A package corresponding to a class 7',
      lessons: 10,
      price: 850,
      time: 60,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class7.id
              }
            }
          }
        ]
      }
    }
  })

  // Crear planes y sus relaciones - Class 5
  const roadLesson3 = await prisma.plan.create({
    data: {
      name: 'Road lesson',
      description: 'A single lesson corresponding to a class 5',
      lessons: 1,
      price: 70,
      time: 60,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class5.id
              }
            }
          }
        ]
      }
    }
  })

  const roadLesson4 = await prisma.plan.create({
    data: {
      name: 'Road lesson',
      description: 'A single lesson corresponding to a class 5',
      lessons: 1,
      price: 90,
      time: 90,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class5.id
              }
            }
          }
        ]
      }
    }
  })

  const roadTest2 = await prisma.plan.create({
    data: {
      name: 'Road test',
      description: 'A road test corresponding to a class 5',
      lessons: 1,
      price: 150,
      time: 45,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class5.id
              }
            }
          }
        ]
      }
    }
  })

  const package2 = await prisma.plan.create({
    data: {
      name: 'Package 1',
      description: 'A package corresponding to a class 5',
      lessons: 2,
      price: 170,
      time: 90,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class5.id
              }
            }
          }
        ]
      }
    }
  })

  const package3 = await prisma.plan.create({
    data: {
      name: 'Package 2',
      description: 'A package corresponding to a class 5',
      lessons: 3,
      price: 250,
      time: 90,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class5.id
              }
            }
          }
        ]
      }
    }
  })

  // Crear planes y sus relaciones - Class 4

  const roadLesson5 = await prisma.plan.create({
    data: {
      name: 'Road lesson',
      description: 'A single lesson corresponding to a class 4',
      lessons: 1,
      price: 120,
      time: 60,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class4.id
              }
            }
          }
        ]
      }
    }
  })

  const roadLesson6 = await prisma.plan.create({
    data: {
      name: 'Road test',
      description: 'A road test corresponding to a class 4',
      lessons: 1,
      price: 150,
      time: 90,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class4.id
              }
            }
          }
        ]
      }
    }
  })

  const roadTest3 = await prisma.plan.create({
    data: {
      name: 'Road test',
      description: 'A road test corresponding to a class 4',
      lessons: 1,
      price: 250,
      time: 60,
      planClasses: {
        create: [
          {
            planClass: {
              connect: {
                id: class4.id
              }
            }
          }
        ]
      }
    }
  })

  // Transit times

  // Ida
  const transitTime1 = await prisma.transitTime.create({
    data: { fromCity: 'North Vancouver', toCity: 'Vancouver', time: 45 }
  })

  const transitTime2 = await prisma.transitTime.create({
    data: { fromCity: 'North Vancouver', toCity: 'Burnaby', time: 45 }
  })

  const transitTime3 = await prisma.transitTime.create({
    data: { fromCity: 'Vancouver', toCity: 'Burnaby', time: 30 }
  })

  // Regreso
  const transitTime4 = await prisma.transitTime.create({
    data: { fromCity: 'Vancouver', toCity: 'North Vancouver', time: 45 }
  })

  const transitTime5 = await prisma.transitTime.create({
    data: { fromCity: 'Burnaby', toCity: 'North Vancouver', time: 45 }
  })

  const transitTime6 = await prisma.transitTime.create({
    data: { fromCity: 'Burnaby', toCity: 'Vancouver', time: 30 }
  })

  /* Localities */

  await prisma.location.createMany({
    data: [
      { name: 'North Vancouver', address: '2555 25th St', city: 'North Vancouver', zip: 'V5A 1A1' },
      { name: 'Vancouver', address: '2555 25th St', city: 'Vancouver', zip: 'V5A 1A1' },
      { name: 'Burnaby', address: '2555 25th St', city: 'Burnaby', zip: 'V5A 1A1' }
    ]
  })

  console.log('Seed completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
