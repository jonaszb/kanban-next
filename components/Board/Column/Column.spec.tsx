import { fireEvent, render, screen, waitForElementToBeRemoved } from '../../../utils/test-utils';
import Column from './Column';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { enableFetchMocks } from 'jest-fetch-mock';
import fetchMock from 'fetch-mock';
import React from 'react';
enableFetchMocks();

class FakeMouseEvent extends MouseEvent {
    constructor(type: any, values: { pageX?: number; pageY?: number } = {}) {
        super(type, { buttons: 1, bubbles: true, ...values });

        Object.assign(this, {
            pageX: values.pageX || 0,
            pageY: values.pageY || 0,
        });
    }
}

const colData = {
    color: '#49C4E5',
    uuid: uuidv4(),
    board_uuid: uuidv4(),
    tasks: [],
};

const sampleTask = [
    {
        uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc4',
        column_uuid: uuidv4(),
        name: 'Placeholder 1',
        description: '',
        position: 1,
        subtasks: [
            {
                uuid: '68f4754c-fde6-4596-a46c-b137b31b3f31',
                name: 'a',
                completed: true,
            },
            {
                uuid: 'b3064841-10ad-4b65-a823-f06922c6e449',
                name: 'b',
                completed: false,
            },
            {
                uuid: '7ba031f4-b561-4d80-813a-7c3b0bdc69aa',
                name: 'c',
                completed: false,
            },
        ],
    },
];

const colProps = {
    name: 'todo',
    columnData: colData,
    validating: false,
};

describe('Column', () => {
    test('Renders Column component', () => {
        render(<Column {...colProps} />);
        expect(screen.getByTestId('board-column')).toBeInTheDocument();
    });

    test('Can be rendered without tasks', () => {
        render(<Column {...colProps} />);
        expect(screen.getByTestId('board-column')).toBeInTheDocument();
        expect(screen.queryByTestId('task')).not.toBeInTheDocument();
    });

    test('Can be rendered with a task', () => {
        const props = { ...colProps, columnData: { ...colData, tasks: sampleTask } };
        render(<Column {...props} />);
        expect(screen.getByTestId('board-column')).toBeInTheDocument();
        expect(screen.getByTestId('task')).toBeInTheDocument();
        expect(screen.queryAllByTestId('task')).toHaveLength(1);
    });

    test('Can be rendered with multiple tasks', () => {
        const tasks = [];
        for (let i = 0; i < 10; i++) {
            tasks.push({ ...sampleTask[0], uuid: uuidv4(), name: `Task ${i}` });
        }
        const props = {
            ...colProps,
            columnData: { ...colData, tasks },
        };
        render(<Column {...props} />);
        expect(screen.getByTestId('board-column')).toBeInTheDocument();
        expect(screen.queryAllByTestId('task')).toHaveLength(10);
    });

    test('Heading contains column name', () => {
        render(<Column {...colProps} />);
        const heading = screen.getByTestId('column-header');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('todo');
    });

    test('Heading contains task count (0)', () => {
        render(<Column {...colProps} />);
        const heading = screen.getByTestId('column-header');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('(0)');
    });

    test('Heading contains task count (1)', () => {
        const props = { ...colProps, columnData: { ...colData, tasks: sampleTask } };
        render(<Column {...props} />);
        const heading = screen.getByTestId('column-header');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('(1)');
    });

    test('Heading contains task count (10)', () => {
        const tasks = [];
        for (let i = 0; i < 10; i++) {
            tasks.push({ ...sampleTask[0], uuid: uuidv4(), name: `Task ${i}` });
        }
        const props = {
            ...colProps,
            columnData: { ...colData, tasks },
        };
        render(<Column {...props} />);
        const heading = screen.getByTestId('column-header');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('(10)');
    });

    test('Color indicator is rendered', () => {
        render(<Column {...colProps} />);
        expect(screen.getByTestId('column-color')).toBeInTheDocument();
    });

    test('Color indicator has correct color', () => {
        render(<Column {...colProps} />);
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: ${colData.color}`);
    });

    test('Clicking on color indicator opens color picker', () => {
        render(<Column {...colProps} />);
        const colorIndicator = screen.getByTestId('column-color');
        expect(colorIndicator).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    test('Clicking on color indicator closes color picker', () => {
        render(<Column {...colProps} />);
        const colorIndicator = screen.getByTestId('column-color');
        expect(colorIndicator).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        expect(screen.getByTestId('color-picker')).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
    });

    test('Indicator color changes when color is picked', () => {
        const { container } = render(<Column {...colProps} />);
        const colorIndicator = screen.getByTestId('column-color');
        expect(colorIndicator).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        const colorPicker = screen.getByTestId('color-picker');
        expect(colorPicker).toBeInTheDocument();
        const saturation = container.querySelector('.react-colorful__interactive');
        if (saturation) {
            fireEvent(saturation, new FakeMouseEvent('mousedown', { pageX: 10, pageY: 10 }));
        }
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: rgb(0, 0, 0)`);
    });

    test('Indicator color changes back to initial when color picker is closed', () => {
        const { container } = render(<Column {...colProps} />);
        const colorIndicator = screen.getByTestId('column-color');
        expect(colorIndicator).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        const colorPicker = screen.getByTestId('color-picker');
        expect(colorPicker).toBeInTheDocument();
        const saturation = container.querySelector('.react-colorful__interactive');
        if (saturation) {
            fireEvent(saturation, new FakeMouseEvent('mousedown', { pageX: 10, pageY: 10 }));
        }
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: rgb(0, 0, 0)`);
        fireEvent.click(colorIndicator);
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: ${colData.color}`);
    });

    test('Column color is updated when color is picked', async () => {
        const { container } = render(<Column {...colProps} />);
        const colorIndicator = screen.getByTestId('column-color');
        expect(colorIndicator).toBeInTheDocument();
        fireEvent.click(colorIndicator);
        const colorPicker = screen.getByTestId('color-picker');
        expect(colorPicker).toBeInTheDocument();
        const saturation = container.querySelector('.react-colorful__interactive');
        if (saturation) {
            fireEvent(saturation, new FakeMouseEvent('mousedown', { pageX: 10, pageY: 10 }));
        }
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: rgb(0, 0, 0)`);
        fetchMock.mock(/\/api\/columns\/.*/, 200);
        fireEvent.click(screen.getByTestId('color-submit'));
        await waitForElementToBeRemoved(() => screen.getByTestId('color-picker'));
        expect(screen.getByTestId('column-color')).toHaveStyle(`background-color: rgb(0, 0, 0)`);
    });
});
