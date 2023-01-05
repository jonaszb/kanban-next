// Import styles, initialize component theme here.
import '../styles/globals.css';
import router from 'next/router';
import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';

beforeMount(async ({ hooksConfig }) => {
  // Before mount, redefine useRouter to return mock value from test.
  router.useRouter = () => hooksConfig.router;
});