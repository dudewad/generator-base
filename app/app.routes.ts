import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StructureBuilder_Cmp} from './module/structure';

const routes: Routes = [
	{
		path: '**',
		component: StructureBuilder_Cmp
	}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);