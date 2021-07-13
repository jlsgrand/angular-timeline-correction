import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {TimelineListComponent} from './timeline-list/timeline-list.component';
import {TimelineDetailsComponent} from './timeline-details/timeline-details.component';
import {TimelinePlayComponent} from './timeline-play/timeline-play.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    TimelineListComponent,
    TimelineDetailsComponent,
    TimelinePlayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "", component: TimelineListComponent},
      {path: "edit/:id", component: TimelineDetailsComponent},
      {path: "play/:id", component: TimelinePlayComponent}
    ]),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
