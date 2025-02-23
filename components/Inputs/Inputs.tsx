import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import { MultiInput, MultiInputChangeEvent, MultiInputFocusEvent } from '../../types';
import { ButtonSecondary } from '../Buttons/Buttons';
import Droppable from '../Drag-and-drop/Droppable';
import { Check, Chevron, Cross, DragIcon } from '../Icons/Icons';
import { v4 as uuidv4 } from 'uuid';
import {
    DndContext,
    DragEndEvent,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import usePopover from '../../hooks/usePopover';

const ErrorMsg: FC<PropsWithChildren> = ({ children }) => {
    return (
        <span className="absolute right-3 -top-2.5 whitespace-nowrap bg-white px-1 text-sm text-danger dark:bg-dark-grey sm:top-2.5 sm:right-4">
            {children}
        </span>
    );
};

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
                        ? 'border-danger sm:pr-24'
                        : 'border-mid-grey border-opacity-25 hover:border-primary focus:border-primary'
                } h-10 min-h-fit w-full cursor-pointer rounded border-2   bg-transparent py-2 px-4 text-sm font-medium text-black placeholder-black placeholder-opacity-25 outline-none focus:placeholder-opacity-0 dark:text-white dark:placeholder-white dark:placeholder-opacity-25 ${
                    className ?? ''
                }`}
            />
            {haserror && errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
        </div>
    );
};

const TextareaField: FC<
    React.ComponentProps<'textarea'> & { haserror?: boolean; errorMsg?: string; small?: boolean }
> = (props) => {
    const { className, haserror, errorMsg, small, ...inputProps } = props;
    return (
        <div className="relative w-full">
            <textarea
                {...inputProps}
                className={`${
                    haserror
                        ? 'border-danger sm:pr-24'
                        : 'border-mid-grey border-opacity-25 hover:border-primary focus:border-primary'
                } ${
                    small ? 'h-10' : 'h-28'
                } w-full cursor-pointer rounded border-2   bg-transparent py-2 px-4 text-sm font-medium text-black placeholder-black placeholder-opacity-25 outline-none focus:placeholder-opacity-0 dark:text-white dark:placeholder-white dark:placeholder-opacity-25 ${
                    className ?? ''
                }`}
            />
            {haserror && errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
        </div>
    );
};

const Input: FC<
    React.ComponentProps<'input'> & { label: string; haserror?: boolean; errorMsg?: string; hideLabel?: boolean }
> = (props) => {
    const { label, className, hideLabel, ...inputProps } = props;
    return (
        <fieldset className={`flex flex-col text-mid-grey dark:text-white ${className ?? ''}`}>
            <FormFieldLabel htmlFor={props.id} hidden={hideLabel}>
                {props.label}
            </FormFieldLabel>
            <InputField {...inputProps} />
        </fieldset>
    );
};

const Textarea: FC<
    React.ComponentProps<'textarea'> & { label: string; haserror?: boolean; errorMsg?: string; small?: boolean }
> = (props) => {
    const { label, className, ...restProps } = props;
    return (
        <fieldset className={`flex flex-col text-mid-grey dark:text-white ${className ?? ''}`}>
            <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>
            <TextareaField {...restProps} />
        </fieldset>
    );
};

const Dropdown: FC<
    React.ComponentProps<'select'> & {
        label?: string;
        options: string[];
        setValue: Function;
        onValueSelected?: Function;
    }
> = (props) => {
    const popover = usePopover();
    const ulRef = useRef<HTMLUListElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const PopoverEl = popover.Component;

    const { label, value, className, setValue, onValueSelected, ...restProps } = props;

    const handleSelectClick = (e: React.MouseEvent<HTMLElement>) => {
        popover.toggle(e);
    };

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        onValueSelected && onValueSelected(e.target.value);
    };

    const handleOptionSelect = (e: React.MouseEvent<HTMLElement>) => {
        const input = e.target as HTMLElement;
        setValue(input.innerText);
        onValueSelected && onValueSelected(input.innerText);
        popover.close();
    };

    const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            popover.toggle(e);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            popover.open(e);
            ulRef.current?.querySelector('li')?.focus();
        }
    };

    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        const input = e.target as HTMLElement;
        const next = input.nextElementSibling as HTMLElement;
        const prev = input.previousElementSibling as HTMLElement;
        const first = ulRef.current?.querySelector('li') as HTMLElement;
        const last = ulRef.current?.querySelectorAll('li')?.[
            ulRef.current?.querySelectorAll('li').length - 1
        ] as HTMLElement;
        if (e.key === 'Enter') {
            setValue(input.innerText);
            popover.close();
            selectRef.current?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            next?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            prev?.focus();
        } else if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            popover.close();
        } else if (e.key === 'Home') {
            e.preventDefault();
            first?.focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            last?.focus();
        }
    };

    return (
        <fieldset className={`flex flex-col text-mid-grey dark:text-white ${className ?? ''}`}>
            {label && <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>}
            <div className="relative">
                <select
                    id={props.id}
                    onChange={onSelectChange}
                    onClick={handleSelectClick}
                    onKeyDown={handleSelectKeyDown}
                    value={value}
                    {...restProps}
                    className="h-10 w-full cursor-pointer appearance-none rounded border-2 border-mid-grey border-opacity-25 bg-transparent py-2 px-4 text-sm font-medium text-black placeholder-black placeholder-opacity-25 outline-none hover:border-primary focus:border-primary focus:placeholder-opacity-0 dark:text-white dark:text-inherit dark:placeholder-white dark:placeholder-opacity-25"
                >
                    {props.options.map((option) => (
                        <option key={option} value={option} className="hidden">
                            {option}
                        </option>
                    ))}
                </select>
                <Chevron
                    className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 scale-125 transition-all`}
                />
                <PopoverEl anchorWidth={true}>
                    <div className="absolute top-12 w-full rounded-md bg-white p-4 dark:bg-v-dark-grey">
                        <ul ref={ulRef} className="space-y-2">
                            {props.options.map((option) => (
                                <li
                                    role={'option'}
                                    key={option}
                                    onClick={handleOptionSelect}
                                    onKeyDown={handleOptionKeyDown}
                                    tabIndex={0}
                                    className="cursor-pointer text-mid-grey hover:text-black focus:text-black focus:outline-none dark:hover:text-white dark:focus:text-white"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                </PopoverEl>
            </div>
        </fieldset>
    );
};

type MultiValueInputProps = React.ComponentProps<'fieldset'> & {
    id?: string;
    label: string;
    changeHandler: Function;
    placeholder?: string;
    values?: MultiInput[];
    draggable?: boolean;
    addBtnText: string;
    fieldType?: 'input' | 'textarea';
    validationHandler: (val: string | undefined) => [boolean, string];
};

const MultiValueInput: FC<MultiValueInputProps> = (props) => {
    const fieldType = props.fieldType ?? 'input';
    const values = props.values ?? [];
    const setValues = props.changeHandler;
    const [id, setId] = React.useState(uuidv4());
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

    const handleInputChange = (e: MultiInputChangeEvent) => {
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
        setId(uuidv4());
        setTimeout(() => setAnimateIn(false), 250);
    };

    const handleDeleteInput = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setAnimateIn(false);
        const { id } = e.currentTarget;
        setTimeout(() => {
            const newValues = values.filter((item) => item.id !== id.replace('delete-', ''));
            setValues(newValues);
        }, 230);
    };

    const handleBlur = (e: MultiInputFocusEvent) => {
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
                sensors={props.draggable ? sensors : []}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
                onDragEnd={handleDragEnd}
                onDragStart={() => setAnimateIn(false)}
            >
                <Droppable droppableId={uuidv4()}>
                    <fieldset className="flex flex-col overflow-x-visible" id={props.id}>
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
                                    showHandle={props.draggable && values.length > 1}
                                    animateIn={animateIn}
                                    fieldType={fieldType}
                                />
                            ))}
                        </SortableContext>
                    </fieldset>
                </Droppable>
                <ButtonSecondary id={props.id ? `${props.id}-add` : undefined} type="button" onClick={onNewColumn}>
                    {props.addBtnText}
                </ButtonSecondary>
            </DndContext>
        </div>
    );
};

const MultiInputRow: FC<{
    id: string;
    onChange: (e: MultiInputChangeEvent) => void;
    value: string;
    placeholder?: string;
    haserror?: boolean;
    errorMsg?: string;
    onBlur: (e: MultiInputFocusEvent) => void;
    onDelete: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
    showHandle?: boolean;
    animateIn?: boolean;
    fieldType: 'input' | 'textarea';
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

    const inputProps = {
        id: props.id,
        onChange: props.onChange,
        className: 'w-full',
        value: props.value,
        placeholder: props.placeholder,
        haserror: props.haserror,
        errorMsg: props.errorMsg,
        onBlur: props.onBlur,
        'data-testid': 'multi-input-field',
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
            {props.fieldType === 'input' ? (
                <InputField {...inputProps} />
            ) : (
                <TextareaField {...inputProps} small={true} />
            )}
            <Cross
                id={`delete-${props.id}`}
                onClick={handleDelete}
                className="ml-4 w-5 cursor-pointer fill-mid-grey transition-colors hover:fill-red-500"
                data-testid="multi-input-delete"
            />
            {props.showHandle && (
                <i ref={setActivatorNodeRef} {...listeners}>
                    <DragIcon className="ml-4 w-5 cursor-grab active:cursor-grabbing" data-testid="multi-input-drag" />
                </i>
            )}
        </div>
    );
};

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & { checked?: boolean }>(
    ({ checked, id, ...props }, ref) => {
        const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChange && props.onChange(e);
        };
        return (
            <>
                <input
                    ref={ref}
                    id={id}
                    checked={checked}
                    type="checkbox"
                    className="hidden"
                    onChange={changeHandler}
                />
                <label
                    htmlFor={id}
                    className={`relative flex aspect-square min-w-[1rem] cursor-pointer items-center justify-center overflow-hidden rounded border border-mid-grey border-opacity-25 bg-white transition-all dark:bg-v-dark-grey ${props.className}`}
                >
                    <div
                        className={`absolute z-0 h-full w-full -translate-x-2 translate-y-2 rounded-full bg-primary transition-all ${
                            checked ? 'scale-[3]' : 'scale-0'
                        }`}
                    />
                    <Check className={`z-10 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
                </label>
            </>
        );
    }
);
Checkbox.displayName = 'Checkbox';

export { Input, MultiValueInput, Textarea, Dropdown, Checkbox };
