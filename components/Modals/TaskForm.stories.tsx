import NewTaskFormElem from './TaskForm';
import Modal from './Modal';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Modals',
    component: NewTaskFormElem,
} as Meta<typeof NewTaskFormElem>;

export const NewTaskFormLight: StoryFn<typeof NewTaskFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <NewTaskFormElem formType="new" closeModal={() => {}} />
        </Modal>
    );
};

NewTaskFormLight.parameters = {
    theme: 'light',
};

export const NewTaskFormDark: StoryFn<typeof NewTaskFormElem> = (args) => {
    return (
        <Modal closeModal={() => {}}>
            <NewTaskFormElem formType="new" closeModal={() => {}} />
        </Modal>
    );
};

NewTaskFormDark.parameters = {
    theme: 'dark',
};
