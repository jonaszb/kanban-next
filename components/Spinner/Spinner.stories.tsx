import type { Meta, StoryFn } from '@storybook/react';
import SpinnerElem from './Spinner';

export default {
    title: 'Components/Spinner',
    component: SpinnerElem,
} as Meta<typeof SpinnerElem>;

export const Spinner: StoryFn<typeof SpinnerElem> = () => {
    return <SpinnerElem />;
};
