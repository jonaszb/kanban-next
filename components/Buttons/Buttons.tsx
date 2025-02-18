import { FC } from 'react';

const Button: FC<{ fullWidth?: boolean; className?: string; large?: boolean } & React.ComponentProps<'button'>> = (
    props
) => {
    const { fullWidth, large, className, ...restProps } = props;
    return (
        <button
            className={`whitespace-nowrap rounded-full font-jakarta  font-bold text-white transition-colors disabled:opacity-25 ${
                fullWidth ? 'w-full' : 'w-fit'
            } ${className || ''} ${large ? 'py-4 px-6 text-base' : 'py-2 px-4 text-sm'}`}
            {...restProps}
        >
            {props.children}
        </button>
    );
};

const ButtonPrimaryLarge: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <Button
            large
            className={`bg-primary leading-4 enabled:hover:bg-primary-light ${className || ''}`}
            {...restProps}
        >
            {props.children}
        </Button>
    );
};

const ButtonPrimary: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <Button fullWidth className={`bg-primary enabled:hover:bg-primary-light ${className || ''}`} {...restProps}>
            {props.children}
        </Button>
    );
};

const ButtonSecondary: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <Button
            fullWidth
            className={`enabled:hover:bg-secondary-light bg-primary bg-opacity-10 !text-primary hover:bg-opacity-25 dark:bg-white dark:bg-opacity-100 dark:hover:bg-opacity-100 ${
                className || ''
            }`}
            {...restProps}
        >
            {props.children}
        </Button>
    );
};

const ButtonDanger: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <Button fullWidth className={`bg-danger enabled:hover:bg-danger-light ${className || ''}`} {...restProps}>
            {props.children}
        </Button>
    );
};

export { ButtonPrimaryLarge, ButtonSecondary, ButtonPrimary, ButtonDanger, Button };
