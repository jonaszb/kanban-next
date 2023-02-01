import BoardFormElem from './BoardForm';
import Modal from './Modal';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Modals',
    component: BoardFormElem,
} as Meta<typeof BoardFormElem>;

export const NewBoardFormLight: StoryFn<typeof BoardFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <BoardFormElem formType="new" onNewBoardCreated={() => {}} />
        </Modal>
    );
};

NewBoardFormLight.parameters = {
    theme: 'light',
};

export const NewBoardFormDark: StoryFn<typeof BoardFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <BoardFormElem formType="new" onNewBoardCreated={() => {}} />
        </Modal>
    );
};

NewBoardFormDark.parameters = {
    theme: 'dark',
};
