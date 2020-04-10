import { Routes } from '@angular/router';
import { FrameComponent, OverlayComponent, UserSettingsComponent } from './page';

export const LAYOUT_MODULE_ROUTES = (frames: Routes) => [
    {
        path: 'user-settings',
        component: UserSettingsComponent,
    },
    {
        path: 'frame/:counter',
        component: FrameComponent,
        children: frames
    },
    {
        path: '**',
        component: OverlayComponent
    }
];