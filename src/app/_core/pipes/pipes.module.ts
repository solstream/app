import { NgModule } from '@angular/core';
import {CreateDatePipe} from './create-date.pipe';

const pipes = [
    CreateDatePipe,
]
@NgModule({
    declarations: [
        ...pipes
    ],
    imports: [],
    exports: [
        ...pipes
    ]
})
export class PipesModule {
}
