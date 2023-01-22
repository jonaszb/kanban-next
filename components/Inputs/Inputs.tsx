import React, { FC, MouseEventHandler, useState } from 'react';
import { MultiInput } from '../../types';
import { ButtonSecondary } from '../Buttons/Buttons';
import Droppable from '../Drag-and-drop/Droppable';
import { Cross, DragIcon } from '../Icons/Icons';
import { v4 as uuidv4 } from 'uuid';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

const FormFieldLabel: FC<React.ComponentProps<'label'>> = (props) => {
    const { className, ...labelProps } = props;
    return (
        <label
            {...labelProps}
            className={`pointer-events-none mb-2 text-sm text-mid-grey dark:text-white ${className ?? ''}`}
        >
            {props.children}
        </label>
    );
};

const InputField: FC<React.ComponentProps<'input'> & { haserror?: boolean; errorMsg?: string }> = (props) => {
    const { className, haserror, errorMsg, ...inputProps } = props;
    return (
        <div className="relative w-full">
            <input
                {...inputProps}
                className={`${
                    haserror
                        ? 'border-danger pr-36'
                        : 'border-mid-grey border-opacity-25 hover:border-primary focus:border-primary'
                } h-10 w-full cursor-pointer rounded border-2   bg-transparent py-2 px-4 text-sm font-medium text-black placeholder-black placeholder-opacity-25 outline-none focus:placeholder-opacity-0 dark:text-white dark:text-inherit dark:placeholder-white dark:placeholder-opacity-25 ${
                    className ?? ''
                }`}
            />
            {haserror && errorMsg && (
                <span className="absolute top-2 right-4 whitespace-nowrap text-danger">{errorMsg}</span>
            )}
        </div>
    );
};

const Input: FC<React.ComponentProps<'input'> & { label: string; haserror?: boolean; errorMsg?: string }> = (props) => {
    const { label, className, ...inputProps } = props;
    return (
        <fieldset className={`flex flex-col text-mid-grey dark:text-white ${className ?? ''}`}>
            <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>
            <InputField {...inputProps} />
        </fieldset>
    );
};

type MultiValueInputProps = React.ComponentProps<'fieldset'> & {
    label: string;
    changeHandler: Function;
    values?: MultiInput[];
    validationHandler: (val: string | undefined) => [boolean, string];
};

const MultiValueInput: FC<MultiValueInputProps> = (props) => {
    const values = props.values ?? [];
    const setValues = props.changeHandler;
    const [id, setId] = React.useState(1);
    const [animateIn, setAnimateIn] = useState(false);

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 10,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        const newValues: MultiInput[] = values.map((item) => {
            if (item.id === id) {
                const [isValid, errorMsg] = props.validationHandler(value);
                return { ...item, value, isValid, errorMsg, isTouched: true };
            }
            return item;
        });
        setValues(newValues);
    };

    const onNewColumn = () => {
        setAnimateIn(true);
        const newValues = [...values, { value: '', id: `${id}`, isValid: false, isTouched: false }];
        setValues(newValues);
        setId((prev) => prev + 1);
        setTimeout(() => setAnimateIn(false), 250);
    };

    const handleDeleteInput = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setAnimateIn(false);
        const { id } = e.currentTarget;
        setTimeout(() => {
            const newValues = values.filter((item) => item.id !== id.replace('delete-', ''));
            setValues(newValues);
        }, 250);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        const newValues: MultiInput[] = values.map((item) => {
            if (item.id === id) {
                const [isValid, errorMsg] = props.validationHandler(value);
                return { ...item, value, isValid, errorMsg, isTouched: true };
            }
            return item;
        });
        setValues(newValues);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const newValues = [...values];
            const oldIndex = values.findIndex((item) => item.id === active.id);
            const newIndex = values.findIndex((item) => item.id === over?.id);
            newValues.splice(newIndex, 0, newValues.splice(oldIndex, 1)[0]);
            setValues(newValues);
        }
    };

    return (
        <div className={props.className ?? ''}>
            <DndContext
                sensors={sensors}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
                onDragEnd={handleDragEnd}
                onDragStart={() => setAnimateIn(false)}
            >
                <Droppable droppableId={uuidv4()}>
                    <fieldset className="flex flex-col overflow-x-visible">
                        <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>
                        <SortableContext items={values.map((val) => val.id)} strategy={verticalListSortingStrategy}>
                            {values.map((item) => (
                                <MultiInputRow
                                    key={item.id}
                                    id={item.id}
                                    onChange={handleInputChange}
                                    value={item.value}
                                    placeholder={props.placeholder}
                                    haserror={!item.isValid && item.isTouched}
                                    errorMsg={item.errorMsg}
                                    onBlur={handleBlur}
                                    onDelete={handleDeleteInput}
                                    showHandle={values.length > 1}
                                    animateIn={animateIn}
                                />
                            ))}
                        </SortableContext>
                    </fieldset>
                </Droppable>
                <ButtonSecondary type="button" onClick={onNewColumn}>
                    + Add New Column
                </ButtonSecondary>
            </DndContext>
        </div>
    );
};

const MultiInputRow: FC<{
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    placeholder?: string;
    haserror?: boolean;
    errorMsg?: string;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onDelete: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
    showHandle?: boolean;
    animateIn?: boolean;
}> = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({
        id: props.id,
    });
    const { role, tabIndex, ...restAttributes } = attributes; // Do not set role and tabIndex to keep the input accessible

    const [isDeleting, setIsDeleting] = useState(false);
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              transition,
          }
        : undefined;

    const handleDelete = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setIsDeleting(true);
        props.onDelete(e);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...restAttributes}
            className={`mb-3 flex items-center ${
                isDeleting ? 'animate-collapse-input' : props.animateIn ? 'last:animate-expand-input' : ''
            }`}
        >
            <InputField
                id={props.id}
                onChange={props.onChange}
                className="w-full"
                value={props.value}
                placeholder={props.placeholder}
                haserror={props.haserror}
                errorMsg={props.errorMsg}
                onBlur={props.onBlur}
            />
            <Cross
                id={`delete-${props.id}`}
                onClick={handleDelete}
                className="ml-4 w-5 cursor-pointer fill-mid-grey transition-colors hover:fill-red-500"
            />
            {props.showHandle && (
                <i ref={setActivatorNodeRef} {...listeners}>
                    <DragIcon className="ml-4 w-5 cursor-grab active:cursor-grabbing" />
                </i>
            )}
        </div>
    );
};

export { Input, MultiValueInput };
