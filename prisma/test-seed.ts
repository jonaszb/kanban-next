import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const userEmail = process.argv[2];
if (!userEmail) {
    throw new Error('User email must be specified');
}

async function main() {
    const usr = await prisma.user.upsert({ where: { email: userEmail }, update: {}, create: { email: userEmail } });
    const board = await prisma.board.create({
        data: {
            uuid: uuidv4(),
            userId: usr.id,
            name: 'Platform Launch',
        },
    });
    await prisma.column.create({
        data: {
            board_uuid: board.uuid,
            name: 'Todo',
            position: 0,
            uuid: uuidv4(),
            userId: usr.id,
            color: '#20d7dd',
            tasks: {
                create: [
                    {
                        name: 'Build Settings UI',
                        uuid: uuidv4(),
                        position: 0,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    { name: 'Account Page', uuid: uuidv4(), userId: usr.id },
                                    { name: 'Billing Page', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Design onboarding flow',
                        uuid: uuidv4(),
                        position: 1,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    { name: 'Sign up page', uuid: uuidv4(), userId: usr.id },
                                    { name: 'Sign in page', uuid: uuidv4(), userId: usr.id },
                                    { name: 'Welcome page', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Build UI for search',
                        uuid: uuidv4(),
                        position: 2,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [{ name: 'Search page', uuid: uuidv4(), userId: usr.id }],
                            },
                        },
                    },
                    {
                        name: 'QA and test all major user journeys',
                        description:
                            'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
                        uuid: uuidv4(),
                        position: 3,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    { name: 'Internal testing', uuid: uuidv4(), userId: usr.id },
                                    { name: 'External testing', uuid: uuidv4(), userId: usr.id },
                                    { name: 'Welcome page', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Add search endpoints',
                        uuid: uuidv4(),
                        position: 4,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    { name: 'Add search endpoint', uuid: uuidv4(), userId: usr.id },
                                    { name: 'Define search filters', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });
    await prisma.column.create({
        data: {
            board_uuid: board.uuid,
            name: 'Doing',
            position: 1,
            uuid: uuidv4(),
            userId: usr.id,
            color: '#9f6ad4',
            tasks: {
                create: [
                    {
                        name: 'Research pricing points of various competitors and trial different business models',
                        description:
                            "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
                        uuid: uuidv4(),
                        position: 0,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Outline a business model that works for our solution',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Research competitor pricing and business models',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Review results of usability tests and iterate',
                        description:
                            "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
                        uuid: uuidv4(),
                        position: 1,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Meet to review notes from previous tests and plan changes',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Make changes to paper prototypes',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    { name: 'Conduct 5 usability tests', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Add account management endpoints',
                        uuid: uuidv4(),
                        position: 2,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Upgrade plan',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Cancel plan',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    { name: 'Upgrade payment method', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Create paper prototypes and conduct 10 usability tests with potential customers',
                        uuid: uuidv4(),
                        position: 3,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Complete 10 usability tests',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    { name: 'Create paper prototypes for version one', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Add authentication endpoints',
                        uuid: uuidv4(),
                        position: 4,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    { name: 'Define user model', completed: true, uuid: uuidv4(), userId: usr.id },
                                    { name: 'Add auth endpoints', uuid: uuidv4(), userId: usr.id },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });
    await prisma.column.create({
        data: {
            board_uuid: board.uuid,
            name: 'Done',
            position: 2,
            uuid: uuidv4(),
            userId: usr.id,
            color: '#23dd74',
            tasks: {
                create: [
                    {
                        name: 'Design settings and search pages',
                        uuid: uuidv4(),
                        position: 0,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Settings - Account page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Settings - Billing page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Search page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Market discovery',
                        description:
                            'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.',
                        uuid: uuidv4(),
                        position: 1,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Interview 10 prospective customers',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Competitor analysis',
                        uuid: uuidv4(),
                        position: 2,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Find direct and indirect competitors',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'SWOT analysis for each competitor',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Conduct 5 wireframe tests',
                        description:
                            'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
                        uuid: uuidv4(),
                        position: 3,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Complete 5 wireframe prototype tests',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Create wireframe prototype',
                        description:
                            'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
                        uuid: uuidv4(),
                        position: 4,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Create clickable wireframe prototype in Balsamiq',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Build UI for onboarding flow',
                        uuid: uuidv4(),
                        position: 5,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Welcome page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Sign up page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Sign in page',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Research the market',
                        description:
                            'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.',
                        uuid: uuidv4(),
                        position: 6,
                        userId: usr.id,
                        subtasks: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Write up research analysis',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                    {
                                        name: 'Calculate TAM',
                                        completed: true,
                                        uuid: uuidv4(),
                                        userId: usr.id,
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });
}

main();
