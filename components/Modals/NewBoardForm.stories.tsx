import NewBoardFormElem from './NewBoardForm';
import Modal from './Modal';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Modals',
    component: NewBoardFormElem,
} as Meta<typeof NewBoardFormElem>;

export const NewBoardFormLight: StoryFn<typeof NewBoardFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <NewBoardFormElem onNewBoardCreated={() => {}} />
        </Modal>
    );
};

NewBoardFormLight.parameters = {
    theme: 'light',
};

export const NewBoardFormDark: StoryFn<typeof NewBoardFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <NewBoardFormElem onNewBoardCreated={() => {}} />
        </Modal>
    );
};

NewBoardFormDark.parameters = {
    theme: 'dark',
};
