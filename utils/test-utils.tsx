import { render, RenderOptions } from '@testing-library/react';
import React, { FC, ReactElement } from 'react';
import fs from 'fs';

const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    const view = render(ui, { wrapper, ...options });

    const style = document.createElement('style');
    style.innerHTML = fs.readFileSync('utils/testStyles.css', 'utf8');
    document.head.appendChild(style);

    return view;
};

export * from '@testing-library/react';
export { customRender as render };
