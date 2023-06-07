import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';
import { useEffect } from 'react';
import { mutate } from 'swr';
import Board from '../../../components/Board/Board';
import Layout from '../../../components/Layout/Layout';
import TaskDetails from '../../../components/Modals/TaskDetails';
import Spinner from '../../../components/Spinner/Spinner';
import useModal from '../../../hooks/useModal';
import { useBoardsContext } from '../../../store/BoardListContext';

export default function BoardPage() {
    const { selectedBoard, selectedTask, setSelectedTask, isLoading, isValidating } = useBoardsContext();
    const taskDetailsModal = useModal();
    const Modal = taskDetailsModal.Component;

    useEffect(() => {
        if (selectedTask) {
            taskDetailsModal.open();
        }
    }, [selectedTask]);

    useEffect(() => {
        if (selectedBoard && !taskDetailsModal.isOpen) {
            setSelectedTask(null);
            mutate(`/api/boards/${selectedBoard.uuid}`);
        }
    }, [taskDetailsModal.isOpen]);

    return (
        <Layout>
            <Head>
                <title>{`Kanban${selectedBoard?.name ? ' - ' + selectedBoard.name : ''}`}</title>
                <meta name="description" content={`Task management web app`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <main className="text-bold h-full overflow-scroll p-6 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                {selectedBoard ? (
                    <Board boardUUID={selectedBoard.uuid} />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        {isLoading || isValidating ? (
                            <Spinner />
                        ) : (
                            <div>
                                <h2 className="mb-4 text-3xl font-bold">Board not found</h2>
                                <p>
                                    This board does not exist or is not available to you. <br />
                                    Please select another board
                                </p>
                            </div>
                        )}
                    </div>
                )}
                <Modal>
                    {selectedBoard && selectedTask && (
                        <TaskDetails
                            closeModal={taskDetailsModal.close}
                            taskUUID={selectedTask}
                            columns={selectedBoard.columns}
                        />
                    )}
                </Modal>
            </main>
        </Layout>
    );
}

export async function getServerSideProps(context: GetSessionParams) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
