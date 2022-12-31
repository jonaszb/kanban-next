import Image from 'next/image';
import LightLogo from './logo-light.svg';
import DarkLogo from './logo-dark.svg';
import MobileLogo from './logo-mobile.svg';

const Logo = () => {
    return (
        <div className="bg-white py-5 px-4 dark:bg-[#2B2C37] sm:py-7 sm:px-6 lg:py-8 lg:px-8">
            <Image className={`hidden dark:sm:block`} src={LightLogo} alt="Kanban Logo" />
            <Image className={`hidden sm:block dark:sm:hidden`} src={DarkLogo} alt="Kanban Logo" />
            <Image className={`sm:hidden`} src={MobileLogo} alt="Kanban Logo" />
        </div>
    );
};

export default Logo;
