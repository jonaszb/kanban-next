import { FC } from 'react';

const ButtonBase: FC<{ fullWidth?: boolean; className?: string } & React.ComponentProps<'button'>> = (props) => {
    const { fullWidth, className, ...restProps } = props;
    return (
        <button
            className={`transition-color rounded-full py-4 px-6 font-jakarta text-base font-bold text-white disabled:opacity-25 ${
                fullWidth ? 'w-full' : 'w-fit'
            } ${className || ''}`}
            {...restProps}
        >
            {props.children}
        </button>
    );
};

const ButtonPrimaryLarge: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <ButtonBase className={`bg-primary enabled:hover:bg-primary-light ${className || ''}`} {...restProps}>
            {props.children}
        </ButtonBase>
    );
};

export { ButtonPrimaryLarge };
