import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeatureContainerComponent, UserSettingsFormComponent, UserSettingsHelpComponent } from './component';
import { ResizeDirective } from './directive/resize.directive';
import { OverlayComponent, UserSettingsComponent } from './page';
import { FrameComponent } from './page/frame/frame.component';

@NgModule({
    declarations: [
        // components
        UserSettingsFeatureContainerComponent,
        UserSettingsFormComponent,
        UserSettingsHelpComponent,
        // directives
        ResizeDirective,
        // pages
        OverlayComponent,
        UserSettingsComponent,
        FrameComponent,
    ],
    imports: [SharedModule],
})
export class LayoutModule { }
